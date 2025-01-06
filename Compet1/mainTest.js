import competTest from './competTest.js';

const config = {
    type: Phaser.AUTO, // Auto-detect WebGL or Canvas rendering
    width: 800, // Set a larger default canvas width
    height: 600, // Set a larger default canvas height
    backgroundColor: '#000000', // Set a default background color
    scene: [competTest], // Add the scene(s)
    physics: {
        default: 'arcade', // Use Arcade physics
        arcade: {
            gravity: { y: 0 }, // No gravity for top-down or non-falling physics
            debug: true, // Enable debug mode for easier troubleshooting
        },
    },
    scale: {
        mode: Phaser.Scale.FIT, // Adjust the canvas size to fit the browser window
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game canvas
    },
};

const game = new Phaser.Game(config); // Initialize the Phaser game
