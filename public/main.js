import { createAuthForm } from './game/scripts/authform.js';
import { auth, signOut } from './game/scripts/firebase.js'; // Ensure firebase.js exports `auth` and `signOut`

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

const gameContainer = document.getElementById('game-container');
const gamePreview = document.getElementById('game-preview');

// Set the source of the iframe
gamePreview.src = 'game.html';

// Functions to toggle visibility
function showGameThumbnail() {
    gameContainer.classList.remove('hidden');
    gameContainer.classList.add('visible');
}

function hideGameThumbnail() {
    gameContainer.classList.remove('visible');
    gameContainer.classList.add('hidden');
}
