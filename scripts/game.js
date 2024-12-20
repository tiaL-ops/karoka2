import { auth, googleProvider } from './firebase.js';
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

console.log("Firebase Auth initialized:", auth);

// Example logic for managing authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user);
        // Proceed to main game logic or main menu scene
    } else {
        console.log("No user logged in. Show login UI.");
        // Show login form or other login handling
    }
});

// Example login function
async function loginWithEmail(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in successfully");
    } catch (error) {
        console.error("Error logging in:", error.message);
    }
}

// Example Google login function
async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Google login successful:", result.user);
    } catch (error) {
        console.error("Error with Google login:", error.message);
    }
}
