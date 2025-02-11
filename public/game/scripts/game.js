// game.js
import { getFirestore, doc, getDoc } from "./firebase.js";
import WorldScene from './scenes/WorldScene.js'; 
import RiddleScene from "./scenes/RiddleScene.js";
import AnswerScene from "./scenes/AnswerScene.js";
import UIPanelScene from "./scenes/UIPanelScene.js";
import MainMenuScene from "./scenes/MainMenuScene.js";
import AvatarScene from "./scenes/AvatarScene.js";
import InstructionsScene from "./scenes/InstructionScene.js";

async function fetchCompetitionData() {
    console.log("Fetching doc");
    const params = new URLSearchParams(window.location.search);
    const competitionKey = params.get("competition");
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

async function startGame() {
    const competitionData = await fetchCompetitionData();
    console.log("Starting the game with", competitionData);
    if (!competitionData) {
        console.error("Failed to fetch competition data. Game cannot start.");
        return null;
    }

    const config = {
        type: Phaser.AUTO, 
        width: 800, 
        height: 600, 
        backgroundColor: '#000000', 
        parent: 'game-container',
        dom: { createContainer: true },
        scene: [
            MainMenuScene,
            new WorldScene(competitionData),
            RiddleScene,
            AnswerScene,
            UIPanelScene,
            new AvatarScene(competitionData),
            new InstructionsScene(competitionData),
        ], 
        physics: {
            default: 'arcade', 
            arcade: {
                gravity: { y: 0 },
                debug: true,
            },
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
    };

    const game = new Phaser.Game(config);
    return game;
}

// Export the promise that resolves to the game instance.
export default startGame();
