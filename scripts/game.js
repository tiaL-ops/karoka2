import { auth } from './firebase.js';
import { createAuthForm } from './authform.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import MainMenuScene from './scenes/MainMenuScene.js';
import WorldScene from './scenes/WorldScene.js'; // Import WorldScene

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [], // No initial scene
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
};

// Initialize Phaser Game
const game = new Phaser.Game(config);

// Attach the `loadScene` function to the `game` object
game.loadScene = function (sceneKey, sceneClass = null) {
    if (!this.scene.keys[sceneKey]) {
        if (sceneClass) {
            this.scene.add(sceneKey, sceneClass); // Dynamically add the scene if class provided
        } else {
            console.error(`Scene class for "${sceneKey}" is not provided.`);
            return;
        }
    }
    this.scene.start(sceneKey); // Start the scene
};

// Monitor Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is logged in:', user);
        game.loadScene('MainMenuScene', MainMenuScene); // Load MainMenuScene
    } else {
        console.log('No user logged in. Showing auth form.');
        createAuthForm(() => game.loadScene('MainMenuScene', MainMenuScene)); // Show login form and load MainMenuScene
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

// Export the game instance
export default game;
