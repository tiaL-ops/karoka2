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
        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user details in Firestore
            await setDoc(doc(db, 'profiles', user.uid), {
                name,
                email,
                uid: user.uid,
            });

            console.log('Signup successful and user saved:', user);
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
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Save user details in Firestore
            await setDoc(doc(db, 'profiles', user.uid), {
                name: user.displayName, // Name from Google profile
                email: user.email,
                uid: user.uid,
            });

            console.log('Google login successful and user saved:', user);
            container.remove();
            loadMainMenu();
        } catch (error) {
            console.error('Google login failed:', error.message);
            errorMessage.classList.remove('hidden');
            errorMessage.innerText = 'Google login failed: ' + error.message;
        }
    });
}
