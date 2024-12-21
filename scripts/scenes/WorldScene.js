import Player from "./Player.js";

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: "WorldScene" });
  }

  preload() {
    // Load the spritesheet for the player and the tilesets
    this.load.spritesheet("boitest", "assets/maps/boiTest.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.image("ktilestest", "assets/maps/ktilestest.png");
    this.load.tilemapTiledJSON("Kmap", "assets/maps/kMapTest.json");
  }

  create() {
    const map = this.make.tilemap({ key: "Kmap" });
    const tileset = map.addTilesetImage("ktilestest", "ktilestest");

    map.createLayer("Background", tileset, 0, 0);
    const treeLayer = map.createLayer("Tree", tileset, 0, 0);
    const rockLayer = map.createLayer("Rock", tileset, 0, 0);

    // Process PlayerObject layer to get the player spawn point
    const playerObjectLayer = map.getObjectLayer("PlayerObject");
    const playerSpawn = playerObjectLayer.objects.find(
      (obj) => obj.name === "boiObject"
    );

    if (playerSpawn) {
      console.log("Bf Player");
      console.log(this.textures.exists("boitest"));
      this.player = new Player(
        this,
        playerSpawn.x,
        playerSpawn.y,
        "boitest",
        0
      ); // Use frame 0 for the player
      console.log("Player created:", this.player);
    }
    const gameObjectLayer = map.getObjectLayer("GameObject");
    if (!gameObjectLayer) {
      console.error("GameObject layer not found!");
      return;
    }

    // Camera setup
    const camera = this.cameras.main;
    camera.startFollow(this.player); // Make the camera follow the player
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels); 
    
    // Create static groups for trees and rocks
    const treeBodies = this.physics.add.staticGroup();
    const rockBodies = this.physics.add.staticGroup();

    // Iterate over all objects in the GameObject layer
    gameObjectLayer.objects.forEach((obj) => {
      if (obj.name === "TreeObject") {
        // Create a physics body for the tree
        const tree = treeBodies.create(obj.x, obj.y, null);
        tree.setOrigin(0); // Align origin to top-left
        tree.body.setSize(obj.width, obj.height).setOffset(0, 0);
      } else if (obj.name === "rockObject") {
        // Create a physics body for the rock
        const rock = rockBodies.create(obj.x, obj.y, null);
        rock.setOrigin(0); // Align origin to top-left
        rock.body.setSize(obj.width, obj.height).setOffset(0, 0);
      }
    });
    this.physics.add.collider(this.player, treeBodies, () => {
      console.log("Ouch! Tree");
    });

    this.physics.add.collider(this.player, rockBodies, () => {
      console.log("Ouch! Rock");
    });

    // Pass input keys to the player
    this.player.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}
