class CandyCrush extends Phaser.Scene {
    constructor() {
        super({ key: 'CandyCrush' });
        this.selectedCandy = null; // Track the currently selected candy
        this.score = 0; // Initialize score
        this.level = 1; // Initialize level
        this.moves = 30; // Initialize moves
        this.timer = 60; // Initialize timer (in seconds)
        this.timerText = null; // Timer text object
        this.gameOver = false; // Game over flag
    }

    preload() {
        // Load candy images
        for (let i = 1; i <= 7; i++) {
            this.load.image('Layer ' + i, 'assets/Layer ' + i + '.png');
        }
    }

    create() {
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
        this.timerText = this.add.text(700, 20, 'Time: 60', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        this.timerEvent = this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });
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
            if (this.timer === 0) {
                this.gameOver = true;
                this.showGameOver();
            }
        }
    }

    showGameOver() {
        // Display game over message
        const gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Game Over', { fontFamily: 'Arial', fontSize: 64, color: '#ffffff' });
        gameOverText.setOrigin(0.5);
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
                const cellWidth = 50; // Width of each grid cell
                const cellHeight = 50; // Height of each grid cell
                const marginX = this.marginX || 5; // Default margin X (if not provided)
                const marginY = this.marginY || 5; // Default margin Y (if not provided)
                const x = (this.scene.sys.game.config.width - (this.numCols * (cellWidth + marginX))) / 2 + j * (cellWidth + marginX); // Center the candies horizontally with margin
                const y = (this.scene.sys.game.config.height - (this.numRows * (cellHeight + marginY))) / 2 + i * (cellHeight + marginY); // Center the candies vertically with margin
                const candyType = Phaser.Math.Between(1, 7); // Random candy type for the cell
                const candy = new Candy(this.scene, x, y, candyType, i, j); // Pass row and column indices
                this.grid[i][j] = candy;
            }
        }
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

        // Swap candy positions
        const tempX = candy1.x;
        const tempY = candy1.y;
        candy1.x = candy2.x;
        candy1.y = candy2.y;
        candy2.x = tempX;
        candy2.y = tempY;

        // Swap row and column indices
        candy1.row = row2;
        candy1.col = col2;
        candy2.row = row1;
        candy2.col = col1;

        // Update grid array
        this.grid[row1][col1] = candy2;
        this.grid[row2][col2] = candy1;
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
                candy.destroy(); // Remove candy from the scene
                this.grid[candy.row][candy.col] = null; // Remove candy from the grid
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
                const x = (this.scene.sys.game.config.width - (this.numCols * (50 + this.marginX))) / 2 + j * (50 + this.marginX);
                const y = (this.scene.sys.game.config.height - (this.numRows * (50 + this.marginY))) / 2 + k * (50 + this.marginY);
                const candyType = Phaser.Math.Between(1, 7); // Random candy type for the cell
                const candy = new Candy(this.scene, x, y, candyType, k, j);
                this.grid[k][j] = candy;
            }
        }
    }
}

var config = {
    type: Phaser.AUTO,
    width: 900, // Increase game width
    height: 700, // Increase game height
    scene: [CandyCrush],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    input: {
        gamepad: true
    },
};

var game = new Phaser.Game(config);
