
export class CandyCrush extends Phaser.Scene {
    constructor() {
        super({ key: 'CandyCrush' });
        this.selectedCandy = null; // Track the currently selected candy
        this.score = 0; // Initialize score
        this.level = 1; // Initialize level
        this.moves = 10; // Initialize moves
        this.timer = null; // Initialize timer (in seconds)
        this.timerText = null; // Timer text object
        this.gameOver = false; // Game over flag
    }

    preload() {
        // Load candy images
        for (let i = 1; i <= 7; i++) {
            this.load.image('Layer ' + i, 'assets/Layer ' + i + '.png');
        }
        this.load.audio('swapSound', 'assets/CandyCrush.mp3');
        this.load.audio('background2', 'assets/CandyCrushSagaGame.mp3');
        this.load.image('background1', 'assets/background.jpg');
        this.load.image('avatar1', 'assets/avatar.jpg');




    }

    create() {
        // Add background image
        const backgroundImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background1');
        backgroundImage.setScale(this.sys.game.config.width / backgroundImage.width, this.sys.game.config.height / backgroundImage.height);

        // Create game board
        this.gameBoard = new GameBoard(this, 30, 30); // Add margin parameters
        this.gameBoard.init();

        // Display score
        this.scoreText = this.add.text(20, 20, 'Score: 0', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });

        // Display level
        this.levelText = this.add.text(20, 50, 'Level: 1', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });

        // Display moves
        this.movesText = this.add.text(20, 80, 'Moves: 30', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });

        // Display timer
        this.timerText = this.add.text(400, 20, 'Time: 60', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        this.timerEvent = this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });

        this.swapSound = this.sound.add('swapSound');

        const GenerateButton = this.add.text(530, 600, 'Generate New ', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        GenerateButton.setOrigin(1, 0);
        GenerateButton.setInteractive();

        // Define the pointerdown event for the replay button
        GenerateButton.on('pointerdown', () => {
            // Stop the current background music
            this.candyAudio.stop();

            // Restart the game
            this.scene.restart('CandyCrush');
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
        this.candyAudio = this.sound.add('background2', { loop: true }); // Set loop to true
        this.candyAudio.play();
    }
    showSettingsMenu() {
        // Destroy the existing settings menu if it exists
        this.destroySettingsMenu();
    
        // Create a settings menu group
        this.settingsMenu = this.add.group();
    
        // Add background for settings menu
        const settingsBg = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 300, 400, 0x000000, 0.8);
        settingsBg.setOrigin(0.5);
        this.settingsMenu.add(settingsBg);
    
        // Add sound on/off buttons
        const soundOnButton = this.add.text(this.cameras.main.centerX - 50, this.cameras.main.centerY - 150, 'Sound On', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
        soundOnButton.setOrigin(0.5);
        soundOnButton.setInteractive();
        this.settingsMenu.add(soundOnButton);
    
        const soundOffButton = this.add.text(this.cameras.main.centerX + 50, this.cameras.main.centerY - 150, 'Sound Off', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
        soundOffButton.setOrigin(0.5);
        soundOffButton.setInteractive();
        this.settingsMenu.add(soundOffButton);
    
        // Define the pointerdown events for the sound buttons
        soundOnButton.on('pointerdown', () => {
            this.soundEnabled = true;
            this.candyAudio.play();
            soundOnButton.setAlpha(1);
            soundOffButton.setAlpha(0.5);
        });
    
        soundOffButton.on('pointerdown', () => {
            this.soundEnabled = false;
            this.candyAudio.stop();
            soundOnButton.setAlpha(0.5);
            soundOffButton.setAlpha(1);
        });
    
        // Add profile section
        const profileHeader = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Profile', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        profileHeader.setOrigin(0.5);
        this.settingsMenu.add(profileHeader);
    
        // Display current username
        const usernameLabel = this.add.text(this.cameras.main.centerX - 80, this.cameras.main.centerY, 'Username:', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
        usernameLabel.setOrigin(0.5);
        this.settingsMenu.add(usernameLabel);
    
        const currentUsername = this.add.text(this.cameras.main.centerX + 80, this.cameras.main.centerY, 'Player1', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
        currentUsername.setOrigin(0.5);
        this.settingsMenu.add(currentUsername);
    
        // Display avatar (if available)
        const avatarLabel = this.add.text(this.cameras.main.centerX - 80, this.cameras.main.centerY + 50, 'Avatar:', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
        avatarLabel.setOrigin(0.5);
        this.settingsMenu.add(avatarLabel);
    
        const currentAvatar = this.add.image(this.cameras.main.centerX + 80, this.cameras.main.centerY + 50, 'avatar1');
        currentAvatar.setOrigin(0.5);
        currentAvatar.setScale(0.01);

        this.settingsMenu.add(currentAvatar);
    
        // Add button to change avatar
        const changeAvatarButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Change Avatar', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
        changeAvatarButton.setOrigin(0.5);
        changeAvatarButton.setInteractive();
        this.settingsMenu.add(changeAvatarButton);
    
        // Define the pointerdown event for changing avatar
        changeAvatarButton.on('pointerdown', () => {
            // Implement logic to change avatar
            // For example, open a modal or display options for selecting a new avatar
        });
    
        // Add button to edit profile
        const editProfileButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 150, 'Edit Profile', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
        editProfileButton.setOrigin(0.5);
        editProfileButton.setInteractive();
        this.settingsMenu.add(editProfileButton);
    
        // Define the pointerdown event for editing profile
        editProfileButton.on('pointerdown', () => {
            // Implement logic to edit profile
            // For example, open a modal with input fields to edit username
        });
    }
    
    destroySettingsMenu() {
        // Destroy the settings menu
        if (this.settingsMenu) {
            this.settingsMenu.destroy(true);
            this.settingsMenu = null;
        }
    }
    



    selectCandy(candy) {
        if (this.gameOver) return;

        if (!this.selectedCandy) {
            // First candy selected
            this.selectedCandy = candy;
        } else {
            // Second candy selected, check if they can be swapped
            if (candy.id === this.selectedCandy.id) {
                this.clearSelection();
                return; // Don't swap candies with the same ID
            }

            const direction = this.getDirection(this.selectedCandy, candy);
            if (direction) {
                this.gameBoard.swapCandy(this.selectedCandy.row, this.selectedCandy.col, direction);
                this.checkMatches();
                this.moves--;
                this.movesText.setText('Moves: ' + this.moves);
                if (this.moves === 0) {
                    this.gameOver = true;
                    this.showGameOver();
                }
            }
            this.clearSelection();
        }
    }

    clearSelection() {
        this.selectedCandy = null; // Reset selected candy
    }

    getDirection(candy1, candy2) {
        // Determine the direction based on the position of the two candies
        const rowDiff = candy2.row - candy1.row;
        const colDiff = candy2.col - candy1.col;

        if (rowDiff === -1 && colDiff === 0) {
            return 'up';
        } else if (rowDiff === 1 && colDiff === 0) {
            return 'down';
        } else if (rowDiff === 0 && colDiff === -1) {
            return 'left';
        } else if (rowDiff === 0 && colDiff === 1) {
            return 'right';
        }

        return null; // Invalid direction
    }

    checkMatches() {
        const matches = this.gameBoard.findMatches();
        if (matches.length > 0) {
            this.gameBoard.removeMatches(matches);
            this.score += matches.length * 10; // Increase score based on number of matches
            this.scoreText.setText('Score: ' + this.score);
            this.levelUp();
        }
    }

    levelUp() {
        if (this.score >= this.level * 100) {
            this.level++;
            this.levelText.setText('Level: ' + this.level);
            this.moves += 5; // Increase moves
            this.movesText.setText('Moves: ' + this.moves);
        }
    }

    updateTimer() {
        if (!this.gameOver) {
            this.timer--;
            this.timerText.setText('Time: ' + this.timer);
            if (this.timer === 0 || this.moves === 0) {
                this.gameOver = true;
                this.showGameOver();
            }
        }
    }


    showGameOver() {
        // Stop the background music
        this.candyAudio.stop();

        // Add background image
        const backgroundImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background1');
        backgroundImage.setOrigin(0.5);

        // Display game over message
        const gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Game Over', { fontFamily: 'Arial', fontSize: 64, color: '#ffffff' });
        gameOverText.setOrigin(0.5);

        // Display ranking message
        const rankingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Your Score: ' + this.score, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        rankingText.setOrigin(0.5);

        const replayButton = this.add.text(490, 600, 'Replay', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        replayButton.setOrigin(1, 0);
        replayButton.setInteractive();

        // Define the pointerdown event for the replay button
        replayButton.on('pointerdown', () => {
            // Reset the game
            this.resetGame();
        });
    }

    resetGame() {
        // Destroy game over elements
        this.scene.remove('backgroundImage');
        this.scene.remove('gameOverText');
        this.scene.remove('rankingText');
        this.scene.remove('replayButton');

        // Reset game state
        this.selectedCandy = null;
        this.score = 0;
        this.level = 1;
        this.moves = 10;
        this.timer = 60;
        this.gameOver = false;

        // Restart the game
        this.scene.restart('CandyCrush');
    }








}

class Candy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, row, col) {
        super(scene, x, y, 'Layer ' + type);
        this.type = type;
        this.row = row; // Row index of the candy
        this.col = col; // Column index of the candy
        this.id = this.row * 10 + this.col; // Unique ID for the candy
        this.setInteractive();
        scene.add.existing(this);
        this.on('pointerdown', this.onClick, this); // Add event listener for click
    }

    onClick() {
        this.scene.selectCandy(this); // Call method to select candy when clicked
    }
}

class GameBoard {
    constructor(scene, marginX, marginY) {
        this.scene = scene;
        this.grid = [];
        this.numRows = 6;
        this.numCols = 9;
        this.marginX = marginX;
        this.marginY = marginY;
    }

    init() {
        this.createGrid();
    }

    createGrid() {
        for (let i = 0; i < this.numRows; i++) {
            this.grid[i] = [];

            for (let j = 0; j < this.numCols; j++) {
                const cellWidth = 30; // Width of each grid cell
                const cellHeight = 50; // Height of each grid cell
                const marginX = this.marginX || 5; // Default margin X (if not provided)
                const marginY = this.marginY || 5; // Default margin Y (if not provided)
                const x = (this.scene.sys.game.config.width - (this.numCols * (cellWidth + marginX))) / 2 + j * (cellWidth + marginX); // Center the candies horizontally with margin
                const startY = -cellHeight * (this.numRows - i); // Start candies above the grid

                let candyType = Phaser.Math.Between(1, 7); // Random candy type for the cell

                // Check for matches after placing each candy
                while (this.checkMatchAtPosition(i, j, candyType)) {
                    candyType = Phaser.Math.Between(1, 7); // Generate a new candy type if the current one forms a match
                }

                // Create candies with initial position above the grid
                const candy = new Candy(this.scene, x, startY, candyType, i, j);
                candy.setScale(0);

                // Animate candies to fall into position with a bounce effect
                this.scene.tweens.add({
                    targets: candy,
                    y: (this.scene.sys.game.config.height - (this.numRows * (cellHeight + marginY))) / 2 + i * (cellHeight + marginY),
                    scaleX: 1,
                    scaleY: 1,
                    duration: 800,
                    delay: i * 50 + j * 50, // Add delay based on position for staggered effect
                    ease: 'Bounce.Out', // Use bounce out effect for animation
                });

                this.grid[i][j] = candy;
            }
        }
    }



    checkMatchAtPosition(row, col, type) {
        // Check horizontal matches
        if (col > 1 && this.grid[row][col - 1].type === type && this.grid[row][col - 2].type === type) {
            return true;
        }

        // Check vertical matches
        if (row > 1 && this.grid[row - 1][col].type === type && this.grid[row - 2][col].type === type) {
            return true;
        }

        return false;
    }

    swapCandy(row, col, direction) {
        // Check if the clicked candy is at the edge of the grid
        if (row < 0 || row >= this.numRows || col < 0 || col >= this.numCols) {
            return;
        }

        // Check if the clicked candy is not at the edge of the grid
        if (direction === 'up') {
            this.swap(row, col, row - 1, col); // Swap with candy above
        } else if (direction === 'down') {
            this.swap(row, col, row + 1, col); // Swap with candy below
        } else if (direction === 'left') {
            this.swap(row, col, row, col - 1); // Swap with candy on the left
        } else if (direction === 'right') {
            this.swap(row, col, row, col + 1); // Swap with candy on the right
        }

    }

    swap(row1, col1, row2, col2) {
        const candy1 = this.grid[row1][col1];
        const candy2 = this.grid[row2][col2];




        // Animate candy1 to move to candy2's position
        this.scene.tweens.add({
            targets: candy1,
            x: candy2.x,
            y: candy2.y,
            duration: 200,
            ease: 'Linear',
        });

        // Animate candy2 to move to candy1's position
        this.scene.tweens.add({
            targets: candy2,
            x: candy1.x,
            y: candy1.y,
            duration: 200,
            ease: 'Linear',
            onComplete: () => {
                // Swap row and column indices after animation completes
                candy1.row = row2;
                candy1.col = col2;
                candy2.row = row1;
                candy2.col = col1;

                // Update grid array after animation completes
                this.grid[row1][col1] = candy2;
                this.grid[row2][col2] = candy1;

                // Check for matches after candies are swapped
                this.scene.checkMatches();
            }
        });
    }


    findMatches() {
        const matches = [];

        // Check horizontal matches
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numCols - 2; j++) {
                const candy1 = this.grid[i][j];
                const candy2 = this.grid[i][j + 1];
                const candy3 = this.grid[i][j + 2];
                if (candy1 && candy2 && candy3 && candy1.type === candy2.type && candy2.type === candy3.type) {
                    matches.push([candy1, candy2, candy3]);
                }
            }
        }

        // Check vertical matches
        for (let j = 0; j < this.numCols; j++) {
            for (let i = 0; i < this.numRows - 2; i++) {
                const candy1 = this.grid[i][j];
                const candy2 = this.grid[i + 1][j];
                const candy3 = this.grid[i + 2][j];
                if (candy1 && candy2 && candy3 && candy1.type === candy2.type && candy2.type === candy3.type) {
                    matches.push([candy1, candy2, candy3]);
                }
            }
        }

        return matches;
    }

    removeMatches(matches) {
        matches.forEach(match => {
            match.forEach(candy => {
                // Animate candy to scale down and fade out
                this.scene.tweens.add({
                    targets: candy,
                    scaleX: 0,
                    scaleY: 0,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        candy.destroy(); // Remove candy from the scene after animation
                        this.grid[candy.row][candy.col] = null; // Remove candy from the grid
                        this.scene.swapSound.play();
                    }
                });
            });
        });

        // Trigger cascading effect
        this.fillEmptySpaces();
    }



    fillEmptySpaces() {
        for (let j = 0; j < this.numCols; j++) {
            let emptySpaces = 0;
            for (let i = this.numRows - 1; i >= 0; i--) {
                if (!this.grid[i][j]) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    const candy = this.grid[i][j];
                    candy.row += emptySpaces;
                    this.grid[i + emptySpaces][j] = candy;
                    this.grid[i][j] = null;
                }
            }
            for (let k = 0; k < emptySpaces; k++) {
                const cellWidth = 900 / this.numCols;
                const cellHeight = 700 / this.numRows;
                const x = (900 - this.numCols * cellWidth) / 2 + j * cellWidth; // Adjusted x position calculation
                const y = (700 - this.numRows * cellHeight) / 2 + (emptySpaces - k) * cellHeight; // Adjusted y position calculation

                const candyType = Phaser.Math.Between(1, 7); // Random candy type for the cell
                const candy = new Candy(this.scene, x, y, candyType, k, j);
                candy.setScale(0);
                this.grid[k][j] = candy;

                // Animate candies to fall into position with a bounce effect
                this.scene.tweens.add({
                    targets: candy,
                    y: (this.scene.sys.game.config.height - (this.numRows * cellHeight)) / 2 + k * cellHeight, // Adjusted y position calculation
                    scaleX: 1,
                    scaleY: 1,
                    duration: 800,
                    delay: k * 50, // Add delay based on position for staggered effect
                    ease: 'Bounce.Out', // Use bounce out effect for animation
                });
            }
        }
    }

}