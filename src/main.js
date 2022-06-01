// Will Tate
// Dalia De La Luz
// Arrian Chi

// Final Game
// Completed: 
// Time taken: 

'use strict';

var config = {
  
    type: Phaser.CANVAS ,
    width: 1280,
    height: 640,
    scene: [Load, Menu, Play],
   roundPixels: true,
    render: {
      pixelArt: true
  },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {
          x: 0,
          y: 1200
           },  
        debug: true
      }
    }
  }


  // global game options  
let gameOptions = {
  levels:8,
}
let bg_music = null;
let cursors;
let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let level = 0;
let controls;
let pointer;
let keyF, keyR, keyLEFT, keyRIGHT, keySPACE, keyUP, keyENTER;
let restarted = false;