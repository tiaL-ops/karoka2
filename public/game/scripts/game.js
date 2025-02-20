// game.js

// Use absolute paths starting from the root of the public folder.
import { getFirestore, doc, getDoc } from "/game/scripts/firebase.js";
import WorldScene from "/game/scripts/scenes/WorldScene.js"; 
import RiddleScene from "/game/scripts/scenes/RiddleScene.js";
import AnswerScene from "/game/scripts/AnswerScene.js";
import UIPanelScene from "/game/scripts/scenes/UIPanelScene.js";
import MainMenuScene from "/game/scripts/scenes/MainMenuScene.js";
import AvatarScene from "/game/scripts/scenes/AvatarScene.js";
import InstructionsScene from "/game/scripts/scenes/InstructionScene.js";

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
                debug: false,
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
