import { createAuthForm } from './game/scripts/authform.js';
import { auth, signOut } from './game/scripts/firebase.js'; // Ensure firebase.js exports `auth` and `signOut`
import { getFirestore, doc, getDoc } from "../public/game/scripts/firebase.js";
// Function to load the main menu and update the username

function loadMainMenu() {
    const user = auth.currentUser; // Get the currently logged-in user
    const usernameElement = document.getElementById('username');
    const authButton = document.getElementById('auth-button');

    if (user) {
        const displayName = user.displayName || 'User'; // Use displayName if available, fallback to "User"
        usernameElement.textContent = displayName;

        // Change the auth button to a logout button
        authButton.textContent = 'Logout';
        authButton.removeEventListener('click', openAuthForm); // Remove login/signup listener
        authButton.addEventListener('click', handleLogout); // Add logout listener

        console.log('Main menu loaded for:', displayName);
    } else {
        console.log('No user is logged in.');
    }
}

// Function to open the auth form
function openAuthForm() {
    createAuthForm(loadMainMenu);
}

// Function to handle logout
function handleLogout() {
    signOut(auth)
        .then(() => {
            console.log('User logged out successfully.');

            // Reset UI to default
            const usernameElement = document.getElementById('username');
            const authButton = document.getElementById('auth-button');
            usernameElement.textContent = 'Guest';
            authButton.textContent = 'Login / Sign Up';

            authButton.removeEventListener('click', handleLogout); // Remove logout listener
            authButton.addEventListener('click', openAuthForm); // Add login/signup listener
        })
        .catch((error) => {
            console.error('Logout failed:', error.message);
        });
}

// Attach event listener to the auth-button
const authButton = document.getElementById('auth-button');
authButton.addEventListener('click', openAuthForm);

async function fetchCompetitionData() {
    console.log("fetch called");

    const competitionKey = "compet1Test";
    const db = getFirestore();

    const collectionName = "competitions";
    const thumbnailContainer = document.getElementById('thumbnail-container');

    try {
        const competitionsRef = collection(db, collectionName,competitionKey);
        const docSnap = await getDoc(competitionsRef);

        if (docSnap.exists()) {
            console.log("Competition data fetched:", docSnap.data());
            return docSnap.data();
        } else {
            console.error("No competition data found for:", competitionKey);
            return null;
        }

        
            /*
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.className = 'p-4 border rounded-lg shadow-md cursor-pointer text-center';

            // Create placeholder for thumbnail (use an image if available)
            const thumbnailImage = document.createElement('div');
            thumbnailImage.className = 'w-32 h-32 bg-gray-200 flex items-center justify-center';
            thumbnailImage.textContent = competition.name || "Unnamed Competition";

            // Create a title for the competition
            const title = document.createElement('h3');
            title.className = 'text-lg font-bold mt-2';
            title.textContent = competition.name || "Unnamed Competition";

            // Add a click event to log competition ID
            thumbnailDiv.addEventListener('click', () => {
                console.log(`Competition clicked: ${competitionId}`);
            });

            // Append elements to thumbnail div
            thumbnailDiv.appendChild(thumbnailImage);
            thumbnailDiv.appendChild(title);

            // Append thumbnail to container
            thumbnailContainer.appendChild(thumbnailDiv);
        

        console.log('Competitions successfully loaded.');
        */
    } catch (error) {
        console.error("Error fetching competition data:", error);
    }
}

async function startGame() {
    const competitionData = await fetchCompetitionData();

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
        scene: [new competTest(competitionData)], // Pass data to the scene
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
