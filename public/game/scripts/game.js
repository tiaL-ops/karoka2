import { auth } from './firebase.js';
import { createAuthForm } from './authform.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import MainMenuScene from './scenes/MainMenuScene.js';
import { getFirestore, doc, getDoc } from "./firebase.js";
import WorldScene from './scenes/WorldScene.js'; 
import TestScene from './scenes/TestScene.js';
import RiddleScene from './scenes/RiddleScene.js';
import BackgroundScene from './scenes/BackgroundScene.js';
import InstructionsScene from './scenes/InstructionScene.js'

async function fetchCompetitionData() {
    console.log("Fetching doc");
    const competitionKey = "Beta";
    const db = getFirestore();
    try {
        const docRef = doc(db, "competitions", competitionKey);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Competition data fetched:", docSnap.data());
            return docSnap.data();
        } else {
            console.error("No competition data found for:", competitionKey);
            return null;
        }
    } catch (error) {
        console.error("Error fetching competition data:", error);
        return null;
    }
}

// Start the game
async function startGame() {
    const competitionData = await fetchCompetitionData();
    console.log("STarting the game");
    if (!competitionData) {
        console.error("Failed to fetch competition data. Game cannot start.");
        return;
    }

    // Pass the fetched data to the scene
    const config = {
        type: Phaser.AUTO, // Auto-detect WebGL or Canvas rendering
        width: 800, // Set a larger default canvas width
        height: 600, // Set a larger default canvas height
        backgroundColor: '#000000', // Set a default background color
        scene: [new WorldScene(competitionData)], // Pass data to the scene
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

    new Phaser.Game(config);
}

startGame();





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





// Export the game instance
export default game;