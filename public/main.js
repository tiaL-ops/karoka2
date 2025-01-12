import { createAuthForm } from './game/scripts/authform.js';
import { auth, signOut } from './game/scripts/firebase.js'; // Ensure firebase.js exports `auth` and `signOut`
import { getFirestore, doc, getDocs ,collection} from "../public/game/scripts/firebase.js";
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





//import { getFirestore, collection, getDocs } from "firebase/firestore";
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

window.onload = displayCompetitions;

  

/*
async function fetchCompetitionData(competitionKey) {
    console.log("fetch called");

    //const competitionKey = "compet1Test";
    const db = getFirestore();

    const collectionName = "competitions";
    

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

        
            
    } catch (error) {
        console.error("Error fetching competition data:", error);
    }
}
*/

function filterCompetitions(status) {
    console.log("filter called");
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

// Add click functionality to open competitions
document.querySelectorAll('.competition.open').forEach((competition) => {
    competition.addEventListener('click', () => {
        //alert(`Navigating to ${competition.querySelector('h3').innerText}...`);
    
        window.location.href = 'game/game.html';
    });
});
// DOM Elements
const profileSection = document.getElementById("profile-section");
const toggleProfileButton = document.getElementById("toggle-profile");

// Handle toggle button click
toggleProfileButton.addEventListener("click", () => {
    if (profileSection.classList.contains("hidden")) {
        profileSection.classList.remove("hidden");
        toggleProfileButton.textContent = "Hide Profile";
    } else {
        profileSection.classList.add("hidden");
        toggleProfileButton.textContent = "Show Profile";
    }
});

// Show/hide profile section based on login state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Fetch user initials
        const initials = user.displayName ? user.displayName.split(" ").map(n => n[0]).join("") : "?";
        document.getElementById("profile-initials").textContent = initials;

        // Populate profile data
        document.getElementById("profile-username").textContent = user.displayName || "Anonymous";

        const userDoc = doc(db, "users", user.uid);
        const userProfile = await getDoc(userDoc);

        if (userProfile.exists()) {
            const { bio, skillLevel } = userProfile.data();
            document.getElementById("profile-bio").textContent = bio || "No bio provided.";
            document.getElementById("profile-skill").textContent = skillLevel || "Intermediate";
        }

        // Show the toggle button and profile section (default to hidden)
        toggleProfileButton.classList.remove("hidden");
        toggleProfileButton.textContent = "Show Profile";
        profileSection.classList.add("hidden");
    } else {
        // Hide the toggle button and profile section for guests
        toggleProfileButton.classList.add("hidden");
        profileSection.classList.add("hidden");
    }
});


