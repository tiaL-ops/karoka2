import WorldScene from './WorldScene.js';

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
      console.log('Chest logic not implemented yet.');
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

    this.riddleText = this.add.text(400, 200, riddleData.riddle, {
      fontSize: '20px',
      color: '#000',
      align: 'center',
      wordWrap: { width: 300 }
    }).setOrigin(0.5);
  }

  showInputField() {
    const riddleData = this.riddles.find(r => r.level === this.currentLevel);
    if (!riddleData) {
        console.error('Riddle data not found for level:', this.currentLevel);
        return;
    }

    // Create and style input element
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = 'answer';
    inputElement.placeholder = 'Enter your answer';
    inputElement.style.width = '300px';
    inputElement.style.fontSize = '18px';
    inputElement.style.padding = '10px';
    inputElement.style.borderRadius = '5px';
    inputElement.style.border = '2px solid #ccc';
    inputElement.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    inputElement.style.position = 'absolute';
    inputElement.style.top = `${350}px`;
    inputElement.style.left = `${window.innerWidth / 2 - 150}px`;

    document.body.appendChild(inputElement);

    // Create and style button element
    const buttonElement = document.createElement('button');
    buttonElement.textContent = 'Submit';
    buttonElement.style.fontSize = '18px';
    buttonElement.style.padding = '10px 20px';
    buttonElement.style.borderRadius = '5px';
    buttonElement.style.border = 'none';
    buttonElement.style.cursor = 'pointer';
    buttonElement.style.backgroundColor = '#28a745';
    buttonElement.style.color = 'white';
    buttonElement.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    buttonElement.style.position = 'absolute';
    buttonElement.style.top = `${400}px`;
    buttonElement.style.left = `${window.innerWidth / 2 - 50}px`;

    document.body.appendChild(buttonElement);

    // Hover effect for the button
    buttonElement.addEventListener('mouseover', () => {
        buttonElement.style.backgroundColor = '#218838';
    });

    buttonElement.addEventListener('mouseout', () => {
        buttonElement.style.backgroundColor = '#28a745';
    });

    buttonElement.addEventListener('click', () => {
        this.validateAnswer(riddleData.solution);
    });

    // Clean up input and button when the scene shuts down
    this.events.once('shutdown', () => {
        inputElement.remove();
        buttonElement.remove();
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
