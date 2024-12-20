import { auth } from '../firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

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

        // Add background and scale it to fit the screen
        const bg = this.add.image(0, 0, 'background');
        bg.setOrigin(0);
        bg.setDisplaySize(width, height);

        // Title text centered at the top portion of the screen
        const titleText = this.add.text(width / 2, height * 0.2, 'KarokaGame', {
            fontSize: `${Math.floor(height * 0.06)}px`,
            fill: '#ffffff',
            fontFamily: 'Poppins, Arial, sans-serif',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Button Creation Function
        const createButton = (y, label, callback) => {
            const container = this.add.container(width / 2, y);

            const buttonImage = this.add.image(0, 0, 'button')
                .setInteractive()
                .setDisplaySize(width * 0.4, height * 0.1) // Scale button size
                .setOrigin(0.5);

            const buttonText = this.add.text(0, 0, label, {
                fontSize: `${Math.floor(height * 0.035)}px`, // Responsive font size
                fill: '#ffffff',
                fontFamily: 'Poppins, Arial, sans-serif',
            }).setOrigin(0.5);

            container.add([buttonImage, buttonText]);

            // Button Interactivity
            buttonImage.on('pointerover', () => {
                buttonImage.setTint(0xaaaaaa); // Hover effect
            });

            buttonImage.on('pointerout', () => {
                buttonImage.clearTint();
            });

            buttonImage.on('pointerdown', callback);

            return container;
        };

        // Start Game Button
        createButton(height * 0.4, 'Start Game', () => {
            console.log('Starting game...');
            this.scene.start('GameScene'); // Replace 'GameScene' with your actual game scene key
        });

        // View Leaderboard Button
        createButton(height * 0.55, 'View Leaderboard', () => {
            console.log('Viewing leaderboard...');
            this.scene.start('LeaderboardScene'); // Replace 'LeaderboardScene' with your leaderboard scene key
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

    resize(gameSize) {
        const { width, height } = gameSize;

        // Resize background
        const bg = this.add.image(0, 0, 'background');
        bg.setOrigin(0);
        bg.setDisplaySize(width, height);
    }
}
