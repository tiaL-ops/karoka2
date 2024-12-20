// Create the Phaser game configuration
const config = {
    type: Phaser.AUTO, 
    width: 800, 
    height: 600, 
    scene: {
      preload: preload,
      create: create
    }
  };
  
  // Initialize the Phaser game
  const game = new Phaser.Game(config);
  
  function preload() {
    // Preload assets (you can add images later)
    this.load.image('background', 'assets/background.png');
  }
  
  function create() {
    // Set background
    this.add.image(400, 300, 'background');
  
    // Create a title for the game
    const title = this.add.text(400, 150, 'KarokaGame', { fontSize: '32px', fill: '#fff' });
    title.setOrigin(0.5, 0.5);
  
    // Create a "Start Game" button
    const startButton = this.add.text(400, 300, 'Start Game', { fontSize: '24px', fill: '#0f0' })
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on('pointerdown', () => {
        // Navigate to the next screen (for now just log to console)
        console.log('Start Game clicked');
        // You will replace this with actual game logic
      });
  }
  