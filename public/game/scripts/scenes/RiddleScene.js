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
   * The legend foretells of a riddle...
   * One must decipher its mystery before returning to the world beyond.
   */
  init(data) {
    if (data && data.riddle) {
      this.currentRiddleData = data.riddle;
      this.currentLevel = data.riddle.Level;
    } else {
      console.warn("A wanderer enters with no knowledge of the riddle...");
      this.currentLevel = 1;
    }
    if (data && data.playerPosition) {
      this.playerPosition = data.playerPosition;
    }
    console.log("The chamber of riddles awakens for Level:", this.currentLevel);
  }

  preload() {
    this.load.image("paper", "assets/oldpaper.png");
  }

  create() {
    console.log("A riddle unfolds...");
    this.add.image(400, 300, "paper").setScale(0.8);

    if (this.currentRiddleData && this.currentRiddleData.Title) {
      this.add.text(400, 200, this.currentRiddleData.Title, {
        fontSize: "28px",
        color: "#000",
        align: "center",
        fontFamily: "'Press Start 2P', cursive",
      }).setOrigin(0.5);
    }

    if (this.currentRiddleData && this.currentRiddleData.Riddle) {
      this.add.text(400, 300, this.currentRiddleData.Riddle, {
        fontSize: "20px",
        color: "#000",
        align: "center",
        fontFamily: "'Press Start 2P', cursive",
        wordWrap: { width: 300 },
      }).setOrigin(0.5);
    } else {
      this.add.text(400, 300, "A void of knowledge remains...", {
        fontSize: "20px",
        color: "#000",
        align: "center",
        fontFamily: "'Press Start 2P', cursive",
        wordWrap: { width: 300 },
      }).setOrigin(0.5);
    }

    // Mysterious Panel of Secrets
    const panelX = 700;
    const panelY = 300;
    this.add.rectangle(panelX, panelY, 150, 100, 0x000000, 0.7);

    // Enigmatic Hint Button
    const linkText = this.add.text(panelX, panelY, "Hint 🫣", {
      fontSize: "18px",
      color: "#ffffff",
      align: "center",
      fontFamily: "'Press Start 2P', cursive",
    }).setOrigin(0.5);
    linkText.setInteractive({ useHandCursor: true });
    linkText.on("pointerdown", () => {
      if (this.currentRiddleData && this.currentRiddleData.Link) {
        console.log("The secret path reveals itself...");
        window.open(this.currentRiddleData.Link, "_blank");
      }
    });

    // The Portal Back to the World
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
      console.log("The traveler departs...");
      this.scene.start("WorldScene", { playerPosition: this.playerPosition });
    });
  }
}
