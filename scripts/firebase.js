// Import the required Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-analytics.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// Ensure `window.env` is defined
if (!window.env) {
    console.error("Environment variables are not defined! Make sure env.js is included in index.html before firebase.js.");
    throw new Error("Missing environment variables: window.env is not defined.");
}

const requiredEnvKeys = [
    "FIREBASE_API_KEY",
    "FIREBASE_AUTH_DOMAIN",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_STORAGE_BUCKET",
    "FIREBASE_MESSAGING_SENDER_ID",
    "FIREBASE_APP_ID",
    "FIREBASE_MEASUREMENT_ID",
];

for (const key of requiredEnvKeys) {
    if (!window.env[key]) {
        console.error(`Missing environment variable: ${key}`);
        throw new Error(`Missing environment variable: ${key}`);
    }
}

// Use environment variables from `window.env`
const firebaseConfig = {
    apiKey: window.env.FIREBASE_API_KEY,
    authDomain: window.env.FIREBASE_AUTH_DOMAIN,
    projectId: window.env.FIREBASE_PROJECT_ID,
    storageBucket: window.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: window.env.FIREBASE_APP_ID,
    measurementId: window.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

async function getUserName(uid) {
    // Check localStorage first
    let name = localStorage.getItem("Name");
    if (name !== undefined) {
        return name;
    }

    try {
        // If not in localStorage, fetch from Firestore
        const docRef = doc(db, "profiles", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data()); // Log the entire document data
            name = docSnap.data().name; // Access the single 'name' field
            localStorage.setItem("Name", name); // Store it in localStorage for future use
            return name;
        } else {
            console.error("No user document found in Firestore.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user name from Firestore:", error);
        return null;
    }
}


// Wait for user authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        const currentUserId = user.uid;
        console.log("User ID:", currentUserId);
        getUserName(currentUserId);
    } else {
        console.error("No user is signed in.");
    }
});

// Export Firebase services
export { db, auth, googleProvider };
