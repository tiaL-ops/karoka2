

console.log("Hi");
/*import WorldScene from "./WorldScene.js";
import game from "../game.js";
import { db, auth } from "../firebase.js"; // Import Firebase configuration and auth
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

export default class RiddleScene extends Phaser.Scene {
  constructor(riddleData) {
    super({ key: "RiddleScene" });
    this.riddles = []; 
    this.currentRiddle = null; 
    this.isSolved = false;
  }

  // Receive data from the previous scene
  init(data) {
    if (data.currentRiddle) {
      this.currentRiddle = data.currentRiddle; // Store the passed riddle
    }

    if (data.playerPosition) {
      this.playerPosition = { ...data.playerPosition }; // Store player position
    } else {
      this.playerPosition = { x: 0, y: 0 }; // Fallback to a default position
    }

    console.log(
      "Initialized player position in TestScene:",
      this.playerPosition
    );
  }

  preload() {
    this.load.image("paper", "assets/oldpaper.png");
    this.load.image("paperParam", "assets/letterParam.png");
    this.load.json("riddlesData", "assets/riddles/riddles.json"); // Load JSON file
  }

  create() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentUserId = user.uid; // Use Firebase Auth UID
        await this.loadProfileData(user.uid); // Pass the user ID to load profile
        await this.checkIfSolved(); // Ensure isSolved is set before rendering
        this.setupRiddleScene();
      } else {
        console.error("User not logged in.");
      }
    });

    // Load riddles from JSON
    this.riddles = this.cache.json.get("riddlesData"); // Get loaded JSON data
    console.log("Current Riddle:", this.currentRiddle);

    const data = this.currentRiddle || "Level1_Chest"; // Fallback if no riddle is passed
    const parts = data.split("_");
    const level = parseInt(parts[0].replace("Level", "")); // Extract the number after 'Level'
    const type = parts[1]; // 'Chest' or 'Riddle'

    console.log("This is the type" , type);
    this.currentLevel = level; // Use the extracted level
    const riddleOrChest = type.toLowerCase(); // Use the extracted type
    if (type == 'riddle'){
     
    }else{
      console.log("oups not a riddlke");
    }
  }

  displayRiddle() {
    this.add.image(400, 300, "paper").setScale(0.8);

    const riddleData = this.riddles.find((r) => r.level === this.currentLevel);
    if (!riddleData) {
      console.error("Riddle data not found for level:", this.currentLevel);
      return;
    }

    if (this.riddleText) {
      this.riddleText.destroy();
    }

    if (!this.isSolved) {
      this.riddleText = this.add
        .text(400, 150, ` ${riddleData.input} ✍`, {
          fontSize: "20px",
          color: "#000",
          align: "center",
          fontFamily: "Morris Roman, serif",
          wordWrap: { width: 300 },
        })
        .setOrigin(0.5);


      this.riddleText = this.add
        .text(400, 250, riddleData.riddle, {
          fontSize: "20px",
          color: "#000",
          align: "center",
          fontFamily: "Morris Roman, serif",
          wordWrap: { width: 300 },
        })
        .setOrigin(0.5);


    } else {
      this.riddleText = this.add
        .text(400, 200, "Solved!", {
          fontSize: "20px",
          color: "#000",
          align: "center",
          fontFamily: "Morris Roman, serif",
          wordWrap: { width: 300 },
        })
        .setOrigin(0.5);
    }

    const returnText = this.add
      .text(400, 440, "Return", {
        fontSize: "24px",
        color: "#6a1f1f",
        align: "center",
        fontFamily: "Morris Roman, serif",
        stroke: "#f0e6d6",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    returnText.setInteractive({ useHandCursor: true });
    returnText.on("pointerover", () => {
      returnText.setStyle({ color: "#a83b3b" });
    });
    returnText.on("pointerout", () => {
      returnText.setStyle({ color: "#6a1f1f" });
    });

    returnText.on("pointerdown", () => {
      if (this.playerPosition) {
        this.scene.start("WorldScene", { playerPosition: this.playerPosition });
      } else {
        console.error(
          "Player position is undefined. Cannot return to WorldScene."
        );
      }
    });
  }

  showInputField() {
    const riddleData = this.riddles.find((r) => r.level === this.currentLevel);
    if (!riddleData) {
      console.error("Riddle data not found for level:", this.currentLevel);
      return;
    }

    const canvas = this.sys.game.canvas;
    const canvasBounds = canvas.getBoundingClientRect();

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.id = "answer";
    inputElement.placeholder = "Type your answer...";
    inputElement.style.width = "80%";
    inputElement.style.maxWidth = "300px";
    inputElement.style.height = "35px";
    inputElement.style.fontSize = "18px";
    inputElement.style.fontFamily = "Cursive, Press Start 2P, monospace";
    inputElement.style.color = "#4b3621";
    inputElement.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    inputElement.style.border = "none";
    inputElement.style.outline = "none";
    inputElement.style.borderBottom = "2px solid #4b3621";
    inputElement.style.position = "absolute";
    inputElement.style.padding = "5px";
    inputElement.style.left = `${
      canvasBounds.left + canvasBounds.width / 2 - 150
    }px`;
    inputElement.style.top = `${
      canvasBounds.top + canvasBounds.height * 0.5 - 40
    }px`;

    document.body.appendChild(inputElement);

    const returnText = this.add
      .text(400, 400, "Submit", {
        fontSize: "24px",
        color: "#6a1f1f",
        align: "center",
        fontFamily: "Morris Roman, serif",
        stroke: "#f0e6d6",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    returnText.setInteractive({ useHandCursor: true });
    returnText.on("pointerover", () => {
      returnText.setStyle({ color: "#a83b3b" });
    });
    returnText.on("pointerout", () => {
      returnText.setStyle({ color: "#6a1f1f" });
    });

    returnText.on("pointerdown", () => {
      const userInput = inputElement.value;
      this.validateAnswer(riddleData.solution, userInput);
    });

    this.events.once("shutdown", () => {
      inputElement.remove();
    });
  }

  async validateAnswer(solution, userInput) {
    if (userInput.trim() === solution.trim()) {
      this.sendToDatabase(this.currentLevel, 1);
      this.isSolved = true;
      this.displayMessage("Success! You solved the riddle.", true);
      this.showOverlaySuccess();
      this.scene.start("WorldScene", { playerPosition: this.playerPosition });
    } else {

      await this.logIncorrectAttempt(this.currentLevel, userInput);
      this.displayMessage("Incorrect! Try again.", false);
      this.showOverlayFailure();

    }
  }

  async loadProfileData(userId) {
    try {
      const docRef = doc(db, "profiles", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.profileData = docSnap.data();
        //console.log("Profile data loaded:", this.profileData);
      } else {
        // Initialize profile if not found
        this.profileData = { points: 0, disabledLevels: [] };
        await setDoc(docRef, this.profileData);
        console.log("Profile created with default values.");
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  }

  async checkIfSolved() {
    try {
      const docRef = doc(db, "profiles", this.currentUserId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const solvedLevels = data.solvedLevels || [];
        this.isSolved = solvedLevels.includes(this.currentLevel);
      }
    } catch (error) {
      console.error("Error checking if level is solved:", error);
    }
  }

  async sendToDatabase(level, point) {
    try {
      const docRef = doc(db, "profiles", this.currentUserId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const solvedLevels = new Set(existingData.solvedLevels || []);
        solvedLevels.add(level); // Mark the current level as solved
        const riddleData = this.riddles.find((r) => r.level === this.currentLevel);
    if (!riddleData) {
      console.error("Riddle data not found for level:", this.currentLevel);
      return;
    }
        const updatedData = {
          points: (existingData.points || 0) + riddleData.point,
          solvedLevels: Array.from(solvedLevels), // Store as an array
        };
        await setDoc(docRef, updatedData, { merge: true });
      } else {
        const newData = {
          points: point,
          solvedLevels: [level], // Initialize solved levels with the current level
        };
        await setDoc(docRef, newData);
      }
      console.log("Progress updated successfully.");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }

  setupRiddleScene() {
    const data = this.currentRiddle || "Level1_Chest"; // Fallback if no riddle is passed
    const parts = data.split("_");
    const level = parseInt(parts[0].replace("Level", "")); // Extract the number after 'Level'
    const type = parts[1]; // 'Chest' or 'Riddle'

    this.currentLevel = level; // Use the extracted level
    const riddleOrChest = type.toLowerCase(); // Use the extracted type

    if (riddleOrChest === "riddle") {
      this.displayRiddle();
      if (!this.isSolved) {
        this.showInputField();
      }
    } else {
      this.displayRessources();
  }
}

  displayRessources() {
    this.add.image(400, 300, "paper").setScale(0.8);

    const riddleData = this.riddles.find((r) => r.level === this.currentLevel);
    if (!riddleData) {
      console.error("Riddle data not found for level:", this.currentLevel);
      return;
    }
    
    if (this.riddleText) {
      this.riddleText.destroy();
    }
    
    this.ressourceText = this.add
  .text(
    400,
    300,
    `Here is a link to a website that \n may help you! :) \n\n 📖 ${riddleData.textSources} 📖`,
    {
      fontSize: "20px",
      color: "#000",
      align: "center",
      fontFamily: "Morris Roman, serif",
      wordWrap: { width: 300 },
    }
  )
  .setOrigin(0.5)

    
    this.ressourceText.setInteractive({ useHandCursor: true });
    
    this.ressourceText.on("pointerover", () => {
      this.ressourceText.setStyle({ color: "#a83b3b" });
    });
    
    this.ressourceText.on("pointerout", () => {
      this.ressourceText.setStyle({ color: "#6a1f1f" });
    });
    
    this.ressourceText.on("pointerdown", () => {
      const link = riddleData.ressources; // Make sure this is a valid URL
      //console.log(link);
    
      // Open the link in a new tab or window
      window.open(link, "_blank");
    });
    
         
    const returnText = this.add
      .text(400, 440, "Return", {
        fontSize: "24px",
        color: "#6a1f1f",
        align: "center",
        fontFamily: "Morris Roman, serif",
        stroke: "#f0e6d6",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    returnText.setInteractive({ useHandCursor: true });
    returnText.on("pointerover", () => {
      returnText.setStyle({ color: "#a83b3b" });
    });
    returnText.on("pointerout", () => {
      returnText.setStyle({ color: "#6a1f1f" });
    });

    returnText.on("pointerdown", () => {
      if (this.playerPosition) {
        this.scene.start("WorldScene", { playerPosition: this.playerPosition });
      } else {
        console.error(
          "Player position is undefined. Cannot return to WorldScene."
        );
      }
    });
  }

  displayMessage(message, isSuccess) {
    if (this.resultText) {
      this.resultText.destroy();
    }

    this.resultText = this.add
      .text(400, 450, message, {
        fontSize: "20px",
        color: isSuccess ? "#00ff00" : "#ff0000",
        align: "center",
      })
      .setOrigin(0.5);

    if (isSuccess) {
      this.time.delayedCall(2000, () => {
        console.log("You solved the riddle!");
        // Implement success logic here (e.g., load next level)
      });
    }
  }
  // Success (green overlay)
showOverlaySuccess() {
  const overlay = this.add.rectangle(
    this.cameras.main.centerX,
    this.cameras.main.centerY,
    this.cameras.main.width,
    this.cameras.main.height,
    0x00ff00 // Green color
  )
    .setAlpha(0.5) // Semi-transparent
    .setDepth(100); // Ensure it's on top of other elements

  // Fade out the overlay after a short delay
  this.tweens.add({
    targets: overlay,
    alpha: 0,
    duration: 1000, // 1 second
    onComplete: () => overlay.destroy(),
  });
}

// Failure (red overlay)
showOverlayFailure() {
  const overlay = this.add.rectangle(
    this.cameras.main.centerX,
    this.cameras.main.centerY,
    this.cameras.main.width,
    this.cameras.main.height,
    0xff0000 // Red color
  )
    .setAlpha(0.5) // Semi-transparent
    .setDepth(100); // Ensure it's on top of other elements

  // Fade out the overlay after a short delay
  this.tweens.add({
    targets: overlay,
    alpha: 0,
    duration: 1000, // 1 second
    onComplete: () => overlay.destroy(),
  });
}


  async logIncorrectAttempt(level, attemptedAnswer) {
    try {
      const docRef = doc(db, "profiles", this.currentUserId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const incorrectAttempts = existingData.incorrectAttempts || {};
  
        // Ensure there is an array for the current level
        incorrectAttempts[level] = incorrectAttempts[level] || [];
        incorrectAttempts[level].push({
          answer: attemptedAnswer,
          timestamp: new Date().toISOString(),
        });
  
        await setDoc(docRef, { incorrectAttempts }, { merge: true });
      } else {
        // Create a new profile with incorrect attempts
        const newData = {
          incorrectAttempts: {
            [level]: [
              {
                answer: attemptedAnswer,
                timestamp: new Date().toISOString(),
              },
            ],
          },
        };
        await setDoc(docRef, newData);
      }
      console.log("Incorrect attempt logged successfully.");
    } catch (error) {
      console.error("Error logging incorrect attempt:", error);
    }
  }
  
  

}
*/