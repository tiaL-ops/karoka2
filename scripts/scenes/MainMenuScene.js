// scripts/scenes/MainMenuScene.js
export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.add.image(400, 300, 'background');
        this.add.text(400, 100, 'KarokaGame', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    }
}
