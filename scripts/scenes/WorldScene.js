export default class WorldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldScene' });
    }

    preload() {
        this.load.image('ktilestest', 'assets/maps/ktilestest.png'); // Load the tileset image
        this.load.tilemapTiledJSON('Kmap', 'assets/maps/kMapTest.json'); // Load the map JSON
        

    }

    create() {
        // 👌 sanity check by displaying the entire tileset image
	    //this.add.image(0, 0, 'ktilestest')
        const map = this.make.tilemap({ key: 'Kmap' })

        // add the tileset image we are using
	    const tileset = map.addTilesetImage('ktilestest')

        // create the layers we want in the right order
	    map.createLayer('Background', tileset)

	    // "Ground" layer will be on top of "Background" layer
	    map.createLayer('Tree', tileset)
       
        
    }
}
