import { auth, googleProvider } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { db } from './firebase.js'; // Ensure you have db initialized

export function createAuthForm(loadMainMenu) {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50';

    const form = document.createElement('div');
    form.className = 'bg-white rounded-lg shadow-lg w-96 p-6 text-center';

    const title = document.createElement('h2');
    title.innerText = 'Welcome!';
    title.className = 'text-2xl font-bold text-gray-800 mb-4';
    form.appendChild(title);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Name (for Sign Up)';
    nameInput.className = 'w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400';
    form.appendChild(nameInput);

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'Email';
    emailInput.className = 'w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400';
    form.appendChild(emailInput);

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Password';
    passwordInput.className = 'w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400';
    form.appendChild(passwordInput);

    const errorMessage = document.createElement('p');
    errorMessage.className = 'text-red-500 text-sm hidden';
    form.appendChild(errorMessage);

    const loginButton = document.createElement('button');
    loginButton.innerText = 'Login';
    loginButton.className = 'w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-400 mb-3';
    form.appendChild(loginButton);

    const signupButton = document.createElement('button');
    signupButton.innerText = 'Sign Up';
    signupButton.className = 'w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-400 mb-3';
    form.appendChild(signupButton);

    const googleButton = document.createElement('button');
    googleButton.innerText = 'Login with Google';
    googleButton.className = 'w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-400';
    form.appendChild(googleButton);

    container.appendChild(form);
    document.body.appendChild(container);

    // Login with Email and Password
    loginButton.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful');
            container.remove();
            loadMainMenu();
        } catch (error) {
            console.error('Login failed:', error.message);
            errorMessage.classList.remove('hidden');
            errorMessage.innerText = 'Login failed: ' + error.message;
        }
    });

    // Signup with Email and Password
    signupButton.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
    
        if (!email || !password || !name) {
            errorMessage.classList.remove('hidden');
            errorMessage.innerText = 'Name, email, and password are required.';
            return;
        }
    
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Check if the profile already exists
            const profileRef = doc(db, 'profiles', user.uid);
            const profileSnap = await getDoc(profileRef);
    
            if (!profileSnap.exists()) {
                // Create a new profile only if it doesn't exist
                await setDoc(profileRef, {
                    name,
                    email,
                    uid: user.uid,
                });
                console.log('Signup successful and new profile created:', user);
            } else {
                console.log('Profile already exists for this user. Skipping creation.');
            }
    
            container.remove();
            loadMainMenu();
        } catch (error) {
            console.error('Signup failed:', error.message);
            errorMessage.classList.remove('hidden');
            errorMessage.innerText = 'Signup failed: ' + error.message;
        }
    });
    

    // Login with Google
    googleButton.addEventListener('click', async () => {
        try {
            // Sign in with Google
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
    
            // Reference to the user profile in Firestore
            const profileRef = doc(db, 'profiles', user.uid);
            const profileSnap = await getDoc(profileRef);
    
            if (!profileSnap.exists()) {
                // Create a new profile only if it doesn't exist
                await setDoc(profileRef, {
                    name: user.displayName || 'Unknown User', // Default to "Unknown User" if no display name
                    email: user.email,
                    uid: user.uid,
                });
                console.log('Google login successful and new profile created:', user);
            } else {
                console.log('Profile already exists for this user. No changes made.');
            }
    
            container.remove();
            loadMainMenu();
        } catch (error) {
            console.error('Google login failed:', error.message);
            errorMessage.classList.remove('hidden');
            errorMessage.innerText = 'Google login failed: ' + error.message;
        }
    });
    

    
    // Close the form when clicking outside of it
    const handleClickOutside = (event) => {
        if (!form.contains(event.target)) {
            container.remove(); // Remove the container from the DOM
            document.removeEventListener('click', handleClickOutside); // Cleanup the event listener
        }
    };

    // Add a slight delay to ensure the click event that triggers the form doesn't immediately close it
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 0);

  
}
