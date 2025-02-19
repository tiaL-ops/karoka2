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
    // Ensure DOM container is created so Phaser can manage DOM elements.
    super({ key: "AnswerScene", dom: { createContainer: true } });
    this.solution = "";      // Correct answer from the riddle data
    this.currentLevel = null; // Level number
    this.playerPosition = { x: 0, y: 0 }; // For returning to WorldScene

    this.maxAttempts = 7;    // Maximum allowed incorrect attempts
    this.attemptsText = null; // Text object to display attempts remaining

    // We'll store references to our DOM input and submit button so we can hide them later.
    this.inputElement = null;
    this.submitButton = null;
  }

  init(data) {
    if (data && data.riddle) {
      this.solution = data.riddle.Solution;
      this.currentLevel = data.riddle.Level;
    } else {
      console.error("No riddle data passed to AnswerScene");
      this.currentLevel = 1;
      this.solution = "";
    }
    if (data && data.playerPosition) {
      this.playerPosition = data.playerPosition;
    }
    console.log("AnswerScene initialized for Level:", this.currentLevel, "Solution:", this.solution);
  }

  preload() {
    // Optionally preload assets
  }

  async create() {
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
    this.add
      .text(this.cameras.main.width / 2, panelY + 40, "Enter your answer:", {
        font: "20px 'Press Start 2P'",
        fill: "#C0392B",
        stroke: "#FFFFFF",
        strokeThickness: 2,
        align: "center"
      })
      .setOrigin(0.5);

    // --- Create Phaser DOM Input Element for Answer ---
    let panelCenterX = this.cameras.main.width / 2;
    let panelCenterY = panelY + 200; // Adjust vertical position inside the panel

    const inputStyle = `
      width: 200px;
      height: 35px;
      font-size: 16px;
      font-family: 'Press Start 2P';
      text-align: center;
      background: rgba(173,216,230,0.9);
      border: 2px solid #2196F3;
      padding: 5px;
      z-index: 10000;
    `;

    const inputElement = this.add.dom(panelCenterX, panelCenterY, 'input', inputStyle);
    inputElement.node.placeholder = "Type your answer...";
    if (this.solution && this.solution.length) {
      inputElement.node.maxLength = this.solution.length;
    }
    // Save reference for later use.
    this.inputElement = inputElement;
    console.log('Initial Input Element Position:', inputElement.x, inputElement.y);

    // --- Update DOM Input Position on Game Resize ---
    this.scale.on('resize', (gameSize) => {
      panelCenterX = gameSize.width / 2;
      panelCenterY = panelY + 200;
      inputElement.setPosition(panelCenterX, panelCenterY);
      console.log('Resized Input Element Position:', inputElement.x, inputElement.y);
    });

    // --- Create and Display Attempts Remaining Text ---
    this.attemptsText = this.add.text(
      this.cameras.main.width / 2,
      panelY + 80,
      `Attempts left: ${this.maxAttempts}`,
      {
        font: "18px 'Press Start 2P'",
        fill: "#C0392B",
        stroke: "#FFFFFF",
        strokeThickness: 2,
        align: "center"
      }
    ).setOrigin(0.5);

    // Load existing attempt data from Firestore (and update UI accordingly)
    await this.loadAttempts();

    // --- Submit Button ---
    const submitButton = this.add.text(
      this.cameras.main.width / 2,
      panelY + panelHeight - 60,
      "Submit",
      {
        font: "20px 'Press Start 2P', cursive",
        fill: "#E74C3C",
        stroke: "#FFFFFF",
        strokeThickness: 2,
        align: "center"
      }
    ).setOrigin(0.5);
    submitButton.setInteractive({ useHandCursor: true });
    submitButton.on("pointerdown", () => {
      // Only allow submission if input field is visible (attempts remain)
      if (!this.inputElement.visible) {
        return;
      }
      const userInput = this.inputElement.node.value;
      if (!userInput.trim()) {
        this.showMessage("Please enter an answer.", false);
        return;
      }
      this.validateAnswer(userInput);
    });
    this.submitButton = submitButton;

    // --- Return Button ---
    const returnButton = this.add.text(
      this.cameras.main.width / 2,
      panelY + panelHeight - 30,
      "Return",
      {
        font: "20px 'Press Start 2P', cursive",
        fill: "#E74C3C",
        stroke: "#FFFFFF",
        strokeThickness: 2,
        align: "center"
      }
    ).setOrigin(0.5);
    returnButton.setInteractive({ useHandCursor: true });
    returnButton.on("pointerdown", () => {
      this.scene.start("WorldScene", { playerPosition: this.playerPosition });
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
      const logged = await this.logIncorrectAttempt(userInput);
      if (logged === false) {
        // Maximum attempts reached: hide the input field and submit button.
        if (this.inputElement) this.inputElement.setVisible(false);
        if (this.submitButton) this.submitButton.setVisible(false);
        this.showMessage("No attempts left. Game Over.", false);
        this.time.delayedCall(2000, () => {
          this.scene.start("WorldScene", { playerPosition: this.playerPosition });
        });
      } else {
        this.showMessage("Incorrect Answer. Try again.", false);
      }
    }
  }

  showMessage(message, isCorrect) {
    const bgColor = isCorrect ? 0xAAFFAA : 0xFFAAAA;
    const textColor = isCorrect ? "#27AE60" : "#E74C3C";
    const padding = 10;

    const messageText = this.add.text(0, 0, message, {
      font: "20px 'Press Start 2P', cursive",
      fill: textColor,
      stroke: "#FFFFFF",
      strokeThickness: 2,
      align: "center"
    }).setOrigin(0.5);

    const bgWidth = messageText.width + padding * 2;
    const bgHeight = messageText.height + padding * 2;
    const bg = this.add.rectangle(0, 0, bgWidth, bgHeight, bgColor, 0.9).setOrigin(0.5);

    const container = this.add.container(this.cameras.main.width / 2, 500, [bg, messageText]);
    container.setDepth(30);

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

  // Loads the current attempt count for the level from Firestore and updates the UI.
  async loadAttempts() {
    try {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, "profiles", userId);
      const docSnap = await getDoc(docRef);
      let currentCount = 0;
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const incorrectAttempts = existingData.incorrectAttempts || {};
        if (incorrectAttempts[this.currentLevel]) {
          currentCount = incorrectAttempts[this.currentLevel].length;
        }
      }
      const attemptsLeft = this.maxAttempts - currentCount;
      if (this.attemptsText) {
        this.attemptsText.setText(`Attempts left: ${attemptsLeft}`);
      }
      // If no attempts are left, hide the input and submit button.
      if (attemptsLeft <= 0) {
        if (this.inputElement) this.inputElement.setVisible(false);
        if (this.submitButton) this.submitButton.setVisible(false);
      }
    } catch (error) {
      console.error("Error loading attempt data:", error);
    }
  }

  // Logs an incorrect attempt to Firestore and returns:
  // - true if the attempt was logged,
  // - false if the maximum number of attempts has already been reached.
  async logIncorrectAttempt(userInput) {
    try {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, "profiles", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const incorrectAttempts = existingData.incorrectAttempts || {};
        if (!incorrectAttempts[this.currentLevel]) {
          incorrectAttempts[this.currentLevel] = [];
        }
        const currentCount = incorrectAttempts[this.currentLevel].length;

        if (currentCount >= this.maxAttempts) {
          console.log(`Maximum incorrect attempts reached for level ${this.currentLevel}.`);
          if (this.attemptsText) {
            this.attemptsText.setText("No attempts left!");
          }
          return false; // Do not log any new attempt.
        } else {
          incorrectAttempts[this.currentLevel].push({
            answer: userInput,
            timestamp: new Date().toISOString(),
          });
          await setDoc(docRef, { incorrectAttempts }, { merge: true });
          console.log("Incorrect attempt logged for level", this.currentLevel);
          const attemptsLeft = this.maxAttempts - (currentCount + 1);
          console.log(`You have ${attemptsLeft} attempt(s) left.`);
          if (this.attemptsText) {
            this.attemptsText.setText(`Attempts left: ${attemptsLeft}`);
          }
          // If attemptsLeft becomes 0 after this logging, hide the input field.
          if (attemptsLeft <= 0) {
            if (this.inputElement) this.inputElement.setVisible(false);
            if (this.submitButton) this.submitButton.setVisible(false);
          }
          return true;
        }
      }
    } catch (error) {
      console.error("Error logging incorrect attempt:", error);
    }
  }
}
