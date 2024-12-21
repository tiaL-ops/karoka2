export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame = 0) {
        console.log('Scene passed to Player:', scene);
        // Call the parent class's constructor with the correct arguments
        super(scene, x, y, texture, frame);

        // Add the player to the scene
        try {
            scene.add.existing(this); // Register with the rendering system
            scene.physics.add.existing(this); // Add to the physics system
        } catch (error) {
            console.error('Error adding player to scene:', error);
        }

        // Set player-specific properties
        this.setOrigin(0.5, 1); // Align origin to the bottom center
        this.setSize(32, 32); // Adjust the collision box size
        this.setOffset(8, 16); // Adjust the collision box offset

        // Movement speed
        this.speed = 200;

        // Input keys (set later in the scene)
        this.cursors = null;
    }

    update() {
        if (!this.cursors) return;

        // Reset velocity
        this.setVelocity(0);

        // Handle movement
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.speed);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(this.speed);
        }

        if (this.cursors.up.isDown) {
            this.setVelocityY(-this.speed);
        } else if (this.cursors.down.isDown) {
            this.setVelocityY(this.speed);
        }
    }
}
