
import { getFirestore, doc, getDoc } from "./firebase.js";
import WorldScene from './scenes/WorldScene.js'; 
import RiddleScene from "./scenes/RiddleScene.js";
import AnswerScene from "./scenes/AnswerScene.js";
import UIPanelScene from "./scenes/UIPanelScene.js";


async function fetchCompetitionData() {
    console.log("Fetching doc");
    const params = new URLSearchParams(window.location.search);
    const competitionKey =  params.get("competition");
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
    console.log("STarting the game with ", competitionData);
    if (!competitionData) {
        console.error("Failed to fetch competition data. Game cannot start.");
        return;
    }

    // Pass the fetched data to the scene
    const config = {
        type: Phaser.AUTO, 
        width: 800, 
        height: 600, 
        backgroundColor: '#000000', 
        scene: [new WorldScene(competitionData),RiddleScene,AnswerScene,UIPanelScene], 
        physics: {
            default: 'arcade', 
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
this.input.keyboard.on('keydown-G', (event) => {
    this.input.on('pointerdown', (pointer) => {
        console.log(`Mouse clicked at X: ${pointer.worldX}, Y: ${pointer.worldY}`);
    });
});


const game = new Phaser.Game(config);

export default game;