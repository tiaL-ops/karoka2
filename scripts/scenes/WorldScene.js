export default class WorldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldScene' });
    }

    preload() {
        // Preload assets if needed
    }

    create() {
        console.log("WorldScene created!");

        // Add a solid color background using a rectangle
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0000ff)
            .setOrigin(0, 0); // Set origin to the top-left corner

        // Add "Hello World" text to the scene
        this.add.text(100, 100, 'Hello World', {
            font: '32px Arial',
            fill: '#ffffff'
        });
    }
}
