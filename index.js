import { PreloadScene } from './PreloadScene.js';
import { StartScene } from './StartScene.js';
import { CandyCrush } from './CandyCrush.js';

var config = {
    type: Phaser.AUTO,
    width: 900, // Increase game width
    height: 700, // Increase game height
    //scene: [StartScene,PreloadScene,CandyCrush],
    scene: [StartScene, PreloadScene, CandyCrush],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    input: {
        gamepad: true
    },
    backgroundColor: '#4C0099', // Set the background color here

};

var game = new Phaser.Game(config);