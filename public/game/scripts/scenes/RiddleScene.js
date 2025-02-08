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
    this.currentLevel = null;
    this.currentRiddleData = null;
    this.playerPosition = { x: 0, y: 0 };
  }

  /**
   * Expected data:
   * {
   *   riddle: { Level, Title, Riddle, Link, ... },
   *   playerPosition: { x, y }
   * }
   */
  init(data) {
    if (data && data.riddle) {
      this.currentRiddleData = data.riddle;
      this.currentLevel = data.riddle.Level;
    } else {
      console.error("No riddle data passed to RiddleScene");
      this.currentLevel = 1;
      this.currentRiddleData = { Title: "Unknown", Riddle: "No question available." };
    }
    if (data && data.playerPosition) {
      this.playerPosition = data.playerPosition;
    }
    console.log("RiddleScene initialized for Level:", this.currentLevel);
  }

  preload() {
    // No external image assets are used here; all is drawn with Graphics.
  }

  create() {
    console.log("RiddleScene create");

    // --- Draw the Panel with Drop Shadow ---
    const panelWidth = 500;
    const panelHeight = 400;
    const panelX = this.cameras.main.width / 2 - panelWidth / 2;
    const panelY = 50;
    const radius = 12;
    const borderThickness = 6;

    // Create a Graphics object
    const graphics = this.add.graphics();

    // Draw a subtle drop shadow
    const shadowOffset = 5;
    graphics.fillStyle(0x000000, 0.3);
    graphics.fillRoundedRect(panelX + shadowOffset, panelY + shadowOffset, panelWidth, panelHeight, radius);

    // Draw the main panel (light blue-ish with a deep blue border)
    const fillColor = 0xB3E5FC;   // Light blue (Material Light Blue 100)
    const borderColor = 0x0288D1; // Darker blue (Material Blue 700)
    graphics.fillStyle(fillColor, 1);
    graphics.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, radius);
    graphics.lineStyle(borderThickness, borderColor, 1);
    graphics.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, radius);

    // --- Display the Riddle Title ---
    if (this.currentRiddleData && this.currentRiddleData.Title) {
      const titleText = this.add.text(panelX + panelWidth / 2, panelY + 60, this.currentRiddleData.Title, {
        font: "28px 'Press Start 2P', cursive",
        fill: "#000000",
        align: "center"
      }).setOrigin(0.5);
      // Add a small drop shadow to the text
      titleText.setShadow(2, 2, "#333333", 2, false, true);
    }

    // --- Display the Riddle Question ---
    const question = (this.currentRiddleData && this.currentRiddleData.Riddle) ? this.currentRiddleData.Riddle : "No question available.";
    const questionText = this.add.text(panelX + panelWidth / 2, panelY + 140, question, {
      font: "20px 'Press Start 2P', cursive",
      fill: "#000000",
      align: "center",
      wordWrap: { width: panelWidth - 40 }
    }).setOrigin(0.5);
    questionText.setShadow(2, 2, "#333333", 2, false, true);

    // --- Hint Panel ---
    const hintPanelWidth = 200;
    const hintPanelHeight = 60;
    const hintPanelX = panelX + panelWidth / 2 - hintPanelWidth / 2;
    const hintPanelY = panelY + panelHeight - 140;
    const hintGraphics = this.add.graphics();
    const hintFillColor = 0x000000;
    const hintAlpha = 0.7;
    const hintRadius = 8;
    hintGraphics.fillStyle(hintFillColor, hintAlpha);
    hintGraphics.fillRoundedRect(hintPanelX, hintPanelY, hintPanelWidth, hintPanelHeight, hintRadius);
    const hintText = this.add.text(panelX + panelWidth / 2, hintPanelY + hintPanelHeight / 2, "Hint 🫣", {
      font: "20px 'Press Start 2P', cursive",
      fill: "#FFFFFF",
      align: "center"
    }).setOrigin(0.5);
    hintText.setInteractive({ useHandCursor: true });
    hintText.on("pointerdown", () => {
      if (this.currentRiddleData && this.currentRiddleData.Link) {
        window.open(this.currentRiddleData.Link, "_blank");
      }
    });

    // --- Return Button ---
    const returnButton = this.add.text(panelX + panelWidth / 2, panelY + panelHeight - 40, "Return", {
      font: "24px 'Press Start 2P', cursive",
      fill: "#6a1f1f",
      stroke: "#FFFFFF",
      strokeThickness: 3,
      align: "center"
    }).setOrigin(0.5);
    returnButton.setInteractive({ useHandCursor: true });
    returnButton.on("pointerdown", () => {
      this.scene.start("WorldScene", { playerPosition: this.playerPosition });
    });
    returnButton.setShadow(2, 2, "#333333", 2, false, true);

    // (Optionally, you can add more creative elements like sound effects, animations, etc.)
  }
}
