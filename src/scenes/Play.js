class Play extends Phaser.Scene {
    static OBSTACLE_TYPE = ["pit", "bat"];

    constructor(){
        super("playScene");
    }

    preload(){

    }

    create(){
        this.gameOver = false;
        this.ended=false;
        this.goneFar=false;
        this.POSITIONS = [{x: Math.round(game.config.width/4),       y: Math.round(2.7*game.config.height/4+10)},
                          {x: Math.round(2.0*game.config.width/4),   y: Math.round(2.1*game.config.height/4+10)}]

        this.SCALE = 0.6;
        this.WORLD_BOUNDS = {min: Math.round(-game.config.width/2), max: Math.round(3*game.config.width)}

        this.bgMusic = this.sound.add('bgMusic');
        this.bgMusic.loop = true;
        this.bgMusic.play();
        this.gemCollect = this.sound.add('gem_collect');
        this.gameOverTone = this.sound.add('gameover', {volume: 0.3});
        this.audiotracks = [this.bgMusic, this.gemCollect, this.gameOverTone]

        
        // this.particleSystem = this.particleManager.createEmitter({})

        // this.particleSystem = this.particleManager.createEmitter();
        // this.particleSystem.setPosition(x, y);

        //this.physics.world.setBounds(this.WORLD_BOUNDS.min, 0, this.WORLD_BOUNDS.max, game.config.height);
        //this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, highScore);
        //this.scoreRight = this.add.text(game.config.width -2*(borderUISize - borderPadding), borderUISize + borderPadding*2, distance);
        
        this.cave_wall0 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cave_wall')
                                .setOrigin(0, 0).setDepth(0);
        this.cave_wall1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'purplestones')
                                .setOrigin(0, 0).setDepth(0);
        this.cave_wall2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'stones')
                                .setOrigin(0, 0).setDepth(0);
        this.cave_back = this.add.tileSprite(0, this.POSITIONS[1].y - 10, game.config.width, 128, 'cave_back')
                                .setOrigin(0,0).setDepth(1);

        this.tracks_back = this.add.image(0, this.POSITIONS[1].y +10, 'tracks').setOrigin(0,0).setDepth(1).
                                                            setDisplaySize(game.config.width, 32).setTint(0xffffff);

        this.cave_front = this.add.tileSprite(0, this.POSITIONS[0].y - 10, game.config.width, 128, 'cave_front')
                                .setOrigin(0,0).setDepth(5);
                                this.cave_front.setScale((game.config.height - this.cave_front.y)/this.cave_front.height);

        this.tracks_front = this.add.image(0, this.POSITIONS[0].y+20, 'tracks').setOrigin(0,0).setDepth(5);

        this.gameOverPrompt = this.add.image(game.config.width/2, game.config.height/2, 'gameoverprompt')
                                .setDepth(10).setVisible(false);



        this.mole = new Mole(this, this.POSITIONS[0].x, this.POSITIONS[0].y + 10,
                                   this.POSITIONS[1].x, this.POSITIONS[1].y, 
                                   this.SCALE, 'mole_atlas', 'molecart0000').setDepth(7);

        this.bat = new Bat(this, this.WORLD_BOUNDS.max, this.POSITIONS[0].y - 100, this.POSITIONS[1].y - 40, 1, 0)
                                   .setOrigin(0,0).setDepth(6);
        this.physics.add.overlap(this.mole, this.bat, (mole, bat) => {this.handleBats(mole, bat);});
                                   
        //Invisible barriers for mole
        let i_walls = this.physics.add.staticGroup();
        let mole_bounds = [borderUISize, game.config.width-borderUISize];
        for (let pos of mole_bounds) i_walls.create(pos, 360, 'i_wall').setImmovable().setOrigin(0,0);
        this.physics.add.collider(this.mole, i_walls);

        this.pitSpawner = new Spawner(this, this.mole, Pit, game.config.width,
                                                            this.WORLD_BOUNDS.max / 2,
                                                            this.POSITIONS[0].y+25,
                                                            this.POSITIONS[1].y+10,
                                                            this.SCALE);
        this.physics.add.overlap(this.mole, this.pitSpawner.obstacleGroup, (mole, pit) => {this.handlePits(mole, pit);});

        this.gemSpawner = new GemSpawner(this, this.mole, Gem, game.config.width,
                                                            this.WORLD_BOUNDS.max ,
                                                            this.POSITIONS[0].y,
                                                            this.POSITIONS[1].y,
                                                            this.SCALE,
                                                            'gem',
                                                            200);
        this.physics.add.overlap(this.mole, this.gemSpawner.obstacleGroup, (mole, gem) => {this.handleGems(mole, gem);});

        this.spawners = [this.pitSpawner,    this.gemSpawner];

        this.physics.add.overlap(this.gemSpawner.obstacleGroup, this.pitSpawner.obstacleGroup, 
                        (gem, pit) => {
                                    gem.setVelocityX(0);
                                    this.gemSpawner.obstacleGroup.killAndHide(gem);
                                    this.gemSpawner.obstacleGroup.remove(gem);
                        });

        this.anims.create({
            key: 'mini',
            defaultTextureKey: 'mole_atlas',
            frames:  this.anims.generateFrameNames('mole_atlas', { 
                prefix: 'explosion',
                start: 0, 
                end: 6, 
                suffix: '',
                zeroPad: 4,
            }),
            frameRate: 12,
            
        });

       // Debugging tool
    //    var controlConfig = {
    //         camera: this.cameras.main,
    //         zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
    //         zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    //         acceleration: 0.06,
    //         drag: 0.0005,
    //         maxSpeed: 1.0
    //     };
    //     controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.keyR.on('down', (key) => {
           if (this.gameOver) {
                this.audiotracks.forEach((sound) => {sound.stop();})
                this.mole.stopAudio();
                this.goneFar=false;
                this.ended=false;
                this.gemSpawner.updateOdds();
                distance=0;
                highScore=0;
                this.scene.restart();
           }
        }); 

        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyENTER.on('down', (key) => {
            if (this.gameOver) { 
                this.audiotracks.forEach((sound) => {sound.stop();})
                this.mole.stopAudio();
                this.scene.start("menuScene");
            }
            //this.ended=false;
         }); 
       
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x130F3E)
                            .setOrigin(0, 0).setDepth(9);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x130F3E)
                            .setOrigin(0, 0).setDepth(9);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x130F3E)
                            .setOrigin(0, 0).setDepth(9);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x130F3E)
                            .setOrigin(0, 0).setDepth(9);
                            
        //this.physics.add.overlap(this.mole, this.obstacleGroup);
       
       //this.physics.world.on('worldbounds', this.onWorldBounds);

           // display score
    let scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
        top: 5,
        bottom: 5,
        },
        fixedWidth: 100
    }
    this.scoreLabel = this.add.bitmapText(borderUISize + borderPadding, 
                                    borderUISize + borderPadding*2, 'lavender', ''  );
    }


    updateSpeed(){
        this.spawners.forEach((spawner) => {spawner.updateSpeed()})
    }

    // Collision Callbacks
    // onWorldBounds(body){
    //     body.gameObject.reset();
    // }

    handleBats(mole, bat){
        // The mole needs to be on the same plane, not switching and not damaged
        if (mole.switching & !mole.damaged){
            let tmpBoom = this.add.sprite(bat.x, bat.y, 'mole_atlas', 'explosion0000')
                                    .setOrigin(0,0).setScale(0.8).setDepth(10);
            tmpBoom.play('mini');
            tmpBoom.on('animationcomplete', () => {    // callback after anim completes
                tmpBoom.visible = false;
                tmpBoom.destroy();
            });
            mole.takeDamage();
            if (mole.hits == 0) this.onGameOver();
        }
    }

    handlePits(mole, pit){
        if (mole.plane == pit.plane && !mole.switching){
            this.onGameOver();   
        }
    }

    onGameOver(){
        if (!this.gameOver){
            this.gameOver = true;
            this.gameOverPrompt.setVisible(true);
            this.bgMusic.pause();
            this.gameOverTone.play();
            this.mole.onGameOver();
            this.spawners.forEach((spawner) => {spawner.onGameOver()})
            this.bat.onGameOver();
        }
    }
    
    handleGems(mole, gem){
        if (mole.plane == gem.plane||mole.switching){
            this.gemCollect.play();
            mole.updateScore(gem.value);
            let valText = this.add.bitmapText(gem.x, gem.y, 'lavender','+' + gem.value).setDepth(10).setScale(gem.scale);
            let valTween = this.tweens.create({
                targets: valText,
                y: valText.y - 30,
                alpha: 0,
                duration: 750,
                ease: 'Sine.easeInOut',
                easeParams: [ 3.5 ],
                onComplete: (target) => {
                    valText.destroy();
       
                },
                onUpdate: () => {  },
                paused: true
            });
            valTween.play();
            this.gemSpawner.obstacleGroup.killAndHide(gem);
            this.gemSpawner.obstacleGroup.remove(gem); 
        }
    }

    handleDrag(mole, drag){
        mole.setDrag(600);
        mole.setAcceleration(0);
    }

    resetDrag(mole, drag){
        mole.setDrag(0);
    }

    update(time, delta){
        if (!this.gameOver){
            this.cave_wall0.tilePositionX += this.mole.speed / 4;
            this.cave_wall1.tilePositionX += this.mole.speed/3;
            this.cave_wall2.tilePositionX += this.mole.speed/2;
            
            this.cave_front.tilePositionX += this.mole.speed;
            
            this.cave_back.tilePositionX += this.mole.speed/2;
            
            this.mole.update();
            this.scoreLabel.text = this.mole.score;
            //controls.update(delta);
            distance++;
            //this.gemSpawner.nextObstacleDistance = 50; //Gem Frenzy

            this.spawners.forEach((spawner) => {spawner.update()})
            this.bat.update();

            highScore+=distance;
            //this.scoreLeft.text=highScore;
            //this.scoreRight.text=distance;
            
            if(!this.goneFar&&distance>=6000){
                this.gemSpawner.updateOdds(1,2,5);
                this.goneFar=true;
            }
        }else if(!this.goneFar&&distance>=2500){
            this.gemSpawner.updateOdds(1,4,7);
        } // oh yea im doing this via call backs
            //this.add.text(game.config.width/2, game.config.height/2 + 64, 'Game Over').setOrigin(0.5).setDepth(10);;
            //this.add.text(game.config.width/2, game.config.height/2 + 96, 'Press (R) to Restart').setOrigin(0.5).setDepth(10);
        // }else{
        //     if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
        //         //maybe store a high score
        //         highScore=0;
        //         this.ended=false;
        //         this.gameOver=false;
        //         this.scene.start("menuScene");
        //     }if(Phaser.Input.Keyboard.JustDown(keyR)){
        //         //maybe store a high score
        //         highScore=0;
        //         this.ended=false;
        //         this.gameOver=false;
        //         this.scene.restart();
        //     }
        }

    getRandomInt(max = 0) {
        return Math.floor(Math.random() * max);
    }

    getRandomInt(min=0, max = 0) {
        return min + Math.floor(Math.random() * (max - min));
    }
}

