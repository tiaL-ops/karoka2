export default class InfoDisplay extends Phaser.Scene {
    constructor() {
    super({ key: 'InfoDisplay' });
    }

    create(){
    const panelWidth = 200;
    const panelHeight = this.scale.height; // Full height of the game
    const panelX = this.cameras.main.worldView.x + this.cameras.main.width - panelWidth; // Right edge of the camera
    const panelY = this.cameras.main.worldView.y; // Top of the camera
    
      // Update the container position in the update loop
      this.events.on("update", () => {
        const camera = this.cameras.main;
        const panelX = camera.worldView.x + camera.width - panelWidth; // Lock to the right edge of the camera
        const panelY = camera.worldView.y; // Lock to the top edge of the camera
        panelContainer.setPosition(panelX, panelY);
      });
      
    // Create a container to hold the panel and its content
    const panelContainer = this.add.container(0, 0).setDepth(10);
    
    // Add the panel background to the container
    const panelBackground = this.add.rectangle(
      0, 0, // Relative to the container's origin
      panelWidth+10,
      panelHeight+10,
      0x000000,
      0.8
    ).setOrigin(0, 0);
    panelContainer.add(panelBackground);
    
    // Add username text
    const usernameText = this.add.text(
      10, // Offset inside the container
      10,
      `Username: Player`, // Replace with dynamic username if needed
      {
        font: "16px Arial",
        fill: "#ffffff",
      }
    );
    panelContainer.add(usernameText);
    
    // Add points text
    const pointsText = this.add.text(
      10,
      40,
      `Points: 0`,
      {
        font: "16px Arial",
        fill: "#ffffff",
      }
    );
    panelContainer.add(pointsText);
    
    // Add levels header
    const levelsText = this.add.text(
      10,
      70,
      `Levels:`,
      {
        font: "16px Arial",
        fill: "#ffffff",
      }
    );
    panelContainer.add(levelsText);
    
    // Add clickable levels
    const levels = ["Level 1", "Level 2", "Level 3", "Level 4"];
    levels.forEach((level, index) => {
      const levelText = this.add.text(
        10,
        100 + index * 30, // Spaced within the container
        level,
        {
          font: "14px Arial",
          fill: "#00ff00",
        }
      )
        .setInteractive()
        .on("pointerdown", () => {
          console.log(`${level} clicked`);
        });
      panelContainer.add(levelText);
    });
    
    // Add a logout button
    const logoutButton = this.add.text(
      10,
      panelHeight - 40, // Align to the bottom within the container
      "Logout",
      {
        font: "16px Arial",
        fill: "#ff0000",
      }
    )
      .setInteractive()
      .on("pointerdown", () => {
        console.log("Logged out!");
      });
    panelContainer.add(logoutButton);
    
    // Update points dynamically
    this.events.on("updatePoints", (newPoints) => {
      pointsText.setText(`Points: ${newPoints}`);
    });
    }
}