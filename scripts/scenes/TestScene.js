import WorldScene from './WorldScene.js';
import game from '../game.js';

export default class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TestScene' });
    this.riddles = []; // Store riddles from JSON
    this.currentLevel = 1; // Default level for testing
  }

  preload() {
    this.load.image('paper', 'assets/oldpaper.png');
    this.load.json('riddlesData', 'assets/riddles/riddles.json'); // Load JSON file
  }

  create() {
    // Load riddles from JSON
    this.riddles = this.cache.json.get('riddlesData'); // Get loaded JSON data

    const riddleOrChest = 'riddle'; // Define riddle or chest logic
    console.log('This is current level: ', this.currentLevel); // Log the current level

    if (riddleOrChest === 'riddle') {
      this.displayRiddle();
      this.showInputField();
      
    } else {

        
    }
  }

  displayRiddle() {
    this.add.image(400, 300, 'paper').setScale(0.8);

    const riddleData = this.riddles.find(r => r.level === this.currentLevel);
    if (!riddleData) {
        console.error('Riddle data not found for level:', this.currentLevel);
        return;
    }

    if (this.riddleText) {
        this.riddleText.destroy();
    }

    // Display the riddle
    this.riddleText = this.add.text(400, 200, riddleData.riddle, {
        fontSize: '20px',
        color: '#000',
        align: 'center',
        fontFamily: 'Morris Roman, serif', // Medieval-styled font
        wordWrap: { width: 300 }
    }).setOrigin(0.5);

    // Add the "Return" text styled as medieval
    const returnText = this.add.text(400, 440, 'Return', {
        fontSize: '24px',
        color: '#6a1f1f', // Deep red color for a medieval look
        align: 'center',
        fontFamily: 'Morris Roman, serif', // Ensure it's a medieval style
        stroke: '#f0e6d6', // Light parchment-like stroke
        strokeThickness: 3
    }).setOrigin(0.5);

    // Make the text interactive
    returnText.setInteractive({ useHandCursor: true });

    // Add hover effect
    returnText.on('pointerover', () => {
        returnText.setStyle({ color: '#a83b3b' }); // Highlight text on hover
    });

    returnText.on('pointerout', () => {
        returnText.setStyle({ color: '#6a1f1f' }); // Revert text color on hover out
    });

    // Add click event to switch scene
    returnText.on('pointerdown', () => {
        game.loadScene('WorldScene', WorldScene);
    });
}


showInputField() {
    const riddleData = this.riddles.find(r => r.level === this.currentLevel);
    if (!riddleData) {
        console.error('Riddle data not found for level:', this.currentLevel);
        return;
    }

    // Get canvas bounds
    const canvas = this.sys.game.canvas;
    const canvasBounds = canvas.getBoundingClientRect();

    // Create and style input element (transparent writing effect)
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = 'answer';
    inputElement.placeholder = 'Type your answer...';
    inputElement.style.width = '80%';
    inputElement.style.maxWidth = '300px';
    inputElement.style.height = '35px';
    inputElement.style.fontSize = '18px';
    inputElement.style.fontFamily = 'Cursive, Press Start 2P, monospace'; // Elegant font for handwriting
    inputElement.style.color = '#4b3621'; // Brownish color for text
    inputElement.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // Transparent parchment-like background
    inputElement.style.border = 'none'; // No border for clean look
    inputElement.style.outline = 'none'; // Remove focus outline
    inputElement.style.borderBottom = '2px solid #4b3621'; // Subtle underline for input
    inputElement.style.position = 'absolute';
    inputElement.style.padding = '5px';
    inputElement.style.left = `${canvasBounds.left + canvasBounds.width / 2 - 150}px`;
    inputElement.style.top = `${canvasBounds.top + canvasBounds.height * 0.5 - 40}px`;

    document.body.appendChild(inputElement);

    const returnText = this.add.text(400, 400, 'Submit', {
        fontSize: '24px',
        color: '#6a1f1f', // Deep red color for a medieval look
        align: 'center',
        fontFamily: 'Morris Roman, serif', // Ensure it's a medieval style
        stroke: '#f0e6d6', // Light parchment-like stroke
        strokeThickness: 3
    }).setOrigin(0.5);

    // Make the text interactive
    returnText.setInteractive({ useHandCursor: true });

    // Add hover effect
    returnText.on('pointerover', () => {
        returnText.setStyle({ color: '#a83b3b' }); // Highlight text on hover
    });

    returnText.on('pointerout', () => {
        returnText.setStyle({ color: '#6a1f1f' }); // Revert text color on hover out
    });

    // Add click event to switch scene
    returnText.on('pointerdown', () => {
        const userInput = inputElement.value;
        this.validateAnswer(riddleData.solution, userInput);
    });
    this.events.once('shutdown', () => {
        inputElement.remove();
    });


   

}






  validateAnswer(solution) {
    const userInput = document.getElementById('answer').value;

    if (userInput.trim() === solution.trim()) {
      this.displayMessage('Success! You solved the riddle.', true);
    } else {
      this.displayMessage('Incorrect! Try again.', false);
    }
  }

  displayMessage(message, isSuccess) {
    if (this.resultText) {
      this.resultText.destroy();
    }

    this.resultText = this.add.text(400, 450, message, {
      fontSize: '20px',
      color: isSuccess ? '#00ff00' : '#ff0000',
      align: 'center'
    }).setOrigin(0.5);

    if (isSuccess) {
      this.time.delayedCall(2000, () => {
        console.log('You solved the riddle!');
        // Implement success logic here (e.g., load next level)
      });
    }
  }
}
