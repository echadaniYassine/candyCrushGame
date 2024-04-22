 export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
        this.candyAudio = null; // Reference to the candy audio object
    }

    preload() {
        // Load assets needed for your game (e.g., images, audio)
        this.load.image('background', 'assets/background.jpg');
        this.load.image('buttonBg', 'assets/background.jpg'); // Load button background image
        this.load.audio("candyAudio", 'assets/CandyCrushSagaOPN.mp3');
    }

    create() {
        // Add background image or any other visual elements for the start page
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');

        // Add a background for the start button
        var buttonBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'buttonBg');
        buttonBg.setOrigin(0.5);

        // Add a start button
        var startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start Game', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        startButton.setOrigin(0.5);
        startButton.setInteractive();

        // Define the pointerdown event for the start button
        startButton.on('pointerdown', () => {
            // Stop the candy audio when transitioning to the loading scene
            if (this.candyAudio) {
                this.candyAudio.destroy();
            }
            // Transition to the loading scene when the button is clicked
            this.scene.start('PreloadScene');
        });

        // Animate the button background
        this.tweens.add({
            targets: buttonBg,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Play audio
        this.candyAudio = this.sound.add('candyAudio');
        this.candyAudio.play();
    }
}