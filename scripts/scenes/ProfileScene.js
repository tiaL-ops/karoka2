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
    const background = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x222222);
    this.cameras.main.setBounds(0, 0, this.game.config.width, this.game.config.height);

    // Add a title
    this.add.text(centerX, 100, 'Player Profile', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Create input fields
    this.inputs = {}; // Store input elements for later use

    const fieldConfigs = [
      { label: 'Preferred Username:', key: 'username', yOffset: -100 },
      { label: 'Field of Study:', key: 'fieldOfStudy', yOffset: -50 },
      { label: 'Level of Programming (Beginner/Intermediate/Advanced):', key: 'programmingLevel', yOffset: 0 },
      { label: 'Favorite Algorithm:', key: 'favoriteAlgorithm', yOffset: 50 },
    ];

    fieldConfigs.forEach(({ label, key, yOffset }) => {
      this.createInputField(centerX, centerY + yOffset, label, key);
    });

    // Create a submit button
    const submitButton = this.add.text(centerX, centerY + 150, 'Submit', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#d9534f',
      padding: { x: 10, y: 5 },
      borderRadius: 5,
    })
      .setOrigin(0.5)
      .setInteractive();

      const returnButton = this.add.text(centerX, centerY + 200, 'Return', {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#d9534f',
        padding: { x: 10, y: 5 },
        borderRadius: 5,
      })
        .setOrigin(0.5)
        .setInteractive();

    submitButton.on('pointerdown', () => {
      const profileData = {
        username: this.inputs.username.value || '',
        fieldOfStudy: this.inputs.fieldOfStudy.value || '',
        programmingLevel: this.inputs.programmingLevel.value || '',
        favoriteAlgorithm: this.inputs.favoriteAlgorithm.value || '',
      };

      console.log('Logging out with Profile Data:', profileData);
      
    });

    returnButton.on('pointerdown', () => {
      game.loadScene('MainMenuScene', MainMenuScene);
      
    });
    
  }

  createInputField(x, y, label, key) {
    // Add a label for the input field
    this.add.text(x - 200, y, label, {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial',
      align: 'right',
    }).setOrigin(1, 0.5);
  
    // Add a rectangle for alignment reference
    
  
    // Create the input element
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.placeholder = label;
  
    // Style the input element
    inputElement.style.position = 'absolute';
    inputElement.style.padding = '5px';
    inputElement.style.fontSize = '16px';
    inputElement.style.border = '1px solid #ccc';
    inputElement.style.borderRadius = '5px';
  
    // Function to update position and size
    const updateInputPositionAndSize = () => {
      const canvasBounds = this.sys.game.canvas.getBoundingClientRect();
      const rectWorldPosition = this.cameras.main.worldView;
      const scaleX = canvasBounds.width / this.sys.game.scale.width;
      const scaleY = canvasBounds.height / this.sys.game.scale.height;
  
      // Calculate the position relative to the canvas
      const domX = canvasBounds.left + (x - rectWorldPosition.x) * scaleX;
      const domY = canvasBounds.top + (y - rectWorldPosition.y) * scaleY;
  
      // Adjust size dynamically based on screen width
      const maxWidth = Math.min(window.innerWidth, 300); // Cap the width at 300px
      const inputWidth = maxWidth * scaleX;
      const inputHeight = 30 * scaleY;
  
      inputElement.style.width = `${inputWidth}px`;
      inputElement.style.height = `${inputHeight}px`;
      inputElement.style.left = `${domX}px`;
      inputElement.style.top = `${domY}px`;
      inputElement.style.transform = 'translate(-50%, -50%)'; // Center on rect
    };
  
    // Initial update
    updateInputPositionAndSize();
  
    // Append the input element to the document body
    document.body.appendChild(inputElement);
  
    // Store the input for cleanup
    this.inputs[key] = inputElement;
  
    // Recalculate position and size on resize
    window.addEventListener('resize', updateInputPositionAndSize);
  
    // Clean up on scene shutdown
    this.events.on('shutdown', () => {
      inputElement.remove();
      window.removeEventListener('resize', updateInputPositionAndSize);
    });
  }
  
  
  
}