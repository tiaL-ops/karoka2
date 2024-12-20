import { auth } from './firebase.js';
import { createAuthForm } from './authform.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// Function to load the main menu or game
function loadMainMenu() {
    console.log('Main menu loaded!');

    // Clear the body (if needed)
    document.body.innerHTML = '';

    // Add a logout button
    const logoutButton = document.createElement('button');
    logoutButton.innerText = 'Logout';
    logoutButton.style.position = 'absolute';
    logoutButton.style.top = '10px';
    logoutButton.style.right = '10px';
    logoutButton.style.padding = '10px 20px';
    logoutButton.style.backgroundColor = '#ff4d4f';
    logoutButton.style.color = '#fff';
    logoutButton.style.border = 'none';
    logoutButton.style.borderRadius = '5px';
    logoutButton.style.cursor = 'pointer';

    // Add logout functionality
    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log('User logged out successfully!');
            document.body.innerHTML = ''; // Clear the screen after logout
            createAuthForm(loadMainMenu); // Show login/signup form again
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    });

    document.body.appendChild(logoutButton);

    // Add other main menu content here
    const mainMenuContent = document.createElement('h1');
    mainMenuContent.innerText = 'Welcome to the Main Menu!';
    mainMenuContent.style.textAlign = 'center';
    mainMenuContent.style.marginTop = '50px';

    document.body.appendChild(mainMenuContent);
}

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is logged in:', user);
        loadMainMenu(); // Proceed to the main menu
    } else {
        console.log('No user logged in. Showing auth form.');
        createAuthForm(loadMainMenu); // Show the login/signup form
    }
});
