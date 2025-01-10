export default class InstructionsScene extends Phaser.Scene {
    constructor() {
      super({ key: 'InstructionsScene' });
    }
  
    preload() {
      // Load assets for icons and visuals
      this.load.image('signPost', 'assets/maps/sign_post.svg');
      this.load.image('chest', 'assets/maps/chest2.png');
    }
  
    create() {
      // Set background color
      this.cameras.main.setBackgroundColor('#1e1e2f');
  
      // Title text
      this.add.text(
        this.cameras.main.centerX, 
        50, 
        'How to Play Karoka', 
        {
          fontSize: '32px',
          fontFamily: 'Arial',
          color: '#ffffff',
          align: 'center',
        }
      ).setOrigin(0.5);
  
      // Instruction details
      const instructions = [
        "1. First, go around to find the panel.",
        "   It looks like this:",
      ];
  
      // Add first part of instructions
      let yOffset = 120;
      instructions.forEach((line) => {
        this.add.text(50, yOffset, line, {
          fontSize: '20px',
          fontFamily: 'Arial',
          color: '#ffffff',
        });
        yOffset += 30;
      });
  
      // Display sign post image
      this.add.image(150, yOffset + 40, 'signPost').setScale(0.7);
  
      yOffset += 100;
  
      // Continue instructions
      const instructions2 = [
        "2. The panel will display three things:",
        "   - A string text (e.g., '2/ aubdiak m').",
        "   - A riddle you need to solve.",
        "   - An input field where you can submit your answer.",
      ];
  
      instructions2.forEach((line) => {
        this.add.text(50, yOffset, line, {
          fontSize: '20px',
          fontFamily: 'Arial',
          color: '#ffffff',
        });
        yOffset += 30;
      });
  
      // Chest section
      this.add.text(50, yOffset + 30, "3. You have the chest that looks like:", {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#ffffff',
      });
  
      this.add.image(150, yOffset + 90, 'chest').setScale(0.8);
  
      yOffset += 120;
  
      // Online resources and closing
      const closing = [
        "4. You will find online resources to help solve the problem!",
        "That's pretty much it. Have fun!",
        "Please leave feedback, it will be highly appreciated!",
      ];
  
      closing.forEach((line) => {
        this.add.text(50, yOffset, line, {
          fontSize: '20px',
          fontFamily: 'Arial',
          color: '#ffffff',
        });
        yOffset += 30;
      });
  
      // Back to main menu or start button
      const startButton = this.add.text(
        this.cameras.main.centerX, 
        yOffset + 50, 
        'Start Game', 
        {
          fontSize: '24px',
          fontFamily: 'Arial',
          color: '#00ff00',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 },
        }
      ).setOrigin(0.5)
       .setInteractive();
  
      startButton.on('pointerdown', () => {
        this.scene.start('WorldScene');
      });
    }
  }