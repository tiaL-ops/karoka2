export default class TestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TestScene' });
    }

    create() {
        this.add.text(100, 50, 'Phaser DOM Test', { fontSize: '24px', color: '#ffffff' });
    
        // Use a delay to ensure the DOM container is created
        this.time.delayedCall(100, () => {
            const domContainer = document.querySelector('.phaser-dom-container');
    
            if (domContainer) {
                // Create a DOM input element manually
                const inputBox = document.createElement('input');
                inputBox.type = 'text';
                inputBox.value = 'DOM Test';
                inputBox.style.position = 'absolute';
                inputBox.style.left = '100px'; // Position relative to the game canvas
                inputBox.style.top = '100px';
                inputBox.style.width = '200px';
                inputBox.style.padding = '5px';
                inputBox.style.border = '1px solid #ccc';
                inputBox.style.borderRadius = '5px';
                inputBox.style.backgroundColor = '#ffffff';
                inputBox.style.color = '#000000';
    
                // Append the input box to the DOM container
                domContainer.appendChild(inputBox);
    
                console.log('DOM element created manually:', inputBox);
            } else {
                console.error('DOM container not found.');
            }
        });
    }
    
}
