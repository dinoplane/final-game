class Play extends Phaser.Scene {
    static RESET_DURATION = 500;
    static CAMERA_TWEEN = 'Sine.easeInOut';

    constructor(){
        super("playScene");
        this.VELOCITY = 200;

    }

    create(){

        this.levelLoader = new LevelLoader(this, level);
        this.player = null;
        this.levelComplete = false;
        this.resetDuration = Play.RESET_DURATION;
        this.isZoomed = false;

        this.background = this.levelLoader.loadBackground();

        this.objects = this.levelLoader.loadLevel();
        this.physics.add.collider(this.player, this.levelLoader.loadGround(),
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
        
        this.input.mouse.disableContextMenu();
        this.input.on("pointerdown", (pointer, obj) => {
            if (pointer.rightButtonDown() && Cat.SELECTED_CAT != null){
                Cat.SELECTED_CAT.canceled = true;
            }
        });
        

        // Cameras and camera callbacks
        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.ZOOM_COMPLETE, () => {
            this.isZoomed = !this.isZoomed;
            if (this.isZoomed) this.background.scrollFactorX = 0.5;
        });
        this.moveCam();
        //game.renderer.renderSession.roundPixels = true;
        // this.cameras.main.roundPixels = true;
        // this.cameras.main.startFollow(this.player, true, );
        // set camera dead zone
//        this.cameras.main.setDeadzone(200, 200);
        //this.cameras.main.setName("center");

        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyR.on('down', (key) => {
            this.scene.restart();
        }); 

        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyQ.on('down', (key) => {
            if (this.isZoomed)
                this.resetCam();
            else this.moveCam();
        }); 

        
        //Music control
        // this.bg_music = this.sound.add('bg_music1');
        // this.bg_music.play();

        //this.physics.add.collider(this.player, )
        //this.physics.world.setBounds(game.config.width, game.config.height);
    }

    onGameOver(){
    }
    
    update(time, delta){
        console.log() 
        if (this.player.food == this.foodNum && !this.levelComplete){
            this.levelComplete = true;
            this.player.onLevelComplete();
        }
        this.player.update();
    }

    loadNextLevel(){
        level = (level + 1) % gameOptions.levels;
        this.scene.restart();
    }

    moveCam() {
        if (!this.isZoomed){
            console.log("FLONG");
            //this.isZoomed = true;
            
            // startFollow(target [, roundPixels] [, lerpX] [, lerpY] [, offsetX] [, offsetY])
            this.cameras.main.startFollow(this.player, true);
            
            // zoom in: zoomTo(zoom [, duration] [, ease] [, force] [, callback] [, context])
            this.cameras.main.zoomTo(1, this.resetDuration, Play.CAMERA_TWEEN, false);
            //this.background.setScale(2);
            // this.tweens.create({
            //     targets: this.background,
            //     scrollFactorX: 1,
            //     scrollFactorY: 1,
            //     scaleX: 1,
            //     scaleY: 1,
                
            //     duration: this.resetDuration,
            //     ease: Play.CAMERA_TWEEN,
            //     onUpdate: ()=> {console.log(this.background.scrollFactorX)}
            // }).play();
            
        }        
    }

    resetCam() {
        if (this.isZoomed){
            //this.isZoomed  = false;
            // stop following game objects
            this.cameras.main.stopFollow();
            

            // pan to center world: pan(x, y [, duration] [, ease] [, force] [, callback] [, context])
            //this.cameras.main.pan(game.config.width/2, game.config.height/2, this.resetDuration, 'Sine.easeInOut');
            // Calculate the zoom factor f, g to fit map on scree
            //this.cameras.main.centerOn(game.config.width/2, game.config.height/2);
            // z =  game screen size / map size . Choose more zoom (smaller z)
            let f = game.config.width / this.levelLoader.getMapWidth(); 
            let g = game.config.height / this.levelLoader.getMapHeight();
            let z = Math.min(f, g);
            //this.background.setScrollFactor(1, 1);
            //this.background.setScale(1);
            // this.tweens.create({
            //     targets: this.background,
            //     scrollFactorX: 1,
            //     scrollFactorY: 1,
            //     scaleX: 1,
            //     scaleY: 1,
            //     duration: this.resetDuration,
            //     ease: Play.CAMERA_TWEEN,
            //     onUpdate: ()=> {console.log(this.background.scrollFactorX)}
            // }).play();
            //this.background.scrollFactorX = 1;
           // this.background.setScrollFactor(1, 1)
            console.log(this.background.scrollFactorX)
            //zoom out
            this.cameras.main.zoomTo(z, this.resetDuration, Play.CAMERA_TWEEN, false);
        }
    }

    onGroundCollide(player, ground){
            player.onGround();
            player.body.touching.down = true;
            player.body.touching.none = false;
    }

}

