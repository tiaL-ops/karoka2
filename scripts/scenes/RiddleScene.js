//this is clearly not working lool to fix 
import MainMenuScene from "./MainMenuScene";
import WorldScene from "./WorldScene";
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
      if (this.inputField) {
        this.inputField.destroy();
      }
  
      const riddleData = this.riddles.find(r => r.level === this.currentLevel);
  
      // Create input field and submit button
      this.inputField = this.add.dom(400, 350).createFromHTML(
        `<input type="text" id="answer" placeholder="Enter your answer" style="width: 200px; font-size: 16px;" />`
      );
  
      if (this.submitButton) {
        this.submitButton.destroy();
      }
  
      this.submitButton = this.add.text(400, 400, 'Submit', {
        fontSize: '20px',
        backgroundColor: '#00ff00',
        color: '#000',
        padding: { x: 10, y: 5 },
        align: 'center'
      }).setInteractive();
  
      this.submitButton.on('pointerdown', () => {
        this.validateAnswer(riddleData.solution);
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
          this.nextLevel();
        });
      }
    }
  
    nextLevel() {
      this.currentLevel++;
      if (this.currentLevel > this.riddles.length) {
        this.scene.start('GameOverScene');
      } else {
        this.displayRiddle();
        if (this.inputField) this.inputField.destroy();
        if (this.submitButton) this.submitButton.destroy();
      }
    }
  }
  
  export default RiddleScene;
  