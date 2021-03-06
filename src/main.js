// Will Tate
// Dalia De La Luz
// Arrian Chi

// Final Game
// Completed: 6/7/2022
// Time taken: LOTS

'use strict';

var config = {
  
    type: Phaser.CANVAS ,
    width: 1280,
    height: 640,
    scene: [Load, Menu, Play, End, Transition],
   roundPixels: true,
    render: {
      pixelArt: true
  },
    physics: {
      default: 'arcade',
      arcade: {
        tileBias: 32,
        gravity: {
          x: 0,
          y: 1200
           },  
        debug: false
      }
    }
  }


  // global game options  
let gameOptions = {
  levels:15,
}

let loading_screen = null;

let bg_music = null;
let cursors;
let game = new Phaser.Game(config);
let new_play = false;
let level = 0;
let controls;
let pointer;
let restarted = false;