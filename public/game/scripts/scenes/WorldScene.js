import Player from "./Player.js";
import AvatarScene from "./AvatarScene.js";
import config from "../game.js";
import ProfileScene from "./ProfileScene.js";
import game from "../game.js";
import MainMenuScene from "./MainMenuScene.js";
import RiddleScene from "./RiddleScene.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

import { db, auth } from "../firebase.js"; // Import Firebase configuration and auth
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

export default class WorldScene extends Phaser.Scene {
  constructor(competitionData) {
    
    super({ key: "WorldScene" });
    this.competitionData = competitionData;
    this.panelContainer = null; // Define the panel container here
    this.isVisible = false;
    this.player = null;
  }

  preload() {
    if (!this.competitionData) {
        console.error("No competition data available for preload.");
        return;
    }

    const data = this.competitionData;
    console.log("Competition data loaded:", data);

    // Load spritesheet
    if (data.spritesheet) {
        const sprite = data.spritesheet;
        console.log('Here is sprite key',sprite.key);
        this.load.spritesheet(sprite.key, sprite.url, {
            frameWidth: sprite.frameWidth,
            frameHeight: sprite.frameHeight,
        });
    }

    // Load images
    if (Array.isArray(data.images)) {
        data.images.forEach(image => {
            this.load.image(image.key, image.url);
            console.log('Here is image key',image.key);
        });
    }

    // Load tilemap
    
    const tilemap = data.tilemap;
    this.load.tilemapTiledJSON(tilemap.key, tilemap.url);

    // Log asset loading
    this.load.on("complete", () => {
        console.log("All assets loaded successfully.");
    });

    this.load.on("loaderror", (file) => {
        console.error(`Failed to load asset: ${file.key}`);
    });
}

  init(data) {
    if (!data) {
      console.warn("No data passed to init. Falling back to default.");
      data = {};
    }
  
    // Check if player position is invalid
    const isInvalidPosition =
      !data.playerPosition ||
      (data.playerPosition.x === 0 && data.playerPosition.y === 0);
  
    // Use default spawn point if position is invalid
    this.playerPosition = isInvalidPosition ? { x: 558, y: 202 } : data.playerPosition;
  
   // console.log("Player position received:", this.playerPosition);
  }
  
  
  

  async create() {
  
  
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentUserId = user.uid; // Use Firebase Auth UID
      } else {
        console.error("User not logged in.");
      }
    });

    // Create a toggle button
    this.panelContainer = null;
    const toggleButton = this.add
      .text(
        10, // X position
        10, // Y position
        "Show Panel", // Initial button text
        {
          font: "16px Arial",
          fill: "#ffffff",
          backgroundColor: "#0000ff", // Blue background for visibility
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
        }
      )
      .setInteractive()
      .on("pointerdown", () => {
        this.isVisible = !this.isVisible; // Toggle the visibility flag

        if (this.isVisible) {
          if (!this.panelContainer) {
            this.createPanel(); // Create the panel if it doesn't exist
          }
          this.panelContainer.setVisible(true); // Show the panel immediately
          toggleButton.setText("Hide Panel");
        } else {
          if (this.panelContainer) {
            this.panelContainer.setVisible(false); // Hide the panel
          }
          toggleButton.setText("Show Panel");
        }

       
      })
      .setDepth(1000);
    toggleButton.setScrollFactor(0);

    const map = this.make.tilemap({ key: this.competitionData.tilemap.key });
   
    const allTilesets = this.competitionData.images.map(image => {
      return map.addTilesetImage(image.key, image.key);
  });

    const backgroundLayer = map.createLayer("Background", allTilesets, 0, 0);
    const foundationLayer = map.createLayer("Foundation", allTilesets, 0, 0);
    const detailsLayer = map.createLayer("Details", allTilesets, 0, 0);
/*
    // Get the default spawn point from the "Spawn" layer
    //const playerObjectLayer = map.getObjectLayer("Spawn");


    const defaultSpawn = playerObjectLayer.objects.find(
      (obj) => obj.name === "Starting"
    );
*/
    // Use passed position or fallback to default spawn point
    const playerSpawn = this.playerPosition || defaultSpawn;

    if (playerSpawn) {
    

      const startX = playerSpawn.x; // Spawn X coordinate
      const startY = playerSpawn.y; // Spawn Y coordinate

      const selectedAvatar = localStorage.getItem("selectedAvatar") || "boi";

      // Create the player with the current avatar at the determined position
      this.player = new Player(this, startX, startY, selectedAvatar);
      this.player.cursors = this.input.keyboard.createCursorKeys();

      // Create animations specific to the selected avatar
      this.createPlayerAnimations(selectedAvatar);

      // Handle avatar updates dynamically
      this.events.on("avatarChanged", (newAvatar) => {
        this.player.updateTexture(newAvatar);
      });

     
    } else {
      console.error("No valid spawn point found for the player.");
    }

    
    this.physics.world.setBounds(0, 0, backgroundLayer.width, backgroundLayer.height);
    const camera = this.cameras.main;
    camera.setBounds(0, 0, backgroundLayer.width, backgroundLayer.height);
    camera.setZoom(1);

    this.girl = this.physics.add.sprite(100, 100, "girl");
    this.girl.setCollideWorldBounds(true);
    camera.startFollow(this.girl);

    this.cursors = this.input.keyboard.createCursorKeys();
    // Process Block layer to get the objects
    const gameObjectLayer = map.getObjectLayer("Block");

    if (!gameObjectLayer) {
      console.error("Object layer not found!");
      return;
    }
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0); // Transparent fill
    graphics.fillRect(0, 0, 50, 50); // Adjust size to your needs

    const textureKey = "invisibleCollider";
    graphics.generateTexture(textureKey, 1, 1); // Creates a texture from the graphics
    graphics.destroy();

    // Create static groups for trees and rocks
    const objectsBodies = this.physics.add.staticGroup();
    const holeBodies = this.physics.add.staticGroup();
    const waterBodies = this.physics.add.staticGroup();

    // Iterate over all objects in the Blockt layer
    gameObjectLayer.objects.forEach((obj) => {
      if (obj.name === "Hole_Stupid") {
        // Create a physics body for the hole
        const hole = holeBodies.create(obj.x, obj.y, textureKey);
        hole.setOrigin(0);
        hole.body.setSize(obj.width, obj.height).setOffset(0, 0);
      } else if (obj.name === "Stupid") {
        // Create a physics body for the water
        const water = waterBodies.create(obj.x, obj.y, textureKey);
        water.setOrigin(0);
        water.body.setSize(obj.width, obj.height).setOffset(0, 0);
      } else {
        // Create a physics body for any left objects
        const object = objectsBodies.create(obj.x, obj.y, textureKey);
        object.setOrigin(0);
        object.body.setSize(obj.width, obj.height).setOffset(0, 0);
      }
    });

    this.physics.add.collider(this.player, holeBodies, () => {
      console.log("Tha's a hole bruh");
    });

    this.physics.add.collider(this.player, waterBodies, () => {
      console.log(" U wanna die?");
    });

    this.physics.add.collider(this.player, objectsBodies, () => {
      console.log(" Can't walk!");
    });

    // Collision with Riddles:
    const riddleObjectLayer = map.getObjectLayer("Riddles");
    const riddleGroup = this.physics.add.staticGroup();

    riddleObjectLayer.objects.forEach((obj) => {
      const riddle = riddleGroup.create(obj.x, obj.y, textureKey);
      riddle.setOrigin(0);
      riddle.body.setSize(obj.width, obj.height).setOffset(0, 0);
      // Store riddle name for logging
      riddle.name = obj.name;
    });

    // Collision with Chest:
    const chestObjectLayer = map.getObjectLayer("Chests");
    const chestGroup = this.physics.add.staticGroup();

    chestObjectLayer.objects.forEach((obj) => {
      const chest = chestGroup.create(obj.x, obj.y, textureKey);
      chest.setOrigin(0);
      chest.body.setSize(obj.width, obj.height).setOffset(0, 0);
      // Store chest name for logging
      chest.name = obj.name;
    });

    // Add collision handling for riddles
    this.physics.add.collider(this.player, riddleGroup, (player, riddle) => {
      if (riddle.name) {
        console.log(`${riddle.name} encountered`);
        this.currentRiddle = riddle.name;
        const playerPosition = { x: this.player.x, y: this.player.y }; // Save the player's current position

        this.scene.start("RiddleScene", {
          currentRiddle: riddle.name,
          playerPosition,
        });
      } else {
        console.log("A mysterious riddle encountered");
      }
    });

    // Add collision handling for chests
    this.physics.add.collider(this.player, chestGroup, (player, chest) => {
      if (chest.name) {
        this.currentChest = chest.name;
        const playerPosition = { x: this.player.x, y: this.player.y }; // Save the player's current position

        this.scene.start("RiddleScene", {
          currentRiddle: chest.name,
          playerPosition,
        });

        console.log(`${chest.name} encountered`);
      } else {
        console.log("A mysterious chest encountered");
      }
    });

   /* // Camera setup
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player.setCollideWorldBounds(true);
*/
    // Debug camera width and height if necessary

    // Pass input keys to the player
   
  }

  update() {
    if (this.player && this.player.body) {
      this.player.update(); // Update the player (e.g., movement)
    }
  }
/*
  loadAvatar(avatarKey) {
    console.log('loadingavatar: ', sprite.key);
    if (avatarKey === "boi") {
      
      this.load.spritesheet("girl", "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Compet1test%2Fgirl.png?alt=media", {
        frameWidth: 48,
        frameHeight: 48,
      });
    } else {
      this.load.spritesheet("girl", "https://firebasestorage.googleapis.com/v0/b/karoka-game.firebasestorage.app/o/Compet1test%2Fgirl.png?alt=media", {
        frameWidth: 48,
        frameHeight: 48,
      });
    }
  }
*/
  createPlayerAnimations(textureKey) {
    const prefix = textureKey; // Use the texture key as a prefix for unique animation keys

    this.anims.create({
      key: `${prefix}_walk_down`,
      frames: [
        { key: textureKey, frame: 0 },
        { key: textureKey, frame: 4 },
        { key: textureKey, frame: 8 },
        { key: textureKey, frame: 12 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: `${prefix}_walk_left`,
      frames: [
        { key: textureKey, frame: 1 },
        { key: textureKey, frame: 5 },
        { key: textureKey, frame: 9 },
        { key: textureKey, frame: 13 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: `${prefix}_walk_up`,
      frames: [
        { key: textureKey, frame: 2 },
        { key: textureKey, frame: 6 },
        { key: textureKey, frame: 10 },
        { key: textureKey, frame: 14 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: `${prefix}_walk_right`,
      frames: [
        { key: textureKey, frame: 3 },
        { key: textureKey, frame: 7 },
        { key: textureKey, frame: 11 },
        { key: textureKey, frame: 15 },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }

  async createPanel() {
    console.log("They arecalling ");
    const panelWidth = Math.min(200, this.cameras.main.width * 0.3); // 30% of camera width or 200px max
    const panelHeight = this.cameras.main.height; // Full height of the camera
    this.panelContainer = this.add
      .container(
        this.cameras.main.width - panelWidth, // Position on the right edge
        0 // Top of the camera
      )
      .setDepth(10)
      .setVisible(false); // Initially hidden

    // Fix the container to the camera
    this.panelContainer.setScrollFactor(0);

    // Add the panel background
    const panelBackground = this.add
      .rectangle(
        0,
        0, // Relative to the container
        panelWidth,
        panelHeight,
        0x000000,
        0.8
      )
      .setOrigin(0, 0);
    this.panelContainer.add(panelBackground);

    const Kname = localStorage.getItem("Kname") || localStorage.getItem("Name");

    // Add username
    const usernameText = this.add.text(10, 10, "Username: " + Kname, {
      font: "16px Arial",
      fill: "#ffffff",
    });
    this.panelContainer.add(usernameText);

    // Add points text
    const pointsText = this.add.text(10, 40, `Points: 0`, {
      font: "16px Arial",
      fill: "#ffffff",
    });
    this.panelContainer.add(pointsText);

    // Add levels header
    const levelsText = this.add.text(10, 70, `Levels:`, {
      font: "16px Arial",
      fill: "#ffffff",
    });
    this.panelContainer.add(levelsText);

    // Placeholder for levels
    const levelTexts = [];
    const totalLevels = 4; // Number of levels to display

   
    // Fetch Firestore data
    const docRef = doc(db, "profiles", this.currentUserId);

    // Listen for Firestore updates in real-time
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        

        // Safely handle solvedLevels
        const solvedLevels = new Set(
          Array.isArray(data.solvedLevels) ? data.solvedLevels : []
        );

        // Update points
        pointsText.setText(`Points: ${data.points || 0}`);

        // Update levels
        for (let i = 1; i <= totalLevels; i++) {
          const isUnlocked = solvedLevels.has(i);
          const levelTextContent = isUnlocked
            ? `Level ${i} ✅`
            : `Level ${i} 🔒`;

          // If levelText exists, update it; otherwise, create it
          if (levelTexts[i - 1]) {
            levelTexts[i - 1].setText(levelTextContent);
          } else {
            const levelText = this.add
              .text(
                10,
                100 + (i - 1) * 30, // Spaced within the container
                levelTextContent,
                {
                  font: "14px Arial",
                  fill: isUnlocked ? "#00ff00" : "#ff0000",
                }
              )
              .setInteractive()
              .on("pointerdown", () => {
                if (isUnlocked) {
                  console.log(`Level ${i} clicked`);
                } else {
                  console.log(`Level ${i} is locked.`);
                }
              });
            this.panelContainer.add(levelText);
            levelTexts.push(levelText);
          }
        }
      } else {
        console.error("Profile data not found!");
      }
    });

    // Return to Main Menu
    const mainMenuButton = this.add
      .text(
        10,
        panelHeight - 80, // Align to the bottom within the container
        "Main Menu",
        {
          font: "16px Arial",
          fill: "#ff0000",
        }
      )
      .setInteractive()
      .on("pointerdown", () => {
        game.loadScene("MainMenuScene", MainMenuScene);
      });
    this.panelContainer.add(mainMenuButton);
    mainMenuButton.setScrollFactor(0);

    // Add a logout button
    const logoutButton = this.add
      .text(
        10,
        panelHeight - 40, // Align to the bottom within the container
        "Logout",
        {
          font: "16px Arial",
          fill: "#ff0000",
        }
      )
      .setInteractive()
      .on("pointerdown", async () => {
        try {
          await signOut(auth);
          console.log("User logged out successfully!");
          document.body.innerHTML = ""; // Clear the screen
          location.reload(); // Reload to reset to login form
        } catch (error) {
          console.error("Logout failed:", error.message);
        }
      });
    this.panelContainer.add(logoutButton);
    logoutButton.setScrollFactor(0);
  }
  update() {
    const speed = 200;
    this.girl.setVelocity(0);

    if (this.cursors.left.isDown) this.girl.setVelocityX(-speed);
    if (this.cursors.right.isDown) this.girl.setVelocityX(speed);
    if (this.cursors.up.isDown) this.girl.setVelocityY(-speed);
    if (this.cursors.down.isDown) this.girl.setVelocityY(speed);
}
}