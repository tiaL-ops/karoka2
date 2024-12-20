import { auth } from './firebase.js';
import { createAuthForm } from './authform.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import MainMenuScene from './scenes/MainMenuScene.js';

// Phaser Game Configuration
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
};

// Initialize Phaser Game
const game = new Phaser.Game(config);

// Function to load the MainMenuScene
function loadMainMenuScene() {
    if (!game.scene.keys['MainMenuScene']) {
        game.scene.add('MainMenuScene', MainMenuScene, true); // Add and start MainMenuScene
    } else {
        game.scene.start('MainMenuScene'); // Start MainMenuScene if already added
    }
}

// Monitor Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is logged in:', user);
        loadMainMenuScene(); // Load the MainMenuScene
    } else {
        console.log('No user logged in. Showing auth form.');
        createAuthForm(() => loadMainMenuScene()); // Show the login/signup form
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
