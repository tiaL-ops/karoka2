import { auth } from './firebase.js';
import { createAuthForm } from './authform.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import MainMenuScene from './scenes/MainMenuScene.js';
import WorldScene from './scenes/WorldScene.js'; 
import TestScene from './scenes/TestScene.js';
import RiddleScene from './scenes/RiddleScene.js';

const config = {
    type: Phaser.AUTO,
    width: 778, // Match the CSS width
    height: 725, // Match the CSS height
    backgroundColor: '#000000',
    scene: [TestScene,WorldScene,RiddleScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
    dom: {
        createContainer: true // Enable DOM containers
    }
};


// Initialize Phaser Game
const game = new Phaser.Game(config);

// Attach the `loadScene` function to the `game` object
game.loadScene = function (sceneKey, sceneClass = null) {
    // Dynamically add the scene if not already added
    if (!this.scene.keys[sceneKey]) {
        if (sceneClass) {
            this.scene.add(sceneKey, sceneClass);
        } else {
            console.error(`Scene class for "${sceneKey}" is not provided.`);
            return;
        }
    }

    // Stop all currently active scenes
    Object.keys(this.scene.keys).forEach(activeSceneKey => {
        if (this.scene.isActive(activeSceneKey)) {
            this.scene.stop(activeSceneKey);
        }
    });

    // Start the new scene and pass the data
    this.scene.start(sceneKey);
};



// Resize the canvas dynamically while maintaining the aspect ratio
function resizeGame() {
    const canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = config.width / config.height;

    if (windowRatio < gameRatio) {
        // Screen is narrower than the game's aspect ratio
        canvas.style.width = `${windowWidth}px`;
        canvas.style.height = `${windowWidth / gameRatio}px`;
    } else {
        // Screen is wider than the game's aspect ratio
        canvas.style.width = `${windowHeight * gameRatio}px`;
        canvas.style.height = `${windowHeight}px`;
    }
}



// Attach the resize event listener
window.addEventListener('resize', resizeGame);
resizeGame(); // Initial call to adjust the canvas size


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

// Export the game instance
export default game;