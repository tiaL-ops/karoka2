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
                console.log("cancel");
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
            console.log("profile snap exist",data);

            // Update placeholder attributes to match the fetched data
            document.getElementById('kname').placeholder = data.kname || 'Enter your name';
            console.log("this is kname",data.kname);
            document.getElementById('fieldOfStudy').placeholder = data.fieldOfStudy || 'Enter your field of study';
            document.getElementById('programmingLevel').placeholder = data.programmingLevel || 'Enter your programming level';
            document.getElementById('bio').placeholder = data.bio || 'Write a short bio about yourself';

        
        } else {
            console.log('No profile data found.');
        }
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}




async function displayCompetitions() {
    console.log("displaycompetition");

    // Initialize Firestore
    const db = getFirestore();

    try {
        const competitionsRef = collection(db, "competitions");

        // Fetch competition documents
        const competitionsSnapshot = await getDocs(competitionsRef);

        // Get the container element
        const competitionContainer = document.getElementById("competition-container");
        competitionContainer.innerHTML = "";

        competitionsSnapshot.forEach((doc) => {
            const name = doc.id;
            const data = doc.data();
            const status = data.status || "unknown";
            const thumbnail = data.thumbnail || ""; // Default to an empty string if thumbnail is not provided

            console.log(name);

            // Create a div for the competition
            const competitionDiv = document.createElement("div");
            competitionDiv.className = `competition ${status}`;
            competitionDiv.dataset.status = status;
            competitionDiv.dataset.name = name;

            // Add the status label
            const statusLabel = document.createElement("span");
            statusLabel.className = "status-label";
            statusLabel.textContent = status.charAt(0).toUpperCase() + status.slice(1); // Capitalize status
            competitionDiv.appendChild(statusLabel);

            // Add the name header
            const nameHeader = document.createElement("h3");
            nameHeader.textContent = name;
            competitionDiv.appendChild(nameHeader);

            // Add the thumbnail image if available
            if (thumbnail) {
                const thumbnailImg = document.createElement("img");
                thumbnailImg.className = "thumbnail"; // Optional: Add a class for styling
                thumbnailImg.src = thumbnail; // Set the source to the thumbnail URL
                thumbnailImg.alt = `${name} Thumbnail`; // Set alt text for accessibility
                competitionDiv.appendChild(thumbnailImg);
            }

            // Add click functionality to redirect to the game's page with the competition name
            competitionDiv.addEventListener("click", () => {
                // Navigate to the game's page and pass the competition name as a query parameter
                window.location.href = `game/game.html?competition=${encodeURIComponent(name)}`;
            });

            // Append the competition div to the container
            competitionContainer.appendChild(competitionDiv);
        });

        console.log("Competitions displayed successfully.");
    } catch (error) {
        console.error("Error fetching competitions:", error);
    }
}


// Save Profile Data
async function saveProfileData(userId) {
    try {
        // Fetch the existing profile data from Firestore
        const profileRef = doc(db, 'profiles', userId);
        const profileSnap = await getDoc(profileRef);
        let existingData = {};

        if (profileSnap.exists()) {
            existingData = profileSnap.data();
        } else {
            console.log('No existing profile data found; creating a new one.');
        }

        // Gather updated values from form inputs
        const updatedData = {
            kname: document.getElementById('kname').value.trim(),
            fieldOfStudy: document.getElementById('fieldOfStudy').value.trim(),
            programmingLevel: document.getElementById('programmingLevel').value.trim(),
            bio: document.getElementById('bio').value.trim(),
        };

        // Merge updated data with existing data, prioritizing non-empty values
        const profileData = { ...existingData };
        Object.keys(updatedData).forEach((key) => {
            if (updatedData[key]) {
                profileData[key] = updatedData[key]; // Only overwrite if the new value is non-empty
            }
        });

        // Check if there's any actual change to save
        if (JSON.stringify(profileData) === JSON.stringify(existingData)) {
            alert('No changes to save.');
            return;
        }

        // Save the merged profile data to Firestore
        await setDoc(profileRef, profileData, { merge: true });

        console.log('Profile data saved to Firestore:', profileData);
        alert('Profile saved successfully!');
    } catch (error) {
        console.error('Error saving profile data:', error);
        alert('Failed to save profile. Please try again.');
    }
}



function hideProfileContainer() {
    const x = document.getElementById('profile-container');
    if (x) { // Check if the element exists
        if (x.style.display === "none" || !x.style.display) { // Check if it's hidden or has no style set
            x.style.display = "block"; // Show the element
        } else {
            x.style.display = "none"; // Hide the element
        }
    } else {
        console.error("Element with ID 'profile-container' not found");
    }
}

// Expose the function globally
window.hideProfileContainer = hideProfileContainer;


function filterCompetitions(status) {
    const competitions = document.querySelectorAll('.competition');
    competitions.forEach((competition) => {
        if (status === 'all' || competition.classList.contains(status)) {
            competition.style.display = 'block';
        } else {
            competition.style.display = 'none';
        }
    });
}
window.filterCompetitions = filterCompetitions;

document.querySelectorAll('.competition.open').forEach((competition) => {
    competition.addEventListener('click', () => {
        //alert(`Navigating to ${competition.querySelector('h3').innerText}...`);
    
        window.location.href = 'game/game.html';
    });
});


document.addEventListener('click', (event) => {
    console.log("yo");
    const profile = document.getElementById('profile-container');
    const toggleButton = document.getElementById('profile-button');

    if (profile && toggleButton) {
        // If clicking outside both the profile container and the toggle button
        if (
            profile.style.display === 'block' && // Only act if profile is visible
            !profile.contains(event.target) && // Click is outside the profile container
            event.target !== toggleButton // Click is not on the toggle button
        ) {
            profile.style.display = 'none'; // Hide the profile
        }
    }
});