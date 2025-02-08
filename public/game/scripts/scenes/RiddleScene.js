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
   * Expects data to be in the form:
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
      // Fallback (you might want to change this behavior)
      this.currentLevel = 1;
    }
    if (data && data.playerPosition) {
      this.playerPosition = data.playerPosition;
    }
    console.log("RiddleScene initialized for Level:", this.currentLevel);
  }

  preload() {
    // Load the paper background image.
    this.load.image("paper", "assets/oldpaper.png");
  }

  create() {
    console.log("Ridlleeee");
    // Display the paper background.
    this.add.image(400, 300, "paper").setScale(0.8);

    // Display the Title (if available) at the top.
    if (this.currentRiddleData && this.currentRiddleData.Title) {
      this.add.text(400, 200, this.currentRiddleData.Title, {
        fontSize: "28px",
        color: "#000",
        align: "center",
        fontFamily: "'Press Start 2P', cursive",
      }).setOrigin(0.5);
    }

    // Display the riddle question.
    if (this.currentRiddleData && this.currentRiddleData.Riddle) {
      this.add.text(400, 300, this.currentRiddleData.Riddle, {
        fontSize: "20px",
        color: "#000",
        align: "center",
        fontFamily: "'Press Start 2P', cursive",
        wordWrap: { width: 300 },
      }).setOrigin(0.5);
    } else {
      this.add.text(400, 300, "No question available.", {
        fontSize: "20px",
        color: "#000",
        align: "center",
        fontFamily: "'Press Start 2P', cursive",
        wordWrap: { width: 300 },
      }).setOrigin(0.5);
    }

    // Create a key panel to display the link.
    const panelWidth = 150;
    const panelHeight = 100;
    const panelX = 700; // Adjust as needed.
    const panelY = 300;
    const panel = this.add.rectangle(panelX, panelY, panelWidth, panelHeight, 0x000000, 0.7);

    // Add interactive text on top of the panel.
    const linkText = this.add.text(panelX, panelY, "Hint 🫣", {
      fontSize: "18px",
      color: "#ffffff",
      align: "center",
      fontFamily: "'Press Start 2P', cursive",
    }).setOrigin(0.5);
    linkText.setInteractive({ useHandCursor: true });
    linkText.on("pointerdown", () => {
      if (this.currentRiddleData && this.currentRiddleData.Link) {
        window.open(this.currentRiddleData.Link, "_blank");
      }
    });

    // Add a Return button to go back to WorldScene.
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
      this.scene.start("WorldScene", { playerPosition: this.playerPosition });
    });
  }
}
