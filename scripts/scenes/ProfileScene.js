import game from '../game.js';
import MainMenuScene from './MainMenuScene.js';

export default class ProfileScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ProfileScene' });
  }

  preload() {
    // Load any assets if needed
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Add a background
    this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x222222);
    this.cameras.main.setBounds(0, 0, this.game.config.width, this.game.config.height);


    // Add a title
    this.add.text(centerX, 100, 'Player Profile', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Create input fields
    const fieldConfigs = [
      { label: 'Preferred Username:', registryKey: 'username', yOffset: -100 },
      { label: 'Field of Study:', registryKey: 'fieldOfStudy', yOffset: -50 },
      { label: 'Level of Programming (Beginner/Intermediate/Advanced):', registryKey: 'programmingLevel', yOffset: 0 },
      { label: 'Favorite Algorithm:', registryKey: 'favoriteAlgorithm', yOffset: 50 },
    ];

    fieldConfigs.forEach(({ label, registryKey, yOffset }) => {
      this.createInputField(centerX, centerY + yOffset, label, registryKey);
    });

    // Create a submit button
    const submitButton = this.add.text(centerX, centerY + 150, 'Submit', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#007BFF',
      padding: { x: 10, y: 5 },
      borderRadius: 5,
    })
      .setOrigin(0.5)
      .setInteractive();

    submitButton.on('pointerdown', () => {
      const profileData = {
        username: this.registry.get('username') || '',
        fieldOfStudy: this.registry.get('fieldOfStudy') || '',
        programmingLevel: this.registry.get('programmingLevel') || '',
        favoriteAlgorithm: this.registry.get('favoriteAlgorithm') || '',
      };
      
      console.log('Profile Submitted:', profileData);

      // Transition back to the main menu
      game.loadScene('MainMenuScene', MainMenuScene);
    });
  }

  createInputField(x, y, label, registryKey) {
    // Add a label for the input field
    this.add.text(x - 150, y, label, {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial',
      align: 'right',
    }).setOrigin(1, 0.5);
    this.add.rectangle(x + 50, y, 300, 20, 0xff0000).setOrigin(0.5);
    // Add an input box as a DOM element
    const inputBox = this.add.dom(x + 50, y, 'input', {
      type: 'text',
      fontSize: '16px',
      padding: '5px',
      width: '300px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    });
    console.log('Input box created:', inputBox);

    if (!inputBox) {
        console.error('Input box creation failed!');
    }

    // Set the initial value from the registry if it exists
    inputBox.node.value = this.registry.get(registryKey) || '';

    // Update the registry whenever the input changes
    inputBox.addListener('input');
    inputBox.on('input', (event) => {
        console.log(`Input detected for ${registryKey}:`, event.target.value);
        this.registry.set(registryKey, event.target.value);
    });
  }


}
