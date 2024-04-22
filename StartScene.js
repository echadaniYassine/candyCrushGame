export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
        this.candyAudio = null; // Reference to the candy audio object
        this.soundEnabled = true; // Flag to track sound state
        this.settingsMenu = null; // Reference to the settings menu
    }

    preload() {
        // Load assets needed for your game (e.g., images, audio)
        this.load.image('background', 'assets/background.jpg');
        this.load.image('buttonBg', 'assets/background.jpg'); // Load button background image
        this.load.audio("candyAudio", 'assets/CandyCrushSagaOPN.mp3');
    }

    create() {
        // Add background image
        const backgroundImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
        backgroundImage.setScale(this.sys.game.config.width / backgroundImage.width, this.sys.game.config.height / backgroundImage.height);

        // Add a background for the start button
        const buttonBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'buttonBg');
        buttonBg.setOrigin(0.5);
        buttonBg.setScale(this.sys.game.config.width / buttonBg.width, this.sys.game.config.height / buttonBg.height);

        // Add a start button
        const startButton = this.add.text(this.cameras.main.centerX, 500, 'Start Game', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        startButton.setOrigin(0.5);
        startButton.setScale(2);
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

        // Add settings button
        const settingsButton = this.add.text(800, 30, 'Settings', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        settingsButton.setOrigin(0.5);
        settingsButton.setScale(1);
        settingsButton.setInteractive();

        // Define the pointerdown event for the settings button
        settingsButton.on('pointerdown', () => {
            if (!this.settingsMenu) {
                this.showSettingsMenu();
            } else {
                this.destroySettingsMenu();
            }
        });

        // Play audio
        this.candyAudio = this.sound.add('candyAudio', { loop: true }); // Set loop to true
        this.candyAudio.play();
    }

    showSettingsMenu() {
        // Destroy the existing settings menu if it exists
        this.destroySettingsMenu();

        // Create a settings menu group
        this.settingsMenu = this.add.group();

        // Add background for settings menu
        const settingsBg = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 300, 200, 0x000000, 0.8);
        settingsBg.setOrigin(0.5);
        this.settingsMenu.add(settingsBg);

        // Add sound on button
        const soundOnButton = this.add.text(this.cameras.main.centerX - 50, this.cameras.main.centerY - 30, 'Sound On', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
        soundOnButton.setOrigin(0.5);
        soundOnButton.setInteractive();
        this.settingsMenu.add(soundOnButton);

        // Add sound off button
        const soundOffButton = this.add.text(this.cameras.main.centerX + 50, this.cameras.main.centerY - 30, 'Sound Off', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
        soundOffButton.setOrigin(0.5);
        soundOffButton.setInteractive();
        this.settingsMenu.add(soundOffButton);

        // Define the pointerdown event for the sound on button
        soundOnButton.on('pointerdown', () => {
            this.soundEnabled = true;
            this.candyAudio.play();
            soundOnButton.setAlpha(1);
            soundOffButton.setAlpha(0.5);
            // Destroy the settings menu
            // this.destroySettingsMenu(); // Temporarily commented out
        });

        // Define the pointerdown event for the sound off button
        soundOffButton.on('pointerdown', () => {
            this.soundEnabled = false;
            this.candyAudio.stop();
            soundOnButton.setAlpha(0.5);
            soundOffButton.setAlpha(1);
            // Destroy the settings menu
            // this.destroySettingsMenu(); // Temporarily commented out
        });
    }

    destroySettingsMenu() {
        // Destroy the settings menu
        if (this.settingsMenu) {
            this.settingsMenu.destroy(true);
            this.settingsMenu = null;
        }
    }
}
