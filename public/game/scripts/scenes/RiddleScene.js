// RiddleScene.js
import WorldScene from "./WorldScene.js";
import game from "../game.js";
import { db, auth } from "../firebase.js"; // Firebase configuration and auth
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

export default class RiddleScene extends Phaser.Scene {
  constructor() {
    super({ key: "RiddleScene" });
  }

  /**
   * Expected data:
   * {
   *   riddle: { Title, Riddle, Level, Link },
   *   playerPosition: { x, y }
   * }
   */
  init(data) {
    if (data && data.riddle) {
      this.currentRiddleData = data.riddle;
      this.currentLevel = data.riddle.Level;
    } else {
      console.warn("No riddle data provided. Using default values.");
      this.currentLevel = 1;
      this.currentRiddleData = {
        Title: "Mysterious Riddle",
        Riddle:
          "What walks on four legs in the morning, two legs in the afternoon, and three legs in the evening?",
      };
    }
    this.playerPosition = data.playerPosition || { x: 0, y: 0 };
  }

  preload() {
    // No external image assets are required.
  }

  create() {
    // ─── Set a Neutral Blue Background ──────────────────────────
    this.cameras.main.setBackgroundColor("#A3C1DA");

    // ─── Create the Dialog Panel (Smaller Overall) ────────────────
    const panelWidth = 500;
    const panelHeight = 300;
    const panelX = (this.cameras.main.width - panelWidth) / 2;
    const panelY = (this.cameras.main.height - panelHeight) / 2;

    // Create a container to hold the panel elements
    this.dialogContainer = this.add.container(panelX, panelY);

    // Draw a drop shadow for the panel (simulate by drawing an offset rounded rectangle)
    const shadowGraphics = this.add.graphics();
    const shadowOffset = 6;
    shadowGraphics.fillStyle(0x000000, 0.3); // black with 30% opacity
    shadowGraphics.fillRoundedRect(shadowOffset, shadowOffset, panelWidth, panelHeight, 12);
    this.dialogContainer.add(shadowGraphics);

    // Draw the actual panel background with a border
    const panelGraphics = this.add.graphics();
    const fillColor = 0xffffff;   // white fill
    const strokeColor = 0x000000; // black border
    const borderThickness = 4;
    const radius = 12;
    panelGraphics.fillStyle(fillColor, 0.95);
    panelGraphics.fillRoundedRect(0, 0, panelWidth, panelHeight, radius);
    panelGraphics.lineStyle(borderThickness, strokeColor, 1);
    panelGraphics.strokeRoundedRect(0, 0, panelWidth, panelHeight, radius);
    this.dialogContainer.add(panelGraphics);

    // ─── Add the Title Text (Bigger) ──────────────────────────────
    const title = this.add.text(panelWidth / 2, 40, this.currentRiddleData.Title, {
      font: "28px 'Press Start 2P', cursive",
      fill: "#000000",
      stroke: "#ffffff",
      strokeThickness: 2,
      align: "center",
    }).setOrigin(0.5);
    this.dialogContainer.add(title);

    // ─── Add the Riddle Content (Bigger) ──────────────────────────
    const riddleContent = this.currentRiddleData.Riddle || "No riddle provided...";
    const riddleText = this.add.text(panelWidth / 2, panelHeight / 2 - 20, riddleContent, {
      font: "20px 'Press Start 2P', cursive",
      fill: "#000000",
      stroke: "#ffffff",
      strokeThickness: 2,
      align: "center",
      wordWrap: { width: panelWidth - 40 },
    }).setOrigin(0.5);
    this.dialogContainer.add(riddleText);

    // ─── Create Interactive Buttons (Bigger) ──────────────────────
    this.buttonContainer = this.add.container(panelX + 20, panelY + panelHeight - 80);

    const buttonStyle = {
      font: "20px 'Press Start 2P', cursive",
      fill: "#ff0000",
      stroke: "#000000",
      strokeThickness: 2,
    };

    // "Hint" Button
    this.hintButton = this.add.text(30, 0, "Hint 🫣", buttonStyle)
      .setInteractive({ useHandCursor: true });
    this.hintButton.on("pointerdown", () => {
      if (this.currentRiddleData.Link) {
        console.log("Opening hint link...");
        window.open(this.currentRiddleData.Link, "_blank");
      } else {
        console.log("No hint available.");
      }
    });
    this.hintButton.on("pointerover", () => {
      this.updateSelectionIndicator(this.hintButton);
      this.selectedOptionIndex = 0;
    });
    this.buttonContainer.add(this.hintButton);

    // "Return" Button
    this.returnButton = this.add.text(30, 40, "Return", buttonStyle)
      .setInteractive({ useHandCursor: true });
    this.returnButton.on("pointerdown", () => {
      console.log("Returning to WorldScene...");
      this.scene.start("WorldScene", { playerPosition: this.playerPosition });
    });
    this.returnButton.on("pointerover", () => {
      this.updateSelectionIndicator(this.returnButton);
      this.selectedOptionIndex = 1;
    });
    this.buttonContainer.add(this.returnButton);

    // ─── Create the Text-Based Selection Indicator (Retro Arrow) ───
    this.selectionIndicator = this.add.text(panelX + 10, panelY + panelHeight - 70, "►", {
      font: "20px 'Press Start 2P', cursive",
      fill: "#ff0000",
      stroke: "#000000",
      strokeThickness: 2,
    });
    // Position initially next to the "Hint" button
    this.updateSelectionIndicator(this.hintButton);

    // ─── Keyboard Navigation (Optional) ───────────────────────────
    this.options = [this.hintButton, this.returnButton];
    this.selectedOptionIndex = 0;
    this.input.keyboard.on("keydown-UP", () => {
      this.selectedOptionIndex = (this.selectedOptionIndex - 1 + this.options.length) % this.options.length;
      this.updateSelectionIndicator(this.options[this.selectedOptionIndex]);
    });
    this.input.keyboard.on("keydown-DOWN", () => {
      this.selectedOptionIndex = (this.selectedOptionIndex + 1) % this.options.length;
      this.updateSelectionIndicator(this.options[this.selectedOptionIndex]);
    });
    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.selectedOptionIndex === 0) {
        if (this.currentRiddleData.Link) {
          console.log("Opening hint link...");
          window.open(this.currentRiddleData.Link, "_blank");
        } else {
          console.log("No hint available.");
        }
      } else if (this.selectedOptionIndex === 1) {
        console.log("Returning to WorldScene...");
        this.scene.start("WorldScene", { playerPosition: this.playerPosition });
      }
    });
  }

  /**
   * Updates the position of the text-based selection indicator (►)
   * to align with the provided button.
   *
   * @param {Phaser.GameObjects.Text} button - The button to highlight.
   */
  updateSelectionIndicator(button) {
    // Position the indicator 25 pixels to the left of the button.
    this.selectionIndicator.x = button.x - 25;
    // Adjust the y-position to match the button's y relative to the container.
    this.selectionIndicator.y = this.buttonContainer.y + button.y;
  }
}
