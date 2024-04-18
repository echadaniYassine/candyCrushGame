class CandyCrush extends Phaser.Scene {
    constructor() {
        super({ key: 'CandyCrush' });
        this.selectedCandy = null; // Track the currently selected candy
    }

    preload() {
        // Load candy images
        this.load.image('Layer 1', 'assets/Layer 1.png');
        this.load.image('Layer 2', 'assets/Layer 2.png');
        this.load.image('Layer 3', 'assets/Layer 3.png');
        this.load.image('Layer 4', 'assets/Layer 4.png');
        this.load.image('Layer 5', 'assets/Layer 5.png');
        this.load.image('Layer 6', 'assets/Layer 6.png');
        this.load.image('Layer 7', 'assets/Layer 7.png');
        // Add more candy images as needed
    }

    create() {
        // Create game board
        this.gameBoard = new GameBoard(this, 30, 30); // Add margin parameters
        this.gameBoard.init();
    }

    selectCandy(candy) {
        if (!this.selectedCandy) {
            // First candy selected
            this.selectedCandy = candy;
        } else {
            // Second candy selected, swap
            const direction = this.getDirection(this.selectedCandy, candy);
            if (direction) {
                this.gameBoard.swapCandy(this.selectedCandy.row, this.selectedCandy.col, direction);
            }
            this.selectedCandy = null; // Reset selected candy
        }
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
}

class Candy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, row, col) {
        super(scene, x, y, 'Layer ' + type);
        this.type = type;
        this.row = row; // Row index of the candy
        this.col = col; // Column index of the candy
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
                const x = (this.scene.sys.game.config.width - (this.numCols * (cellWidth + marginX))) / 2 + j* (cellWidth + marginX); // Center the candies horizontally with margin
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
}

var config = {
    type: Phaser.AUTO,
    width: 900, // Increase game width
    height: 700, // Increase game height
    scene: [CandyCrush]
};

var game = new Phaser.Game(config);