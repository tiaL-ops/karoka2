export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame = 0) {
        console.log('Scene passed to Player:', scene);
        // Call the parent class's constructor with the correct arguments
        super(scene, x, y, texture, frame);

        // Add the player to the scene
        
        scene.add.existing(this); // Register with the rendering system
        scene.physics.add.existing(this); // Add to the physics system
       

        // Set player-specific properties
        this.setOrigin(0.5, 1); // Align origin to the bottom center
        this.setSize(32, 32); // Adjust the collision box size
        this.setOffset(8, 16); // Adjust the collision box offset

        // Movement speed
        this.speed = 200;

        // Input keys (set later in the scene)
        this.cursors = null;

        this.lastDirection = "down";
    }

    update() {
        if (!this.cursors) return;

        // Reset velocity
        this.setVelocity(0);

        // Movement flags
        let isMoving = false;

        // Handle movement and animations
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.anims.play("walk_left", true);
            this.lastDirection = "left";
            isMoving = true;
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.anims.play("walk_right", true);
            this.lastDirection = "right";
            isMoving = true;
        }

        if (this.cursors.up.isDown) {
            this.setVelocityY(-this.speed);
            this.anims.play("walk_up", true);
            this.lastDirection = "up";
            isMoving = true;
        } else if (this.cursors.down.isDown) {
            this.setVelocityY(this.speed);
            this.anims.play("walk_down", true);
            this.lastDirection = "down";
            isMoving = true;
        }

        // Stop animations if not moving
        if (!isMoving) {
            this.anims.stop();
            // Set to the last frame of the last played animation
            switch (this.lastDirection) {
                case "down":
                    this.setFrame(0); // down1
                    break;
                case "left":
                    this.setFrame(4); // left1
                    break;
                case "up":
                    this.setFrame(8); // up1
                    break;
                case "right":
                    this.setFrame(12); // right1
                    break;
            }
        }
    }

}
