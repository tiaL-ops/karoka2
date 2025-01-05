

export default class competTest extends Phaser.Scene {
    constructor(){
        super({key:"competTest"});
    }
    
    preload(){
        this.load.image("city","city.png")
        this.load.image("Tilemap","Tilemap.png")
        this.load.tilemapTiledJSON("test", "test.json");
    }
    create(){
        const map = this.make.tilemap({key : "test"});
        const tileMapset= map.addTilesetImage("Tilemap", "Tilemap");
        const cityset= map.addTilesetImage("city", "city");

        const allTilesets=[
            tileMapset,
            cityset,
        ];

        map.createLayer("Background", allTilesets, 0, 0);
        map.createLayer("Water", allTilesets, 0, 0);
    }
}