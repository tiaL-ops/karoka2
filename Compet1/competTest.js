import { getFirestore, doc, getDoc } from "../public/scripts/firebase.js";
export default class competTest extends Phaser.Scene {
    constructor() {
        super({ key: "competTest" });
    }

    async init(data) {
        const competitionKey = data.competitionKey;
        const db = getFirestore();
    
        try {
            const docRef = doc(db, "competitions", competitionKey);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                this.competitionData = docSnap.data(); // Assign the data here
            } else {
                console.error("No competition data found for:", competitionKey);
                this.competitionData = null; // Handle missing data
            }
        } catch (error) {
            console.error("Error fetching competition data:", error);
            this.competitionData = null; // Handle errors
        }
    }
    

    preload() {
        const data = this.competitionData;
        console.log("here is the data" + data)
       
        const sprite = data.spritesheet;
        this.load.spritesheet(sprite.key, sprite.url, {
            frameWidth: sprite.frameWidth,
            frameHeight: sprite.frameHeight,
        });
    
      
        data.images.forEach(image => {
            this.load.image(image.key, image.url);
        });
    
      
        const tilemap = data.tilemap;
        this.load.tilemapTiledJSON(tilemap.key, tilemap.url);
    }
    
    
        


    create() {
        const map = this.make.tilemap({ key: this.competitionData.tilemap.key  });
       

        const allTilesets = this.competitionData.images.map(image => 
            map.addTilesetImage(image.key, image.key)
        );

        const backgroundLayer = map.createLayer("Background", allTilesets, 0, 0);
        const waterLayer = map.createLayer("Water", allTilesets, 0, 0);
        const detailsLayer = map.createLayer("Details", allTilesets, 0, 0);
        const houseLayer = map.createLayer("House", allTilesets, 0, 0);

        // Dynamically set bounds based on the background layer size
        const boundsWidth = backgroundLayer.width;
        const boundsHeight = backgroundLayer.height;

        this.physics.world.setBounds(0, 0, boundsWidth, boundsHeight);
        const camera = this.cameras.main;
        camera.setBounds(0, 0, boundsWidth, boundsHeight);
        camera.setZoom(1); // Set a closer zoom level

        this.girl = this.physics.add.sprite(100, 100, "girl");
        this.girl.setCollideWorldBounds(true);
        camera.startFollow(this.girl);

        this.cursors = this.input.keyboard.createCursorKeys();
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
