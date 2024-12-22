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

    this.load.image("chest2", "assets/maps/chest2.png");
    this.load.image("forest_tiles", "assets/maps/forest_tiles.png");
    this.load.image("sign_post", "assets/maps/sign_post.svg");
    this.load.image("terrain_atlas", "assets/maps/terrain_atlas.png");
    this.load.image("terrain", "assets/maps/terrain.png");

    this.load.tilemapTiledJSON("WPMap", "assets/maps/WPMAP.json");
  }

  create() {
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
        { key: "boitest", frame: 0 },
        { key: "boitest", frame: 4 },
        { key: "boitest", frame: 8 },
        { key: "boitest", frame: 12 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_left",
      frames: [
        { key: "boitest", frame: 1 },
        { key: "boitest", frame: 5 },
        { key: "boitest", frame: 9 },
        { key: "boitest", frame: 13 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_up",
      frames: [
        { key: "boitest", frame: 2 },
        { key: "boitest", frame: 6 },
        { key: "boitest", frame: 10 },
        { key: "boitest", frame: 14 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_right",
      frames: [
        { key: "boitest", frame: 3 },
        { key: "boitest", frame: 7 },
        { key: "boitest", frame: 11 },
        { key: "boitest", frame: 15 },
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
});

// Collision with Chest:
const chestObjectLayer = map.getObjectLayer("Chests"); 
const chestGroup = this.physics.add.staticGroup();

chestObjectLayer.objects.forEach((obj) => {
  const chest = chestGroup.create(obj.x, obj.y, null);
  chest.setOrigin(0);
  chest.body.setSize(obj.width, obj.height).setOffset(0, 0);
});

// Add collision handling for riddles
this.physics.add.collider(this.player, riddleGroup, () => {
  console.log("Riddle encountered");
});

// Add collision handling for chests
this.physics.add.collider(this.player, chestGroup, () => {
  console.log("The secret to open me");
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
