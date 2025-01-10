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
    container.style.position = 'absolute';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.width = '300px';
    container.style.padding = '20px';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '10px';
    container.style.backgroundColor = '#fff';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    container.style.textAlign = 'center';

    const title = document.createElement('h2');
    title.innerText = 'Welcome!';
    title.style.marginBottom = '20px';
    container.appendChild(title);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Name (for Sign Up)';
    nameInput.style.display = 'block';
    nameInput.style.width = '100%';
    nameInput.style.marginBottom = '10px';
    nameInput.style.padding = '10px';
    nameInput.style.border = '1px solid #ccc';
    nameInput.style.borderRadius = '5px';
    container.appendChild(nameInput);

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'Email';
    emailInput.style.display = 'block';
    emailInput.style.width = '100%';
    emailInput.style.marginBottom = '10px';
    emailInput.style.padding = '10px';
    emailInput.style.border = '1px solid #ccc';
    emailInput.style.borderRadius = '5px';
    container.appendChild(emailInput);

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Password';
    passwordInput.style.display = 'block';
    passwordInput.style.width = '100%';
    passwordInput.style.marginBottom = '10px';
    passwordInput.style.padding = '10px';
    passwordInput.style.border = '1px solid #ccc';
    passwordInput.style.borderRadius = '5px';
    container.appendChild(passwordInput);

    const errorMessage = document.createElement('p');
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';
    container.appendChild(errorMessage);

    const loginButton = document.createElement('button');
    loginButton.innerText = 'Login';
    loginButton.style.width = '100%';
    loginButton.style.padding = '10px';
    loginButton.style.marginBottom = '10px';
    loginButton.style.backgroundColor = '#007bff';
    loginButton.style.color = '#fff';
    loginButton.style.border = 'none';
    loginButton.style.borderRadius = '5px';
    loginButton.style.cursor = 'pointer';
    container.appendChild(loginButton);

    const signupButton = document.createElement('button');
    signupButton.innerText = 'Sign Up';
    signupButton.style.width = '100%';
    signupButton.style.padding = '10px';
    signupButton.style.marginBottom = '10px';
    signupButton.style.backgroundColor = '#28a745';
    signupButton.style.color = '#fff';
    signupButton.style.border = 'none';
    signupButton.style.borderRadius = '5px';
    signupButton.style.cursor = 'pointer';
    container.appendChild(signupButton);

    const googleButton = document.createElement('button');
    googleButton.innerText = 'Login with Google';
    googleButton.style.width = '100%';
    googleButton.style.padding = '10px';
    googleButton.style.backgroundColor = '#ea4335';
    googleButton.style.color = '#fff';
    googleButton.style.border = 'none';
    googleButton.style.borderRadius = '5px';
    googleButton.style.cursor = 'pointer';
    container.appendChild(googleButton);

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
            errorMessage.style.display = 'block';
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
            errorMessage.style.display = 'block';
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
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'Google login failed: ' + error.message;
        }
    });
}