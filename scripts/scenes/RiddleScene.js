//this is clearly not working lool to fix 
import MainMenuScene from "./MainMenuScene";
import WorldScene from "./WorldScene";
import game from "../game";
class RiddleScene extends Phaser.Scene {
    constructor() {
      super({ key: 'RiddleScene' });
    }
  
    preload() {

      this.load.image('paper', 'assets/oldpaper.png');
      //this.load.riddleJSON("WPMap", "assets/riddles/riddles.json");
    }
  
    create() {
      this.riddles = this.cache.json.get('riddles'); // Load riddles from JSON
      this.currentLevel = WorldScene.riddle.name; 
      console.log(this.currentLevel);
  
      // Add background, paper, chest, and other visuals
      this.add.image(400, 300, 'paper').setScale(0.8);
      this.chest = this.add.image(600, 300, 'chest').setInteractive();
  
      // Display the riddle text
      this.displayRiddle();
  
      // Handle chest interaction
      this.chest.on('pointerdown', () => {
        this.showInputField();
      });
    }
  
    displayRiddle() {
      const riddleData = this.riddles.find(r => r.level === this.currentLevel);
  
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
      // Clean up previous input and button
      if (this.inputField) {
          this.inputField.remove();
      }
      if (this.submitButton) {
          this.submitButton.remove();
      }
  
      const riddleData = this.riddles.find(r => r.level === this.currentLevel);
  
      // Reference the canvas
      const canvas = this.sys.game.canvas;
      const canvasBounds = canvas.getBoundingClientRect(); // Get canvas size and position
  
      // Create input field dynamically
      this.inputField = document.createElement('input');
      this.inputField.type = 'text';
      this.inputField.id = 'answer';
      this.inputField.placeholder = 'Enter your answer';
      this.inputField.style.position = 'absolute';
      this.inputField.style.width = '80%';
      this.inputField.style.maxWidth = '300px';
      this.inputField.style.fontSize = '16px';
      this.inputField.style.padding = '10px';
      this.inputField.style.border = '2px solid #a67b5b';
      this.inputField.style.borderRadius = '6px';
      this.inputField.style.backgroundColor = '#f0e6d6';
      this.inputField.style.color = '#333';
      this.inputField.style.textAlign = 'center';
      this.inputField.style.left = `${canvasBounds.left + canvasBounds.width / 2 - 150}px`; // Center horizontally
      this.inputField.style.top = `${canvasBounds.top + canvasBounds.height * 0.5}px`; // Position in middle
  
      document.body.appendChild(this.inputField);
  
      // Create submit button dynamically
      this.submitButton = document.createElement('button');
      this.submitButton.textContent = 'Submit';
      this.submitButton.style.position = 'absolute';
      this.submitButton.style.width = '80%';
      this.submitButton.style.maxWidth = '150px';
      this.submitButton.style.fontSize = '16px';
      this.submitButton.style.padding = '10px';
      this.submitButton.style.border = 'none';
      this.submitButton.style.borderRadius = '6px';
      this.submitButton.style.backgroundColor = '#8c6354';
      this.submitButton.style.color = '#fff';
      this.submitButton.style.cursor = 'pointer';
      this.submitButton.style.left = `${canvasBounds.left + canvasBounds.width / 2 - 75}px`; // Center horizontally
      this.submitButton.style.top = `${canvasBounds.top + canvasBounds.height * 0.6}px`; // Position below input
  
      document.body.appendChild(this.submitButton);
  
      // Add click handler for the submit button
      this.submitButton.addEventListener('click', () => {
          this.validateAnswer(riddleData.solution);
      });
  
      // Update positions on window resize
      const resizeHandler = () => {
          const newBounds = canvas.getBoundingClientRect();
          this.inputField.style.left = `${newBounds.left + newBounds.width / 2 - 150}px`;
          this.inputField.style.top = `${newBounds.top + newBounds.height * 0.5}px`;
          this.submitButton.style.left = `${newBounds.left + newBounds.width / 2 - 75}px`;
          this.submitButton.style.top = `${newBounds.top + newBounds.height * 0.6}px`;
      };
  
      window.addEventListener('resize', resizeHandler);
  
      // Clean up on scene shutdown
      this.events.once('shutdown', () => {
          this.inputField.remove();
          this.submitButton.remove();
          window.removeEventListener('resize', resizeHandler);
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
        });
      }
    }
  
 
  }
  
  export default RiddleScene;
  