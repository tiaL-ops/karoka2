
import competTest from './competTest.js';

const config = {
    type: Phaser.AUTO,
    width: window.width, 
    height: window.length,
    scene: [competTest],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
};

const game2 = new Phaser.Game(config);
