import Player from './Player.js';

export default class WorldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldScene' });
    }

    preload() {
        // Load the spritesheet for the player and the tilesets
        this.load.spritesheet('boitest', 'assets/maps/boiTest.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
        
        this.load.image('ktilestest', 'assets/maps/ktilestest.png');
        this.load.tilemapTiledJSON('Kmap', 'assets/maps/kMapTest.json');
    }

    create() {
        const map = this.make.tilemap({ key: 'Kmap' });
        const tileset = map.addTilesetImage('ktilestest', 'ktilestest');

        map.createLayer('Background', tileset, 0, 0);
        const treeLayer = map.createLayer('Tree', tileset, 0, 0);
        const rockLayer = map.createLayer('Rock', tileset, 0, 0);

        // Process PlayerObject layer to get the player spawn point
        const playerObjectLayer = map.getObjectLayer('PlayerObject');
        const playerSpawn = playerObjectLayer.objects.find((obj) => obj.name === 'boiObject');
      
        if (playerSpawn) {
            console.log("Bf Player");
            console.log(this.textures.exists('boitest'));
            this.player = new Player(this, playerSpawn.x, playerSpawn.y, 'boitest', 0); // Use frame 0 for the player
            console.log('Player created:', this.player);
        }

        // Add collision with layers
        treeLayer.setCollisionByProperty({ collides: true });
        rockLayer.setCollisionByProperty({ collides: true });

        // Collision callbacks
        this.physics.add.collider(this.player, treeLayer, () => {
            console.log('Ouch! Tree');
        });

        this.physics.add.collider(this.player, rockLayer, () => {
            console.log('Ouch! Rock');
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
