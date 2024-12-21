import { auth } from '../firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import WorldScene from './WorldScene.js';
import game from '../game.js'; // Import game to use game.loadScene

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
        this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(width, height);

        // Title text
        this.add.text(width / 2, height * 0.2, 'KarokaGame', {
            fontSize: `${Math.floor(height * 0.06)}px`,
            fill: '#ffffff',
            fontFamily: 'Poppins, Arial, sans-serif',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Button Creation Function
        const createButton = (y, label, onClick) => {
            const button = this.add.image(width / 2, y, 'button')
                .setInteractive()
                .setDisplaySize(width * 0.4, height * 0.1)
                .setOrigin(0.5);

            this.add.text(button.x, button.y, label, {
                fontSize: `${Math.floor(height * 0.035)}px`,
                fill: '#ffffff',
                fontFamily: 'Poppins, Arial, sans-serif',
            }).setOrigin(0.5);

            button.on('pointerover', () => button.setTint(0xaaaaaa)); // Hover effect
            button.on('pointerout', () => button.clearTint());
            button.on('pointerdown', onClick); // Attach the click handler

            return button;
        };

        // Start Game Button (Loads WorldScene)
        createButton(height * 0.4, 'Start Game', () => {
            console.log('Start Game clicked!');
            game.loadScene('WorldScene', WorldScene); // Use game.loadScene for dynamic transition
        });

        // Logout Button
        createButton(height * 0.7, 'Logout', async () => {
            try {
                await signOut(auth);
                console.log('User logged out successfully!');
                document.body.innerHTML = ''; // Clear the screen
                location.reload(); // Reload to reset to login form
            } catch (error) {
                console.error('Logout failed:', error.message);
            }
        });
    }
}
