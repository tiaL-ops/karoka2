export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('button', 'assets/button.png');
    }

    create() {
        const { width, height } = this.scale;

        // Add background and scale it to fit the screen
        const bg = this.add.image(0, 0, 'background');
        bg.setOrigin(0);
        bg.setDisplaySize(width, height);

        // Title text centered at the top portion of the screen
        const titleText = this.add.text(width / 2, height * 0.2, 'KarokaGame', {
            fontSize: `${Math.floor(height * 0.06)}px`,
            fill: '#ffffff',
            fontFamily: 'Poppins, Arial, sans-serif',
            fontStyle: 'bold',
        });
        titleText.setOrigin(0.5);

        // Centered container for the Login button
        const loginContainer = this.add.container(width / 2, height * 0.4);

        // Login button image
        const loginButton = this.add.image(0, 0, 'button')
            .setInteractive()
            .setDisplaySize(width * 0.4, height * 0.1) // Scale button size
            .setOrigin(0.5);

        // Login button text
        const loginText = this.add.text(0, 0, 'Login', {
            fontSize: `${Math.floor(height * 0.035)}px`, // Responsive font size
            fill: '#ffffff',
            fontFamily: 'Poppins, Arial, sans-serif',
        }).setOrigin(0.5);

        // Add login button and text to the container
        loginContainer.add([loginButton, loginText]);

        // Interactivity for Login button
        loginButton.on('pointerover', () => {
            loginButton.setTint(0xaaaaaa); // Hover effect
        });

        loginButton.on('pointerout', () => {
            loginButton.clearTint();
        });

        loginButton.on('pointerdown', () => {
            console.log('Login Clicked');
            // Transition to another scene or action
        });

        // Centered container for the Sign Up button, positioned below Login
        const signupContainer = this.add.container(width / 2, height * 0.55);

        // Sign Up button image
        const signupButton = this.add.image(0, 0, 'button')
            .setInteractive()
            .setDisplaySize(width * 0.4, height * 0.1) // Scale button size
            .setOrigin(0.5);

        // Sign Up button text
        const signupText = this.add.text(0, 0, 'Sign Up', {
            fontSize: `${Math.floor(height * 0.035)}px`, // Responsive font size
            fill: '#ffffff',
            fontFamily: 'Poppins, Arial, sans-serif',
        }).setOrigin(0.5);

        // Add sign up button and text to the container
        signupContainer.add([signupButton, signupText]);

        // Interactivity for Sign Up button
        signupButton.on('pointerover', () => {
            signupButton.setTint(0xaaaaaa); // Hover effect
        });

        signupButton.on('pointerout', () => {
            signupButton.clearTint();
        });

        signupButton.on('pointerdown', () => {
            console.log('Sign Up Clicked');
            // Transition to another scene or action
        });
    }

    resize(gameSize) {
        const { width, height } = gameSize;

        // Resize background
        const bg = this.add.image(0, 0, 'background');
        bg.setOrigin(0);
        bg.setDisplaySize(width, height);

        // Adjust Title
        this.titleText.setPosition(width / 2, height * 0.2);

        // Adjust Login and Sign Up buttons
        this.loginContainer.setPosition(width / 2, height * 0.4);
        this.signupContainer.setPosition(width / 2, height * 0.55);

        this.loginButton.setDisplaySize(width * 0.4, height * 0.1);
        this.signupButton.setDisplaySize(width * 0.4, height * 0.1);

        this.loginText.setFontSize(`${Math.floor(height * 0.035)}px`);
        this.signupText.setFontSize(`${Math.floor(height * 0.035)}px`);
    }
}
