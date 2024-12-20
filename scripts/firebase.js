// Import the required Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// Ensure `window.env` is defined
if (!window.env) {
    console.error("Environment variables are not defined! Make sure env.js is included in index.html before firebase.js.");
    throw new Error("Missing environment variables: window.env is not defined.");
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

// Export Firebase services
export { db, auth, googleProvider };
