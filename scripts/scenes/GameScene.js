// scripts/scenes/game.js
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }


    create() {
    
        this.add.text(400, 100, 'Hello Owrls', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    }
}
