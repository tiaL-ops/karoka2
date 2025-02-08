// UIPanelScene.js
import { db, auth } from "../firebase.js";
import {
  doc,
  onSnapshot,

} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

export default class UIPanelScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIPanelScene" });
  }

  /**
   * Expected data:
   * {
   *   currentUserId: string,
   *   playerPosition: { x, y }
   * }
   */
  init(data) {
    if (data) {
      this.currentUserId = data.currentUserId;
      this.playerPosition = data.playerPosition || { x: 0, y: 0 };
    } else {
      console.error("No data passed to UIPanelScene");
    }
    console.log("UIPanelScene initialized:", {
      currentUserId: this.currentUserId,
      playerPosition: this.playerPosition,
    });
  }

  preload() {
    // No external assets needed for the panel.
  }

  create() {
    // Determine panel dimensions and create a container
    const panelWidth = Math.min(200, this.cameras.main.width * 0.3);
    const panelHeight = this.cameras.main.height;
    this.panelContainer = this.add
      .container(this.cameras.main.width - panelWidth, 0)
      .setDepth(10);
    this.panelContainer.setScrollFactor(0);

    // Add a semi-transparent background for the panel
    const panelBackground = this.add
      .rectangle(0, 0, panelWidth, panelHeight, 0x000000, 0.8)
      .setOrigin(0, 0);
    this.panelContainer.add(panelBackground);

    // Display username
    const Kname =
      localStorage.getItem("Kname") ||
      localStorage.getItem("Name") ||
      "Unknown";
    const usernameText = this.add.text(10, 10, "Username: " + Kname, {
      font: "16px Arial",
      fill: "#ffffff",
    });
    this.panelContainer.add(usernameText);

    // Display points (initially 0; updated via Firebase)
    this.pointsText = this.add.text(10, 40, "Points: 0", {
      font: "16px Arial",
      fill: "#ffffff",
    });
    this.panelContainer.add(this.pointsText);

    // Header for Levels list
    const levelsText = this.add.text(10, 70, "Levels:", {
      font: "16px Arial",
      fill: "#ffffff",
    });
    this.panelContainer.add(levelsText);

    // Retrieve the riddles JSON from cache (using the preloaded key "riddles")
    const riddlesData = this.cache.json.get("riddles");
    if (!riddlesData) {
      console.error("Riddles JSON data not found in cache");
      return;
    }
    const totalLevels = riddlesData.length;
    this.levelTexts = [];

    // Listen for Firebase profile updates (for points and solvedLevels)
    const docRef = doc(db, "profiles", this.currentUserId);
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // solvedLevels is an array of level numbers that have been solved.
        const solvedLevels = new Set(
          Array.isArray(data.solvedLevels) ? data.solvedLevels : []
        );
        this.pointsText.setText(`Points: ${data.points || 0}`);

        // Iterate through every level from the JSON
        for (let i = 0; i < totalLevels; i++) {
          const currentRiddle = riddlesData[i]; // each riddle object
          const level = currentRiddle.Level;
          // If a level is solved, we want to lock it (and display a check mark).
          const isSolved = solvedLevels.has(level);

          // Use the Title if available; otherwise, default to "Level X"
          const displayTitle = currentRiddle.Title
            ? currentRiddle.Title
            : `Level ${level}`;

          // If not solved, then the level is "open" for answering; if solved, then show check mark.
          const levelTextContent = isSolved
            ? `${displayTitle} ✅` // Solved: show check mark and lock the level.
            : `${displayTitle} 🔓`; // Not solved: unlocked, so allow user to answer.

          // Create or update each level text object.
          if (this.levelTexts[i]) {
            this.levelTexts[i].setText(levelTextContent);
            // Use green if solved (locked) and red if unlocked (ready to answer)
            this.levelTexts[i].setFill(isSolved ? "#00ff00" : "#ff0000");
            // Remove interactive behavior if solved.
            if (isSolved) {
              this.levelTexts[i].disableInteractive();
            } else {
              this.levelTexts[i].setInteractive({ useHandCursor: true });
            }
          } else {
            const levelText = this.add
              .text(10, 100 + i * 30, levelTextContent, {
                font: "14px Arial",
                fill: isSolved ? "#00ff00" : "#ff0000",
              });
            // Only add the pointer event if the level is not solved yet.
            if (!isSolved) {
              levelText.setInteractive({ useHandCursor: true });
              levelText.on("pointerdown", () => {
                console.log(`Level ${level} clicked in UIPanelScene`);
                // Launch AnswerScene so the user can enter the answer.
                this.scene.start("AnswerScene", {
                  riddle: currentRiddle,
                  playerPosition: this.playerPosition,
                });
              });
            }
            this.panelContainer.add(levelText);
            this.levelTexts.push(levelText);
          }
        }
      } else {
        console.error("Profile data not found in UIPanelScene");
      }
    });

    // Main Menu button at the bottom
    const mainMenuButton = this.add
      .text(10, panelHeight - 80, "Main Menu", {
        font: "16px Arial",
        fill: "#ff0000",
      })
      .setInteractive({ useHandCursor: true });
    mainMenuButton.on("pointerdown", () => {
      this.scene.start("MainMenuScene");
    });
    this.panelContainer.add(mainMenuButton);
    mainMenuButton.setScrollFactor(0);

    // Logout button at the bottom
    const logoutButton = this.add
      .text(10, panelHeight - 40, "Logout", {
        font: "16px Arial",
        fill: "#ff0000",
      })
      .setInteractive({ useHandCursor: true });
    logoutButton.on("pointerdown", async () => {
      try {
        await signOut(auth);
        console.log("User logged out successfully!");
        document.body.innerHTML = "";
        location.reload();
      } catch (error) {
        console.error("Logout failed:", error.message);
      }
    });
    this.panelContainer.add(logoutButton);
    logoutButton.setScrollFactor(0);
  }
}
