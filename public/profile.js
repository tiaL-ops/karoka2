import { db, auth } from '../firebase.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

class Profile {
    constructor() {
        this.currentUserId = '';
        this.profileContainer = document.getElementById('profile-container');
        this.inputs = {
            kname: document.getElementById('kname'),
            fieldOfStudy: document.getElementById('fieldOfStudy'),
            programmingLevel: document.getElementById('programmingLevel'),
            bio: document.getElementById('bio'),
        };

        // Initialize event listeners
        this.initEventListeners();

        // Check auth state
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.currentUserId = user.uid;
                this.loadProfileData(user.uid);
            } else {
                console.error('No user is logged in.');
            }
        });
    }

    async loadProfileData(userId) {
        try {
            const profileRef = doc(db, 'profiles', userId);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                const data = profileSnap.data();
                // Populate input fields with placeholders or existing values
                this.inputs.kname.placeholder = data.kname || 'Enter your name';
                this.inputs.kname.value = '';

                this.inputs.fieldOfStudy.placeholder = data.fieldOfStudy || 'Enter your field of study';
                this.inputs.fieldOfStudy.value = '';

                this.inputs.programmingLevel.placeholder = data.programmingLevel || 'Enter your programming level';
                this.inputs.programmingLevel.value = '';

                this.inputs.bio.placeholder = data.bio || 'Write a short bio about yourself';
                this.inputs.bio.value = '';
            } else {
                console.log('No profile data found.');
            }
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    }

    async saveProfileData() {
        if (!this.currentUserId) {
            alert('No user is logged in.');
            return;
        }

        const profileData = {
            kname: this.inputs.kname.value || this.inputs.kname.placeholder,
            fieldOfStudy: this.inputs.fieldOfStudy.value || this.inputs.fieldOfStudy.placeholder,
            programmingLevel: this.inputs.programmingLevel.value || this.inputs.programmingLevel.placeholder,
            bio: this.inputs.bio.value || this.inputs.bio.placeholder,
        };

        try {
            const profileRef = doc(db, 'profiles', this.currentUserId);
            await setDoc(profileRef, profileData, { merge: true });
            alert('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile data:', error);
            alert('Failed to save profile. Please try again.');
        }
    }

    cancelProfileEditing() {
        // Clear the input fields
        Object.values(this.inputs).forEach((input) => {
            input.value = '';
        });

        // Reset placeholders (optional)
        this.loadProfileData(this.currentUserId);
    }

    initEventListeners() {
        // Save button
        const saveButton = document.getElementById('save-profile');
        saveButton.addEventListener('click', () => this.saveProfileData());

        // Cancel button
        const cancelButton = document.getElementById('cancel-profile');
        cancelButton.addEventListener('click', () => this.cancelProfileEditing());
    }
}

// Initialize the Profile class when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Profile();
});
