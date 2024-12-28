import game from '../game.js';
import WorldScene from './WorldScene.js';

export default class AvatarScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AvatarScene' });

        this.currentAvatar = 'boi'; // Default avatar
        this.avatars = {
            boi: null,
            girl: null
        };
        this.avatarNames = ['boi', 'girl'];
        this.selectedIndex = 0;
    }

    preload() {
        // Load avatar sprite sheets
        this.load.spritesheet('boi', 'assets/maps/boiTest.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('girl', 'assets/maps/girl.png', { frameWidth: 48, frameHeight: 48 });
        // Load background and UI assets
        
        
    }

    create() {
        console.log("Avatar created!");

    
    

        // Add animations for both avatars
        this.anims.create({
            key: 'boi_turn',
            frames: this.anims.generateFrameNumbers('boi', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'girl_turn',
            frames: this.anims.generateFrameNumbers('girl', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Add avatars to the scene
        this.avatars.boi = this.add.sprite(300, 250, 'boi').setScale(4).play('boi_turn');
        this.avatars.girl = this.add.sprite(500, 250, 'girl').setScale(4).setVisible(false);

        // Add instructions for switching avatars
        this.add.text(400, 150, 'Press C to Switch', {
            fontSize: '20px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Add navigation arrows
        this.leftArrow = this.add.text(200, 250, '<', { fontSize: '50px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.changeAvatar(-1));

        this.rightArrow = this.add.text(600, 250, '>', { fontSize: '50px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.changeAvatar(1));

        // Add selection text
        this.selectionText = this.add.text(400, 400, 'Choose Your Avatar', { fontSize: '30px', fill: '#fff' })
            .setOrigin(0.5);

        // Add confirm button
        this.confirmButton = this.add.text(400, 500, 'Confirm', {
            fontSize: '25px',
            fill: '#fff',
            backgroundColor: '#000'
        }).setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.confirmSelection());

        // Add keyboard input for avatar switching
        this.input.keyboard.on('keydown-C', () => this.changeAvatar(-1));

        this.updateSelection();
    }

    changeAvatar(direction) {
        // Update selected index
        this.selectedIndex = (this.selectedIndex + direction + this.avatarNames.length) % this.avatarNames.length;
        this.updateSelection();
    }

    updateSelection() {
        // Hide all avatars
        for (const avatarName of this.avatarNames) {
            this.avatars[avatarName].setVisible(false).stop();
        }

        // Show the selected avatar
        const selectedAvatar = this.avatarNames[this.selectedIndex];
        this.avatars[selectedAvatar].setVisible(true).play(`${selectedAvatar}_turn`);

        // Highlight the confirm button for the selected avatar
        this.confirmButton.setBackgroundColor(selectedAvatar === 'boi' ? '#0f0' : '#f00');
        this.currentAvatar = selectedAvatar;
        console.log(`Switched to: ${this.currentAvatar}`);
    }

    confirmSelection() {
        localStorage.setItem('selectedAvatar', this.currentAvatar); // Save selection to local storage
        console.log(`Confirmed selection: ${this.currentAvatar}`);
    
        // Add a delay before loading the new scene
        setTimeout(() => {
            game.loadScene('WorldScene', WorldScene); 
        }, 2000); // Delay of 500ms (adjust as needed)
    }
    
}
