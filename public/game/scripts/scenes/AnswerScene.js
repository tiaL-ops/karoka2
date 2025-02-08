// AnswerScene.js
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
    // We'll draw our background panel using Graphics.
  }

  create() {
    console.log("AnswerScene create");
    
    // --- Draw a Retro-Styled Background Panel ---
    const panelWidth = 400;
    const panelHeight = 300;
    const panelX = this.cameras.main.width / 2 - panelWidth / 2;
    const panelY = 150;
    
    const graphics = this.add.graphics();
    const fillColor = 0xF8E0E0;     // Light pastel red/pink
    const borderColor = 0xC0392B;   // Deep red accent
    const borderThickness = 6;
    const radius = 12;
    graphics.fillStyle(fillColor, 1);
    graphics.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, radius);
    graphics.lineStyle(borderThickness, borderColor, 1);
    graphics.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, radius);

    // --- Prompt Text ---
    this.add.text(this.cameras.main.width / 2, panelY + 40, "Enter your answer:", {
      font: "20px 'Press Start 2P'",
      fill: "#C0392B",
      stroke: "#FFFFFF",
      strokeThickness: 2,
      align: "center"
    }).setOrigin(0.5);

    // --- Create HTML Input Element for Answer ---
    // We want to center the input inside the panel.
    const canvas = this.sys.game.canvas;
    const canvasBounds = canvas.getBoundingClientRect();
    const inputWidth = 200;
    const inputHeight = 35;
    const absoluteLeft = canvasBounds.left + panelX + (panelWidth - inputWidth) / 2;
    const absoluteTop  = canvasBounds.top + panelY + (panelHeight - inputHeight) / 2;
    
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.id = "answerInput";
    inputElement.placeholder = "Type your answer...";
    inputElement.style.width = `${inputWidth}px`;
    inputElement.style.height = `${inputHeight}px`;
    inputElement.style.fontSize = "16px";
    inputElement.style.fontFamily = "'Press Start 2P'";
    inputElement.style.textAlign = "center";
    inputElement.style.position = "absolute";
    inputElement.style.left = `${absoluteLeft}px`;
    inputElement.style.top = `${absoluteTop}px`;
    inputElement.style.zIndex = "1000";
    // Use a light blue background with blue border.
    inputElement.style.background = "rgba(173,216,230,0.9)"; // Light blue
    inputElement.style.border = "2px solid #2196F3";          // Blue border
    // Limit input length to the solution's length.
    if (this.solution && this.solution.length) {
      inputElement.maxLength = this.solution.length;
    }
    document.body.appendChild(inputElement);

    // --- Submit Button ---
    const submitButton = this.add.text(this.cameras.main.width / 2, panelY + panelHeight - 60, "Submit", {
      font: "20px 'Press Start 2P', cursive",
      fill: "#E74C3C",
      stroke: "#FFFFFF",
      strokeThickness: 2,
      align: "center"
    }).setOrigin(0.5);
    submitButton.setInteractive({ useHandCursor: true });
    submitButton.on("pointerdown", () => {
      const userInput = inputElement.value;
      if (!userInput.trim()) {
        this.showMessage("Please enter an answer.", false);
        return;
      }
      this.validateAnswer(userInput);
    });

    // --- Return Button ---
    const returnButton = this.add.text(this.cameras.main.width / 2, panelY + panelHeight - 30, "Return", {
      font: "20px 'Press Start 2P', cursive",
      fill: "#E74C3C",
      stroke: "#FFFFFF",
      strokeThickness: 2,
      align: "center"
    }).setOrigin(0.5);
    returnButton.setInteractive({ useHandCursor: true });
    returnButton.on("pointerdown", () => {
      this.scene.start("WorldScene", { playerPosition: this.playerPosition });
    });

    // --- Cleanup: Remove the HTML input element when the scene shuts down ---
    this.events.once("shutdown", () => {
      inputElement.remove();
    });
  }

  async validateAnswer(userInput) {
    console.log("Validating answer:", userInput, "against solution:", this.solution);
    if (userInput.trim() === this.solution.trim()) {
      await this.updateFirebase();
      this.showMessage("Correct Answer!", true);
      this.time.delayedCall(2000, () => {
        this.scene.start("WorldScene", { playerPosition: this.playerPosition });
      });
    } else {
      await this.logIncorrectAttempt(userInput);
      this.showMessage("Incorrect Answer. Try again.", false);
    }
  }

  // Create a container with a background rectangle and text message.
  showMessage(message, isCorrect) {
    // Background colors: light green for correct, light red for incorrect, light gray for warnings.
    const bgColor = isCorrect ? 0xAAFFAA : 0xFFAAAA;
    const textColor = isCorrect ? "#27AE60" : "#E74C3C";
    const padding = 10;
    // Create the text object.
    const messageText = this.add.text(0, 0, message, {
      font: "20px 'Press Start 2P', cursive",
      fill: textColor,
      stroke: "#FFFFFF",
      strokeThickness: 2,
      align: "center"
    }).setOrigin(0.5);
    // Create a background rectangle sized to the text with some padding.
    const bgWidth = messageText.width + padding * 2;
    const bgHeight = messageText.height + padding * 2;
    const bg = this.add.rectangle(0, 0, bgWidth, bgHeight, bgColor, 0.9).setOrigin(0.5);
    // Create a container to hold both.
    const container = this.add.container(this.cameras.main.width / 2, 500, [bg, messageText]);
    container.setDepth(30);
    // Optionally remove after a few seconds (or leave it until next message).
    this.time.delayedCall(2000, () => { container.destroy(); });
    return container;
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
