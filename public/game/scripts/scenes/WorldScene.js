import Player from "./Player.js";
import AvatarScene from "./AvatarScene.js";
import config from "../game.js";
import ProfileScene from "./ProfileScene.js";
import game from "../game.js";
import MainMenuScene from "./MainMenuScene.js";
import RiddleScene from "./RiddleScene.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { db, auth } from "../firebase.js"; 
import { doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

export default class WorldScene extends Phaser.Scene {
  constructor(competitionData) {
    super({ key: "WorldScene" });
    this.competitionData = competitionData;
    this.panelContainer = null;
    this.isVisible = false;
    this.player = null;
    this.riddleTriggered = false;
  }

  preload() {
    if (!this.competitionData) {
      console.error("No competition data available for preload.");
      return;
    }

    const data = this.competitionData;

    if (Array.isArray(data.spritesheet)) {
      data.spritesheet.forEach(sprites => {
        this.load.spritesheet(sprites.key, sprites.url, {
          frameWidth: sprites.frameWidth,
          frameHeight: sprites.frameHeight,
        });
      });
    }
    
    if (Array.isArray(data.images)) {
      data.images.forEach(image => {
        this.load.image(image.key, image.url);
      });
    }

    const tilemap = data.tilemap;
    this.load.tilemapTiledJSON(tilemap.key, tilemap.url);

    this.load.on("loaderror", (file) => {
      console.error(`Failed to load asset: ${file.key}`);
    });
  }

  init(data) {
    data = data || {};
    const invalidPosition =
      !data.playerPosition ||
      (data.playerPosition.x === 0 && data.playerPosition.y === 0);
    this.playerPosition = invalidPosition ? { x: 558, y: 202 } : data.playerPosition;
  }

  async create() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
      } else {
        console.error("User not logged in.");
      }
    });

    const toggleButton = this.add.text(10, 10, "Show Panel", {
      font: "16px Arial",
      fill: "#ffffff",
      backgroundColor: "#0000ff",
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    })
      .setInteractive()
      .on("pointerdown", () => {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
          if (!this.panelContainer) {
            this.createPanel();
          }
          this.panelContainer.setVisible(true);
          toggleButton.setText("Hide Panel");
        } else {
          if (this.panelContainer) {
            this.panelContainer.setVisible(false);
          }
          toggleButton.setText("Show Panel");
        }
      })
      .setDepth(1000);
    toggleButton.setScrollFactor(0);

    const map = this.make.tilemap({ key: this.competitionData.tilemap.key });
    const allTilesets = this.competitionData.images.map(image =>
      map.addTilesetImage(image.key, image.key)
    );
    map.createLayer("Background", allTilesets, 0, 0);
    map.createLayer("Foundation", allTilesets, 0, 0);
    map.createLayer("Details", allTilesets, 0, 0);

    const selectedAvatar = localStorage.getItem("selectedAvatar") || "boi";

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.setZoom(1);

    this.player = this.physics.add.sprite(
      this.playerPosition.x,
      this.playerPosition.y,
      selectedAvatar
    );
    this.player.setCollideWorldBounds(true);
    this.createPlayerAnimations(selectedAvatar);
    camera.startFollow(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();

    // Set up collision objects from the "Block" layer.
    const blockLayer = map.getObjectLayer("Block");
    if (blockLayer) {
      const gfx = this.add.graphics();
      gfx.fillStyle(0x000000, 0);
      gfx.fillRect(0, 0, 50, 50);
      const textureKey = "invisibleCollider";
      gfx.generateTexture(textureKey, 1, 1);
      gfx.destroy();

      const blockObjects = this.physics.add.staticGroup();
      blockLayer.objects.forEach(obj => {
        const block = blockObjects.create(obj.x, obj.y, textureKey).setOrigin(0);
        block.body.setSize(obj.width, obj.height).setOffset(0, 0);
      });
      this.physics.add.collider(this.player, blockObjects);
    }

    // Set up riddle zones from the "Riddles" layer.
    const riddleLayer = map.getObjectLayer("Riddles");
    if (riddleLayer) {
      const textureKey = "invisibleCollider"; // Reuse the generated texture
      const riddleZones = this.physics.add.staticGroup();
      riddleLayer.objects.forEach(obj => {
        const zone = riddleZones
          .create(obj.x, obj.y - obj.height, textureKey)
          .setOrigin(0);
        zone.body.setSize(obj.width, obj.height);
        if (obj.properties) {
          const prop = obj.properties.find(p => p.name === "riddleId");
          zone.riddleId = prop ? prop.value : null;
        }
      });
      this.physics.add.overlap(this.player, riddleZones, this.handleRiddleZone, null, this);
    }
  }

  createPlayerAnimations(textureKey) {
    this.anims.create({
      key: `${textureKey}_walk_down`,
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
      key: `${textureKey}_walk_left`,
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
      key: `${textureKey}_walk_up`,
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
      key: `${textureKey}_walk_right`,
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

  handleRiddleZone(player, zone) {
    if (!this.riddleTriggered) {
      this.riddleTriggered = true;
      console.log(`Riddle ${zone.name} found`);
      //this.scene.start("RiddleScene", { riddleId: zone.name });
    }
  }
  

  async createPanel() {
    const panelWidth = Math.min(200, this.cameras.main.width * 0.3);
    const panelHeight = this.cameras.main.height;
    this.panelContainer = this.add
      .container(this.cameras.main.width - panelWidth, 0)
      .setDepth(10)
      .setVisible(false);
    this.panelContainer.setScrollFactor(0);

    const panelBackground = this.add
      .rectangle(0, 0, panelWidth, panelHeight, 0x000000, 0.8)
      .setOrigin(0);
    this.panelContainer.add(panelBackground);

    const Kname = localStorage.getItem("Kname") || localStorage.getItem("Name");
    const usernameText = this.add.text(10, 10, "Username: " + Kname, {
      font: "16px Arial",
      fill: "#ffffff",
    });
    this.panelContainer.add(usernameText);

    const pointsText = this.add.text(10, 40, "Points: 0", {
      font: "16px Arial",
      fill: "#ffffff",
    });
    this.panelContainer.add(pointsText);

    const levelsText = this.add.text(10, 70, "Levels:", {
      font: "16px Arial",
      fill: "#ffffff",
    });
    this.panelContainer.add(levelsText);

    const levelTexts = [];
    const totalLevels = 4;
    const docRef = doc(db, "profiles", this.currentUserId);
    onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const solvedLevels = new Set(
          Array.isArray(data.solvedLevels) ? data.solvedLevels : []
        );
        pointsText.setText(`Points: ${data.points || 0}`);
        for (let i = 1; i <= totalLevels; i++) {
          const isUnlocked = solvedLevels.has(i);
          const content = isUnlocked ? `Level ${i} ✅` : `Level ${i} 🔒`;
          if (levelTexts[i - 1]) {
            levelTexts[i - 1].setText(content);
          } else {
            const levelText = this.add
              .text(10, 100 + (i - 1) * 30, content, {
                font: "14px Arial",
                fill: isUnlocked ? "#00ff00" : "#ff0000",
              })
              .setInteractive()
              .on("pointerdown", () => {
                if (isUnlocked) {
                  // Level click logic here
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

    const mainMenuButton = this.add
      .text(10, panelHeight - 80, "Main Menu", {
        font: "16px Arial",
        fill: "#ff0000",
      })
      .setInteractive()
      .on("pointerdown", () => {
        game.loadScene("MainMenuScene", MainMenuScene);
      });
    this.panelContainer.add(mainMenuButton);
    mainMenuButton.setScrollFactor(0);

    const logoutButton = this.add
      .text(10, panelHeight - 40, "Logout", {
        font: "16px Arial",
        fill: "#ff0000",
      })
      .setInteractive()
      .on("pointerdown", async () => {
        try {
          await signOut(auth);
          document.body.innerHTML = "";
          location.reload();
        } catch (error) {
          console.error("Logout failed:", error.message);
        }
      });
    this.panelContainer.add(logoutButton);
    logoutButton.setScrollFactor(0);
  }

  update() {
    const speed = 200;
    const prefix = localStorage.getItem("selectedAvatar") || "boi";
    this.player.setVelocity(0);
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play(`${prefix}_walk_left`, true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play(`${prefix}_walk_right`, true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play(`${prefix}_walk_up`, true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play(`${prefix}_walk_down`, true);
    } else {
      this.player.anims.stop();
    }
  }
}
