class Play extends Phaser.Scene {
    static RESET_DURATION = 500;
    static CAMERA_TWEEN = 'Linear';

    constructor(){
        super("playScene");
        this.VELOCITY = 200;

    }

    create(){
        
        // Set up global variables
        this.input.setPollAlways(true);
        pointer = this.input.activePointer  ;

        // Set up instance variables
        this.levelLoader = new LevelLoader(this, level);
        this.player = null;
        this.levelComplete = false;
        this.resetDuration = Play.RESET_DURATION;
        this.isZoomed = false;

        // Sounds
        this.restartSfx = this.sound.add('restart');

        // Load Level
        this.background = this.levelLoader.loadBackground();
        this.ground = this.levelLoader.loadGround();
        this.objects = this.levelLoader.loadLevel();

        // Add Colliders
        this.physics.add.collider(this.player, this.ground,
                                    (p, g) => {
                                        this.onGroundCollide(p, g);
                                    });

        this.physics.add.overlap(this.player, this.objects.food, (player, food) => {
            food.onCollide(player);
        });
        this.foodNum = this.objects.food.length;

        Cat.P2C_COLLIDER = this.physics.add.collider(this.player, this.objects.cats.slice(), 
            (player, cat) => {
                cat.onCollide(player);
            },
            
            (player, cat) => {
                cat.onBeforeCollide(player);
            }
        );
        Cat.P2C_OVERLAP = this.physics.add.overlap(this.player, this.objects.cats.slice(), (player, cat) => {
            cat.onOverlap(player);
        });
        
        Cat.C2C_OVERLAP = this.physics.add.collider(this.objects.cats.slice(), this.objects.cats.slice(), (cat1, cat2) => {
            cat1.onCatOverlap(cat2);
        });
        Cat.createThoughts(this);

        PopupElement.RANGE_OVERLAP = this.physics.add.overlap(this.player, PopupElement.RANGE_BODIES);

        this.input.mouse.disableContextMenu();
        this.input.on("pointerdown", (pointer, obj) => {
            if (pointer.rightButtonDown() && Cat.SELECTED_CAT != null){
                Cat.SELECTED_CAT.canceled = true;
            }
        });

        // Cameras and camera callbacks
        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.ZOOM_COMPLETE, () => {
            this.isZoomed = !this.isZoomed;
        });
        this.moveCam();

        // Restart
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyR.on('down', (key) => {
            restarted = true;
            this.scene.restart();
        }); 

        // Toggle zoom
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyQ.on('down', (key) => {
            if (this.isZoomed)
                this.resetCam();
            else this.moveCam();
        }); 

        // 
        this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.keyP.on('down', (key) => {
            this.loadNextLevel();
        }); 

        // restart control
        if (restarted && !new_play){
            restarted = false;
            new_play = false;
            console.log("I came here")
            this.cameras.main.flash();
            this.restartSfx.play();
            this.input.keyboard.enabled = true;
            this.input.mouse.enabled = true;
        } else {
            // Disable all input until transition finishes
            this.input.keyboard.enabled = false;
            this.input.mouse.enabled = false;
        }




    }

    onGameOver(){
    }
    


    loadNextLevel(){
        level += 1;
        
        this.scene.get('transitionScene').transition();
        // var timer = this.time.delayedCall(500,  () => {
        //     this.scene.restart();
        // });

        // })
        
    }

    moveCam() {
        if (!this.isZoomed){
            this.cameras.main.startFollow(this.player, true);
            //this.background.scrollFactorX = 0.5;
            this.cameras.main.zoomTo(1, this.resetDuration, Play.CAMERA_TWEEN, false);
            this.tweens.create({
                targets: this.background,
                scrollFactorX: 0.25,
                x: 0,
                duration: this.resetDuration,
                ease: Play.CAMERA_TWEEN,
                onUpdate: ()=> {}
            }).play();
            
        }        
    }

    resetCam() {
        if (this.isZoomed){
            //this.isZoomed  = false;
            // stop following game objects
            this.cameras.main.stopFollow();
            
            // pan to center world: pan(x, y [, duration] [, ease] [, force] [, callback] [, context])
            this.cameras.main.pan(game.config.width/2, game.config.height/2, this.resetDuration, 'Sine.easeInOut');
            // Calculate the zoom factor f, g to fit map on scree
            // z =  game screen size / map size . Choose more zoom (smaller z)
            let f = game.config.width / this.levelLoader.getMapWidth(); 
            let g = game.config.height / this.levelLoader.getMapHeight();
            let z = Math.min(f, g);
            //this.background.scrollFactorX = 1;
            //this.background.setScale(1);
            this.tweens.create({
                targets: this.background,
                scrollFactorX: 0,
                x: -this.background.width*(1-z)/2,
                duration: this.resetDuration,
                ease: Play.CAMERA_TWEEN,
                onUpdate: ()=> {}
            }).play();
            // this.background.setScrollFactor(1, 1)
            //zoom out
            this.cameras.main.zoomTo(z, this.resetDuration, Play.CAMERA_TWEEN, false);
        }
    }

    onGroundCollide(player, ground){
        player.body.touching.down = true;
        player.body.touching.none = false;
        player.onGround(ground);

    }


    update(time, delta){
        if (this.player.food == this.foodNum && !this.levelComplete){
            this.levelComplete = true;
            this.player.onLevelComplete();
        }
        this.player.update();
        this.objects.cats.forEach((cat) => {
            cat.update()
        });

        this.objects.popups.forEach((popup) => {
            popup.update();
        });

    //     this.te.setText([
    //         'x: ' + pointer.x,
    //         'y: ' + pointer.y,
    //         'mid x: ' + pointer.midPoint.x,
    //         'mid y: ' + pointer.midPoint.y,
    //         'velocity x: ' + pointer.velocity.x,
    //         'velocity y: ' + pointer.velocity.y,
    //         'movementX: ' + pointer.movementX,
    //         'movementY: ' + pointer.movementY,
    //         'world x: ' + pointer.worldX,
    //         'world y: ' + pointer.worldY,
    //     ]);
    // }
    }
}

