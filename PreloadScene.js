 export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
        this.candyAudio = null; // Reference to the candy audio object
        this.soundEnabled = true; // Flag to track sound state
        this.settingsMenu = null; // Reference to the settings menu
    }

    preload() {
        // Load assets needed for your game (e.g., images, audio)
        this.load.image('background', 'assets/background.jpg');
        // Add more asset loading here as needed
        this.load.audio("candyAudio1", 'assets/CandyCrushSagaOST.mp3');

    }

    create() {
        // Add background image
        const backgroundImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
        backgroundImage.setScale(this.sys.game.config.width / backgroundImage.width, this.sys.game.config.height / backgroundImage.height);
    
        // Display "Game Loading..." text
        const loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Game Loading...', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        loadingText.setOrigin(0.5);
    
        // Animate the text to scale up and down repeatedly
        this.tweens.add({
            targets: loadingText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1 // Repeat indefinitely
        });
    
        // Play audio
        this.candyAudio = this.sound.add('candyAudio1');
        this.candyAudio.play();
    
        // Wait for 5 seconds before starting the game (adjust as needed)
        setTimeout(() => {
            this.candyAudio.stop();
            // Transition to the main game scene
            this.scene.start('CandyCrush');
        }, 5000);

        
    }
    
}