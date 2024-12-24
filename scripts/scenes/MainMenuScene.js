import { auth } from '../firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import WorldScene from './WorldScene.js';
import game from '../game.js'; 
import AvatarScene from './AvatarScene.js';
import TestScene from './TestScene.js';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('button', 'assets/button.png');
    }

    create() {
        const { width, height } = this.scale;

        // Add background
        this.background = this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(width, height);

        // Title text
        this.titleText = this.add.text(width / 2, height * 0.2, 'KarokaGame', {
            fontSize: `${Math.floor(height * 0.06)}px`,
            fill: '#ffffff',
            fontFamily: 'Poppins, Arial, sans-serif',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Create Buttons
        this.buttons = [];
        const buttonLabels = ['Start Game', 'Choose Avatar','TestScene', 'Logout'];
        const buttonActions = [
            () => game.loadScene('WorldScene', WorldScene),
            () => game.loadScene('AvatarScene', AvatarScene),
            () => game.loadScene('TestScene', TestScene),
            async () => {
                try {
                    await signOut(auth);
                    console.log('User logged out successfully!');
                    document.body.innerHTML = ''; // Clear the screen
                    location.reload(); // Reload to reset to login form
                } catch (error) {
                    console.error('Logout failed:', error.message);
                }
            },
        ];

        // Create buttons with spacing
        buttonLabels.forEach((label, index) => {
            const button = this.createButton(height * (0.4 + index * 0.1), label, buttonActions[index]);
            this.buttons.push(button);
        });

        // Handle resizing
        this.scale.on('resize', this.resizeGame, this);
    }

    createButton(y, label, onClick) {
        const { width, height } = this.scale;

        const button = this.add.image(width / 2, y, 'button')
            .setInteractive()
            .setDisplaySize(width * 0.4, height * 0.1)
            .setOrigin(0.5);

        const buttonText = this.add.text(button.x, button.y, label, {
            fontSize: `${Math.floor(height * 0.035)}px`,
            fill: '#ffffff',
            fontFamily: 'Poppins, Arial, sans-serif',
        }).setOrigin(0.5);

        button.on('pointerover', () => button.setTint(0xaaaaaa)); // Hover effect
        button.on('pointerout', () => button.clearTint());
        button.on('pointerdown', onClick); // Attach the click handler

        return { button, buttonText };
    }

    resizeGame(gameSize) {
        const { width, height } = gameSize;

        // Resize background
        this.background.setDisplaySize(width, height);

        // Reposition and resize title
        this.titleText.setFontSize(Math.floor(height * 0.06)).setPosition(width / 2, height * 0.2);

        // Reposition and resize buttons
        this.buttons.forEach((btn, index) => {
            const y = height * (0.4 + index * 0.1);
            btn.button.setDisplaySize(width * 0.4, height * 0.1).setPosition(width / 2, y);
            btn.buttonText.setFontSize(Math.floor(height * 0.035)).setPosition(width / 2, y);
        });
    }
}
