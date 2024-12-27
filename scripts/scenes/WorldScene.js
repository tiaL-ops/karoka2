import Player from "./Player.js";
import AvatarScene from "./AvatarScene.js";
import config from "../game.js";

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: "WorldScene" });
  }

  preload() {
    // Load the spritesheet for the player and the tilesets
    const selectedAvatar = localStorage.getItem("selectedAvatar");

    if (selectedAvatar === "boi") {
      this.load.spritesheet("player", "assets/maps/boiTest.png", {
        frameWidth: 48,
        frameHeight: 48,
      });
    } else {
      this.load.spritesheet("player", "assets/maps/girl.png", {
        frameWidth: 48,
        frameHeight: 48,
      });
    }

    this.load.image("chest2", "assets/maps/chest2.png");
    this.load.image("forest_tiles", "assets/maps/forest_tiles.png");
    this.load.image("sign_post", "assets/maps/sign_post.svg");
    this.load.image("terrain_atlas", "assets/maps/terrain_atlas.png");
    this.load.image("terrain", "assets/maps/terrain.png");

    this.load.tilemapTiledJSON("WPMap", "assets/maps/WPMAP.json");
  }

  create() {
    // Create a toggle button
    const toggleButton = this.add
      .text(
        10, // X position (adjust as needed)
        10, // Y position (adjust as needed)
        "Pause", // Button text
        {
          font: "16px Arial",
          fill: "#ffffff",
          backgroundColor: "#0000ff", // Blue background for visibility
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
        }
      )
      .setInteractive()
      .on("pointerdown", () => {
        
        isVisible = !isVisible; // Toggle the visibility flag
        panelContainer.setVisible(isVisible); // Show/hide the panel
        console.log(`Panel visibility: ${isVisible ? "visible" : "hidden"}`);
      })
      .setDepth(9); // Ensure it appears above other elements

    // Fix the toggle button to the camera
    toggleButton.setScrollFactor(0);
    let isVisible = true;
    const panelWidth = Math.min(200, this.cameras.main.width * 0.3); // 30% of camera width or 200px max
    const panelHeight = this.cameras.main.height; // Full height of the camera

    // Create the container to hold the panel
    const panelContainer = this.add
      .container(
        this.cameras.main.width - panelWidth, // Position on the right edge
        0 // Top of the camera
      )
      .setDepth(10);

    // Fix the container to the camera
    panelContainer.setScrollFactor(0);

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
    panelContainer.add(panelBackground);

    // Add example content to the panel
    const usernameText = this.add.text(10, 10, "Username: Player", {
      font: "16px Arial",
      fill: "#ffffff",
    });
    panelContainer.add(usernameText);

    // Adjust button or text content positions dynamically
    const logoutButton = this.add
      .text(
        10,
        panelHeight - 40, // Align to the bottom of the panel
        "Logout",
        {
          font: "16px Arial",
          fill: "#ff0000",
        }
      )
      .setInteractive()
      .on("pointerdown", () => {
        console.log("Logged out!");
      });
    panelContainer.add(logoutButton);

    // Handle dynamic resizing if the game window changes size
    this.scale.on("resize", (gameSize) => {
      const { width, height } = gameSize;

      // Update panel dimensions and position
      const newPanelWidth = Math.min(200, width * 0.3);
      const newPanelHeight = height;

      panelBackground.width = newPanelWidth;
      panelBackground.height = newPanelHeight;

      panelContainer.x = width - newPanelWidth;
      panelContainer.y = 0;

      logoutButton.y = newPanelHeight - 40; // Realign the logout button
    });

    const map = this.make.tilemap({ key: "WPMap" });
    const chestTileset = map.addTilesetImage("chest2", "chest2");
    const forestTilesTileset = map.addTilesetImage(
      "forest_tiles",
      "forest_tiles"
    );
    const signPostTileset = map.addTilesetImage("sign_post", "sign_post");
    const terrainAtlasTileset = map.addTilesetImage(
      "terrain_atlas",
      "terrain_atlas"
    );
    const terrainTileset = map.addTilesetImage("terrain", "terrain");

    const allTilesets = [
      chestTileset,
      forestTilesTileset,
      signPostTileset,
      terrainAtlasTileset,
      terrainTileset,
    ];

    map.createLayer("Background", allTilesets, 0, 0);
    map.createLayer("Details", allTilesets, 0, 0);
    map.createLayer("Trees", allTilesets, 0, 0);
    map.createLayer("Sign_Chest", allTilesets, 0, 0);
    map.createLayer("Resolved", allTilesets, 0, 0);
    map.createLayer("Hint", allTilesets, 0, 0);

    // Create animations for the player
    this.anims.create({
      key: "walk_down",
      frames: [
        { key: "player", frame: 0 },
        { key: "player", frame: 4 },
        { key: "player", frame: 8 },
        { key: "player", frame: 12 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_left",
      frames: [
        { key: "player", frame: 1 },
        { key: "player", frame: 5 },
        { key: "player", frame: 9 },
        { key: "player", frame: 13 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_up",
      frames: [
        { key: "player", frame: 2 },
        { key: "player", frame: 6 },
        { key: "player", frame: 10 },
        { key: "player", frame: 14 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_right",
      frames: [
        { key: "player", frame: 3 },
        { key: "player", frame: 7 },
        { key: "player", frame: 11 },
        { key: "player", frame: 15 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    // Process PlayerObject layer to get the player spawn point
    const playerObjectLayer = map.getObjectLayer("Spawn");
    const playerSpawn = playerObjectLayer.objects.find(
      (obj) => obj.name === "Starting"
    );

    if (playerSpawn) {
      console.log("Bf Player");
      console.log(this.textures.exists("player"));
      this.player = new Player(this, playerSpawn.x, playerSpawn.y, "player", 0); // Use frame 0 for the player
      console.log("Player created:", this.player);
    }

    // Process Block layer to get the objects
    const gameObjectLayer = map.getObjectLayer("Block");
    if (!gameObjectLayer) {
      console.error("Object layer not found!");
      return;
    }

    // Create static groups for trees and rocks
    const objectsBodies = this.physics.add.staticGroup();
    const holeBodies = this.physics.add.staticGroup();
    const waterBodies = this.physics.add.staticGroup();

    // Iterate over all objects in the Blockt layer
    gameObjectLayer.objects.forEach((obj) => {
      if (obj.name === "Hole_Stupid") {
        // Create a physics body for the hole
        const hole = holeBodies.create(obj.x, obj.y, null);
        hole.setOrigin(0);
        hole.body.setSize(obj.width, obj.height).setOffset(0, 0);
      } else if (obj.name === "Stupid") {
        // Create a physics body for the water
        const water = waterBodies.create(obj.x, obj.y, null);
        water.setOrigin(0);
        water.body.setSize(obj.width, obj.height).setOffset(0, 0);
      } else {
        // Create a physics body for any left objects
        const object = objectsBodies.create(obj.x, obj.y, null);
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
      const riddle = riddleGroup.create(obj.x, obj.y, null);
      riddle.setOrigin(0);
      riddle.body.setSize(obj.width, obj.height).setOffset(0, 0);
      // Store riddle name for logging
      riddle.name = obj.name;
    });

    // Collision with Chest:
    const chestObjectLayer = map.getObjectLayer("Chests");
    const chestGroup = this.physics.add.staticGroup();

    chestObjectLayer.objects.forEach((obj) => {
      const chest = chestGroup.create(obj.x, obj.y, null);
      chest.setOrigin(0);
      chest.body.setSize(obj.width, obj.height).setOffset(0, 0);
      // Store chest name for logging
      chest.name = obj.name;
    });

    // Add collision handling for riddles
    this.physics.add.collider(this.player, riddleGroup, (player, riddle) => {
      if (riddle.name) {
        console.log(`${riddle.name} encountered`);
      } else {
        console.log("A mysterious riddle encountered");
      }
    });

    // Add collision handling for chests
    this.physics.add.collider(this.player, chestGroup, (player, chest) => {
      if (chest.name) {
        console.log(`${chest.name} encountered`);
      } else {
        console.log("A mysterious chest encountered");
      }
    });

    // Camera setup
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player.setCollideWorldBounds(true);

    // Debug camera width and height if necessary
    console.log(camera.width, camera.height);

    // Pass input keys to the player
    this.player.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}