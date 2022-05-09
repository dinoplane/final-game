// Will Tate
// Dalia De La Luz
// Arrian Chi

// Mole Rush
// Completed: May 2nd
// Time taken: 40+ hours cummulative

// Do we still need load
// Put our names
// Do one final check on the code
// Some sort of message to convey the purpose of the mole
// Mole Speed up message
// Bouncing mole
// Add numbers text (use a tween on the alpha)


// Creative Tilts
// Programming: Instead of utilizing the mole's collision with the ground and fall
//               through pits, we figured it would best fit our style if we made our 
//              Mole collide with a Pit Sprite. In this way, we were able to extend 
//              our Sprite collision to all objects the Mole could collide with and
//              prevent Mole from dealing with weird collision glitches with Arcade Physics.
//              In addition, this allowed us to compartmentalize the core randomness
//              of our game i.e. the Spawner, so that one can manage the positions in one place.

// Art: We took the endless runner format and put our own spin on it by creating two different planes
//      that the Mole could hop in between, utilizing this to create our enemies and pick ups around this idea.
//      This allowed us to create not only the pits that collide with Mole on the tracks but also the bats which
//      collide with Mole while *crossing* tracks. The visual style overall was also worked on quite heavily, 
//      with handmade fonts and animations to give that game a proper feel. 


var config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 720,
    scene: [Load, Menu, Play],
    physics: {
      default: 'arcade',
      arcade: {
           debug: false
      }
    }
  }


  // global game options
let gameOptions = {
  obstacleStartSpeed: 350,
  spawnRange: [config.width, config.width*2.5],
  gemSpawnRange: [config.width/2, config.width],
  obstacleSizeRange: [50, 250],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 2
}

let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let controls;
let keyF, keyR, keyLEFT, keyRIGHT, keySPACE, keyUP, keyENTER;

let highScore = 0; distance =0;

// Spawning inspired from 
// https://www.emanueleferonato.com/2018/11/13/build-a-html5-endless-runner-with-phaser-in-a-few-lines-of-code-using-arcade-physics-and-featuring-object-pooling/
