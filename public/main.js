import { createAuthForm } from './game/scripts/authform.js';
import { auth, signOut } from './game/scripts/firebase.js';
import { getFirestore, doc, getDocs, setDoc, collection, getDoc } from '../public/game/scripts/firebase.js';

// Initialize Firestore
const db = getFirestore();

// DOM Elements
let usernameElement, profileSection, competitionContainer, authButton;

let currentUserId = '';

// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    usernameElement = document.getElementById('username');
    profileSection = document.getElementById('profile-section');
    competitionContainer = document.getElementById('competition-container');
    authButton = document.getElementById('auth-button');

    if (authButton) {
        authButton.addEventListener('click', openAuthForm);
    } else {
        console.error('Auth button not found.');
    }

    const saveProfileButton = document.getElementById('save-profile');
    const cancelProfileButton = document.getElementById('cancel-profile');

    if (saveProfileButton) {
        saveProfileButton.addEventListener('click', () => {
            if (currentUserId) {
                saveProfileData(currentUserId);
            }
        });
    } else {
        console.error('Save profile button not found.');
    }

    if (cancelProfileButton) {
        cancelProfileButton.addEventListener('click', () => {
            if (currentUserId) {
                loadProfileData(currentUserId);
            }
        });
    } else {
        console.error('Cancel profile button not found.');
    }

    displayCompetitions();
});

// Update UI for User Login/Logout
function updateUIForUser(user) {
    if (user) {
        usernameElement.textContent = user.displayName || 'User';
        authButton.textContent = 'Logout';
        authButton.onclick = handleLogout;
        if (profileSection) profileSection.classList.remove('hidden');
    } else {
        usernameElement.textContent = 'Guest';
        authButton.textContent = 'Login / Sign Up';
        authButton.onclick = openAuthForm;
        if (profileSection) profileSection.classList.add('hidden');
    }
}

// Open Authentication Form
function openAuthForm() {
    createAuthForm(() => {
        console.log('Authentication form opened.');
        loadMainMenu();
    });
}

// Handle Logout
function handleLogout() {
    signOut(auth)
        .then(() => {
            console.log('User logged out successfully.');
            updateUIForUser(null);
        })
        .catch((error) => console.error('Error during logout:', error.message));
}

// Load Profile Data
async function loadProfileData(userId) {
    try {
        const profileRef = doc(db, 'profiles', userId);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
            const data = profileSnap.data();
            document.getElementById('kname').value = data.kname || '';
            document.getElementById('fieldOfStudy').value = data.fieldOfStudy || '';
            document.getElementById('programmingLevel').value = data.programmingLevel || '';
            document.getElementById('bio').value = data.bio || '';
        } else {
            console.log('No profile data found.');
        }
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}



// Display Competitions
async function displayCompetitions() {
    try {
        const competitionsRef = collection(db, 'competitions');
        const snapshot = await getDocs(competitionsRef);

        competitionContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            const competitionDiv = document.createElement('div');
            competitionDiv.className = `competition ${data.status}`;
            competitionDiv.innerHTML = `
                <span>${data.status}</span>
                <h3>${doc.id}</h3>
            `;
            competitionContainer.appendChild(competitionDiv);
        });
    } catch (error) {
        console.error('Error fetching competitions:', error);
    }
}

// Authentication Listener
auth.onAuthStateChanged(async (user) => {
    currentUserId = user ? user.uid : '';
    updateUIForUser(user);
    if (user) {
        await loadProfileData(user.uid);
        buttonProfile.style.display="block";
    }else{
        const t = document.getElementById('profile-container');
        const buttonProfile= document.getElementById('profile-button');
        buttonProfile.style.display="none";
        t.style.display = "none";

    }
});

function hideProfileContainer() {
    const x = document.getElementById('profile-container');
    if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
}

window.hideProfileContainer=hideProfileContainer;

