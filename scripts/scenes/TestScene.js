export default class TestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TestScene' });
    }

    create() {
        console.log('Inside TestScene');

        // Get the game canvas dimensions
        const canvasBounds = this.sys.game.canvas.getBoundingClientRect();

        // Dynamically create an input element
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = 'Enter your name';
        inputElement.style.position = 'absolute'; // Position relative to viewport
        inputElement.style.left = `${canvasBounds.left + canvasBounds.width / 2 - 100}px`; // Center horizontally
        inputElement.style.top = `${canvasBounds.top + canvasBounds.height / 2 - 20}px`; // Center vertically
        inputElement.style.width = '200px';
        inputElement.style.padding = '10px';
        inputElement.style.fontSize = '16px';
        inputElement.style.border = '2px solid #000';
        inputElement.style.borderRadius = '5px';

        // Append the input element to the body
        document.body.appendChild(inputElement);

        // Handle input events
        inputElement.addEventListener('change', () => {
            console.log(`Input value: ${inputElement.value}`);
        });

        // Cleanup input element on scene shutdown
        this.events.on('shutdown', () => {
            inputElement.remove();
        });
    }
}
