import { db, auth } from "../firebase.js"; // Firebase configuration and auth
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

export default class AnswerScene extends Phaser.Scene {
  constructor() {
    super({ key: "AnswerScene" });
    this.solution = "";      // Correct answer from the riddle data
    this.currentLevel = null; // Level number
    this.playerPosition = { x: 0, y: 0 }; // For returning to WorldScene
  }

  /**
   * Expected data:
   * {
   *   riddle: { Level, Title, Riddle, Solution, Link, … },
   *   playerPosition: { x, y }
   * }
   */
  init(data) {
    if (data && data.riddle) {
      this.solution = data.riddle.Solution; // e.g., "break" or "lambda"
      this.currentLevel = data.riddle.Level;
    } else {
      console.error("No riddle data passed to AnswerScene");
      // Fallback values:
      this.currentLevel = 1;
      this.solution = "";
    }
    if (data && data.playerPosition) {
      this.playerPosition = data.playerPosition;
    }
    console.log("AnswerScene initialized for Level:", this.currentLevel, "Solution:", this.solution);
  }

  preload() {
    // Load a background image for the answer scene (e.g., an old paper)
    this.load.image("answerBg", "assets/oldpaper.png");
  }

  create() {
    console.log("AnswerScene create");
    
    // Add the background image
    this.add.image(400, 300, "answerBg").setScale(0.8);

    // Display prompt text
    this.add.text(400, 150, "Enter your answer:", {
      fontSize: "24px",
      color: "#000",
      align: "center",
      fontFamily: "'Press Start 2P', cursive",
    }).setOrigin(0.5);

    // Create an HTML input element for the answer
    const canvas = this.sys.game.canvas;
    const canvasBounds = canvas.getBoundingClientRect();
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.id = "answerInput";
    inputElement.placeholder = "Type your answer...";
    inputElement.style.width = "300px";
    inputElement.style.height = "35px";
    inputElement.style.fontSize = "18px";
    inputElement.style.fontFamily = "'Press Start 2P', cursive";
    inputElement.style.textAlign = "center";
    inputElement.style.position = "absolute";
    // Center the input over the canvas
    inputElement.style.left = `${canvasBounds.left + canvasBounds.width / 2 - 150}px`;
    inputElement.style.top = `${canvasBounds.top + canvasBounds.height / 2 - 20}px`;
    inputElement.style.zIndex = "1000";
    inputElement.style.background = "rgba(255,255,255,0.9)";
    inputElement.style.border = "2px solid #4b3621";
    
    // Limit input to the number of characters in the solution.
    if (this.solution && this.solution.length) {
      inputElement.maxLength = this.solution.length;
    }
    
    document.body.appendChild(inputElement);

    // Create a Submit button using Phaser text
    const submitButton = this.add.text(400, 400, "Submit", {
      fontSize: "24px",
      color: "#6a1f1f",
      align: "center",
      fontFamily: "'Press Start 2P', cursive",
      stroke: "#f0e6d6",
      strokeThickness: 3,
    }).setOrigin(0.5);
    submitButton.setInteractive({ useHandCursor: true });
    submitButton.on("pointerdown", () => {
      const userInput = inputElement.value;
      this.validateAnswer(userInput);
    });

    // Create a Return button so the user can return without submitting an answer
    const returnButton = this.add.text(400, 450, "Return", {
      fontSize: "24px",
      color: "#6a1f1f",
      align: "center",
      fontFamily: "'Press Start 2P', cursive",
      stroke: "#f0e6d6",
      strokeThickness: 3,
    }).setOrigin(0.5);
    returnButton.setInteractive({ useHandCursor: true });
    returnButton.on("pointerdown", () => {
      // Return to WorldScene, preserving the player position
      this.scene.start("WorldScene", { playerPosition: this.playerPosition });
    });

    // Remove the HTML input element when the scene shuts down
    this.events.once("shutdown", () => {
      inputElement.remove();
    });
  }

  async validateAnswer(userInput) {
    console.log("Validating answer:", userInput, "against solution:", this.solution);
    if (userInput.trim() === this.solution.trim()) {
      // Correct answer: update Firebase (e.g., add points, mark level solved)
      await this.updateFirebase();
      this.add.text(400, 500, "Correct Answer!", {
        fontSize: "24px",
        color: "#00ff00",
        align: "center",
        fontFamily: "'Press Start 2P', cursive",
      }).setOrigin(0.5);
      // Return to WorldScene after a short delay
      this.time.delayedCall(2000, () => {
        this.scene.start("WorldScene", { playerPosition: this.playerPosition });
      });
    } else {
      // Incorrect answer: log the attempt and display a message
      await this.logIncorrectAttempt(userInput);
      this.add.text(400, 500, "Incorrect Answer. Try again.", {
        fontSize: "24px",
        color: "#ff0000",
        align: "center",
        fontFamily: "'Press Start 2P', cursive",
      }).setOrigin(0.5);
    }
  }

  async updateFirebase() {
    try {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, "profiles", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const solvedLevels = new Set(existingData.solvedLevels || []);
        solvedLevels.add(this.currentLevel);
        const updatedData = {
          // For example, add 10 points for a correct answer.
          points: (existingData.points || 0) + 10,
          solvedLevels: Array.from(solvedLevels),
        };
        await setDoc(docRef, updatedData, { merge: true });
        console.log("Firebase updated with correct answer for level", this.currentLevel);
      }
    } catch (error) {
      console.error("Error updating firebase:", error);
    }
  }

  async logIncorrectAttempt(userInput) {
    try {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, "profiles", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const incorrectAttempts = existingData.incorrectAttempts || {};
        // Ensure there's an array for the current level
        incorrectAttempts[this.currentLevel] = incorrectAttempts[this.currentLevel] || [];
        incorrectAttempts[this.currentLevel].push({
          answer: userInput,
          timestamp: new Date().toISOString(),
        });
        await setDoc(docRef, { incorrectAttempts }, { merge: true });
        console.log("Incorrect attempt logged for level", this.currentLevel);
      }
    } catch (error) {
      console.error("Error logging incorrect attempt:", error);
    }
  }
}
