class Player extends Phaser.Physics.Arcade.Sprite { // Camera flash on restart 
    // Spring Cat
    static TEXTURE_PREFIX = [ "brain", "miao"];
    // Wind Cat...
    // Sound
    static ACCEL = 3000;
    static JUMP_V = 500;
    static SPRING_V = 1000;
    static FALL_V = 1000;
    static MAX_V = 400;
    static DRAG = 1000;
    static MAX_JUMPS = 2;

    static CONTROL_CONFIG = [{name: 'left', arg: -Player.ACCEL, },
                             {name: 'right', arg: +Player.ACCEL}]

    constructor(scene, x, y){
        super(scene, x, y, "brain_atlas", "miao_idle000");
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setUpAnimations();
        this.setUpParticles();

        this.gameOver = false;
        this.levelComplete = false;
        this.food = 0;
        this.jumps = 0;
        this.brainJuicing = 0;
        this.platform = null;
        this.isGrounded = false;
        this.sliding = false;

        // Controls
        this.scene.input.keyboard.enabled = true;

        this.cursors = this.scene.input.keyboard.addKeys({ 
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 
            up: Phaser.Input.Keyboard.KeyCodes.UP, 
        });
        
        this.wasd = this.scene.input.keyboard.addKeys({ 
            'left': Phaser.Input.Keyboard.KeyCodes.A, 
            'right': Phaser.Input.Keyboard.KeyCodes.D, 
            up: Phaser.Input.Keyboard.KeyCodes.W, 
        });

        this.controls = [this.cursors, this.wasd]

        for (let set of this.controls){
            set.up.on('down', key =>{
                this.onJump();
            });

            for (let c of Player.CONTROL_CONFIG){
                set[c.name].on('up', (key) => {
                    this.onXUp(c.arg);
                });
            }
        }

        // Physics and appearance
        this.setMaxVelocity(Player.MAX_V, Player.JUMP_V);
        this.setDragX(Player.DRAG);
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;   
        this.setBounce(0,0);
        this.setSize(this.displayWidth - 20, this.displayHeight);
        this.anims.play(this.isBrain()+"_idle");

        // Sounds
        this.jump_fx = scene.sound.add('jump');
        this.double_jump_fx = scene.sound.add('double_jump');
    }
    
    setUpParticles(){
        this.particleManager =  this.scene.add.particles('hover').setDepth(4);
        this.hoverFx = this.particleManager.createEmitter({
            x: this.cx(),
            y: this.y,
            scale: {start: 1, end:2},
            alpha:  {start: 1, end:0, ease: 'Sine.EaseInOut'},
            // (p, k, t, v) => {
            //     return 1-t;
            // } ,
            //delay: 1000,
            lifespan: 500,
            on: false,
            
            speedY: 100,
            frequency: 100,
            //maxParticles: 3
        });

        this.hoverTimer = this.scene.time.addEvent({
            delay: 250, // ms
            callback: () =>{ 
                this.hoverFx.stop();
                this.hoverTimer.paused = true;
            },
            paused: true,
            callbackScope: this,
            loop: true   
        });
    }

    setUpAnimations(){
        this.animations = [];
        for (let i = 0; i < 2; i++){
            let a = {run: null, hop: null, fall: null, slide: null, idle: null};
            a.run = this.anims.create({
                key: Player.TEXTURE_PREFIX[i]+'_run',
                defaultTextureKey: Player.TEXTURE_PREFIX[i]+'_atlas',
                frames:  this.anims.generateFrameNames(Player.TEXTURE_PREFIX[i]+'_atlas', { 
                    prefix: 'miao_run', 
                    start: 1, 
                    end: 6, 
                    suffix: '',
                    zeroPad: 3,
                }),
                frameRate: 17,
                repeat: -1
            });

            a.hop = this.anims.create({
                key: Player.TEXTURE_PREFIX[i]+'_hop',
                defaultTextureKey: Player.TEXTURE_PREFIX[i]+'_atlas',
                frames:  this.anims.generateFrameNames(Player.TEXTURE_PREFIX[i]+'_atlas', { 
                    prefix: 'miao_jump', 
                    start: 1, 
                    end: 3, 
                    suffix: '',
                    zeroPad: 3,
                }),
                frameRate: 12,
            });

            a.fall = this.anims.create({
                key: Player.TEXTURE_PREFIX[i]+'_fall',
                defaultTextureKey: Player.TEXTURE_PREFIX[i]+'_atlas',
                frames:  this.anims.generateFrameNames(Player.TEXTURE_PREFIX[i]+'_atlas', { 
                    prefix: 'miao_jump', 
                    start: 3, 
                    end: 3, 
                    suffix: '',
                    zeroPad: 3,
                }),
                frameRate: 12
            });

            a.slide= this.anims.create({
                key: Player.TEXTURE_PREFIX[i]+'_slide',
                defaultTextureKey: Player.TEXTURE_PREFIX[i]+'_atlas',
                frames:  this.anims.generateFrameNames(Player.TEXTURE_PREFIX[i]+'_atlas', { 
                    prefix: 'miao_jump', 
                    start: 3, 
                    end: 5, 
                    suffix: '',
                    zeroPad: 3,
                }),
                frameRate: 12
            });

            a.idle = this.anims.create({
                key: Player.TEXTURE_PREFIX[i]+'_idle',
                defaultTextureKey: Player.TEXTURE_PREFIX[i]+'_atlas',
                frames:  this.anims.generateFrameNames(Player.TEXTURE_PREFIX[i]+'_atlas', { 
                    prefix: 'miao_idle', 
                    start: 0, 
                    end: 2, 
                    suffix: '',
                    zeroPad: 3,
                }),
                frameRate: 6,
                repeat: -1,
                yoyo: true,
            });
            this.animations.push(a);
        }
    }

    resetJumps(){
        this.jumps = 0;
        
    }

    incrementFood(){
        this.food += 1;
    }

    resetFood(){
        this.food = 0;
    }

    isRunning(){
        let a = 0;
        for (let c of Player.CONTROL_CONFIG){
            if (this.cursors[c.name].isDown || this.wasd[c.name].isDown)
                a = c.arg;
        }
        return a;
    }

    onGround(platform){
        this.platform = platform;
        this.brainJuicing = 0;
        if (!this.isGrounded) {// We have just fallen (this is called multple times so gatekeep)
           // console.log("IM BORN")
            let a = this.isBrain();
            this.anims.play( (this.isRunning() != 0) ? a+"_run" : a+"_idle");
            this.onXDown(this.isRunning());

            this.resetJumps();
        }
        
        this.isGrounded = true;
    }


    onJump(){
        if (this.jumps < Player.MAX_JUMPS){
            this.setMaxVelocity(Player.MAX_V, Player.JUMP_V);
            this.onLeavePlatform()
            
            
            this.jumps += 1;
            
            if (this.jumps == 2){
                this.brainJuicing = 1;
                this.double_jump_fx.play();
                
                this.hoverFx.setPosition(this.cx(), this.y);
                this.hoverFx.start();
                this.hoverTimer.paused = false;
            } else this.jump_fx.play();

            this.setVelocityY(-Player.JUMP_V);  
            this.anims.play(this.isBrain()+"_hop");

            this.sliding = false;
            this.onXDown(this.isRunning());
        }
    }

    onLeavePlatform(){
        this.isGrounded = false;
        if (this.platform instanceof PlatformCat){
            this.platform.rider = null;
        }
        this.setMaxVelocity(Player.MAX_V, Player.JUMP_V);
        this.platform = null;
    }

    onXUp(a){
        if (!this.gameOver && !this.levelComplete && !this.sliding){
            let d = (a < 0) ? 'right': 'left';
            let k = this.cursors[d];
            let l = this.wasd[d]; 
            if (k.isDown || l.isDown){
                this.onXDown(-a);
            } else {
                let a = this.isBrain();
                if (this.isGrounded) this.anims.play(a+"_idle");
                this.setAccelerationX(0);                
            }    
        }
    }

    onXDown(a){
        if (!this.gameOver && !this.levelComplete && !this.sliding && a != 0){
            this.setFlipX(a < 0);
            this.setAccelerationX(a);

            if (this.isGrounded) {
                this.sliding = false;
                if (this.anims.getName().slice(-4) == "idle") this.anims.play(this.isBrain()+"_run");
            }
        }


    }

    onLevelComplete(){
        this.levelComplete = true;
        this.setAcceleration(0,0);
        this.setVelocityX(0);
        //this.scene.input.keyboard.enabled = false;
       
        // let exit = this.scene.tweens.create({
        //     targets: this,
        //     alpha: 0,
        //     duration: 1000,
        //     ease: 'Cubic.easeInOut',
        //     //easeParams: [ 3.5 ],
        //     //delay: 1000,
        //     onComplete: () => {  
        //         this.scene.loadNextLevel();
        //     },
        // });
        // exit.play();
    }

    onPlatform(){ // accommodate for differ
        return (this.body.left < this.platform.body.right) && (this.body.right > this.platform.body.left)    ;
    }

    update(){
        if (this.platform instanceof PlatformCat){
            // detect fall
            if (!this.onPlatform()){
                this.onLeavePlatform();
            }
        }
        for (let set of this.controls){
            for (let c of Player.CONTROL_CONFIG){
                if (set[c.name].isDown)
                    this.onXDown(c.arg)    
            }
        }
        
        if (!this.isGrounded) {
            if (this.body.velocity.y > 0){
                this.anims.play(this.isBrain()+"_fall");
                this.setMaxVelocity(Player.MAX_V, Player.FALL_V);
            }
        } else {
            if (this.body.velocity.x == 0 && ["idle", "_run"].indexOf(this.anims.getName().slice(-4)) == -1){
                this.anims.play(this.isBrain()+"_idle");
                this.sliding = false;
            }
            if (this.sliding && !this.isRunning()){
                this.anims.play(this.isBrain()+"_slide");
            }
        }
    }

    cx(){
        return this.body.x;
    }

    cy(){
        return this.body.y;
    }

    isBrain() {
        return Player.TEXTURE_PREFIX[this.brainJuicing];
    }
}