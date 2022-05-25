class Player extends Phaser.Physics.Arcade.Sprite {
    static ACCEL = 3000;
    static JUMP_V = 500;
    static FALL_V = 1000;
    static MAX_V = 400;
    static DRAG = 1000;
    static MAX_JUMPS = 2;

    static CONTROL_CONFIG = [{name: 'left', arg: -Player.ACCEL, },
                             {name: 'right', arg: +Player.ACCEL}]

    constructor(scene, x, y){
        super(scene, x, y, "miao_atlas", "miao_idle000");
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setUpAnimations();

        this.gameOver = false;
        this.levelComplete = false;
        this.food = 0;
        this.jumps = 0;
        this.platform = null;
        this.isGrounded = false;
        this.peakHeight = 0;
        this.sliding = false;

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

        let controls = [this.cursors, this.wasd]

        for (let set of controls){

            set.up.on('down', key =>{
                this.onJump();
            });

            for (let c of Player.CONTROL_CONFIG){
                    set[c.name].on( 'down', (key) => {
                        this.onXDown(c.arg)
                    });
                    set[c.name].on('up', (key) => {
                        this.onXUp(c.arg);
                    });
            }
        }

        this.setMaxVelocity(Player.MAX_V, Player.JUMP_V);
        this.setDragX(Player.DRAG);
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;   
        this.setBounce(0,0)
        this.anims.play("miao_idle");
    }
    
    setUpAnimations(){
        this.run = this.anims.create({
            key: 'miao_run',
            defaultTextureKey: 'miao_atlas',
            frames:  this.anims.generateFrameNames('miao_atlas', { 
                prefix: 'miao_run', 
                start: 1, 
                end: 6, 
                suffix: '',
                zeroPad: 3,
            }),
            frameRate: 17,
            repeat: -1
        });

        this.hop = this.anims.create({
            key: 'miao_hop',
            defaultTextureKey: 'miao_atlas',
            frames:  this.anims.generateFrameNames('miao_atlas', { 
                prefix: 'miao_jump', 
                start: 1, 
                end: 3, 
                suffix: '',
                zeroPad: 3,
            }),
            frameRate: 12,
        });

        this.fall = this.anims.create({
            key: 'miao_fall',
            defaultTextureKey: 'miao_atlas',
            frames:  this.anims.generateFrameNames('miao_atlas', { 
                prefix: 'miao_jump', 
                start: 3, 
                end: 3, 
                suffix: '',
                zeroPad: 3,
            }),
            frameRate: 12
        });

        this.slide= this.anims.create({
            key: 'miao_slide',
            defaultTextureKey: 'miao_atlas',
            frames:  this.anims.generateFrameNames('miao_atlas', { 
                prefix: 'miao_jump', 
                start: 3, 
                end: 5, 
                suffix: '',
                zeroPad: 3,
            }),
            frameRate: 12
        });

        this.idle = this.anims.create({
            key: 'miao_idle',
            defaultTextureKey: 'miao_atlas',
            frames:  this.anims.generateFrameNames('miao_atlas', { 
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
        //console.log(platform)
        this.platform = platform;
        if (!this.isGrounded) {// We have just fallen (this is called multple times so gatekeep)
            console.log("came" , this.isRunning())
            //
            this.anims.play( (this.isRunning() != 0) ? "miao_run" : "miao_idle");
            this.onXDown(this.isRunning());

            this.resetJumps();
        }
        this.isGrounded = true;

        
    }


    onJump(){
        if (this.jumps < Player.MAX_JUMPS){
            this.setMaxVelocity(Player.MAX_V, Player.JUMP_V);
            this.onLeavePlatform()
            //this.body.bounce.y = 0;
            this.anims.play("miao_hop");
            this.setVelocityY(-Player.JUMP_V);  
            this.jumps += 1;
            this.sliding = false;
            this.onXDown(this.isRunning());
        }
    }

    onLeavePlatform(){
        this.isGrounded = false;
        this.platform = null;

    }

    onXUp(a){
       //console.log("stopping %d", a);
        if (!this.gameOver && !this.levelComplete && !this.sliding){
            let d = (a < 0) ? 'right': 'left';
            let k = this.cursors[d];
            let l = this.wasd[d]; // fix this logic
            if (k.isDown || l.isDown){
                this.onXDown(-a);
            } else {
                if (this.isGrounded) this.anims.play("miao_idle");
                this.setAccelerationX(0);                
            }    
        }
    }

    onXDown(a){
       //console.log("moving %d", a);
        if (!this.gameOver && !this.levelComplete && !this.sliding && a != 0){
            this.setFlipX(a < 0);
            this.setAccelerationX(a);

            if (this.isGrounded) {
               //console.log("running")
                this.sliding = false;
                this.anims.play("miao_run");
            }
        }


    }

    onLevelComplete(){
        this.levelComplete = true;
        this.setAcceleration(0,0);
        this.setVelocityX(0);
        this.scene.input.keyboard.enabled = false;
       
        let exit = this.scene.tweens.create({
            targets: this,
            alpha: 0,
            duration: 1000,
            ease: 'Cubic.easeInOut',
            //easeParams: [ 3.5 ],
            //delay: 1000,
            onComplete: () => {  
                this.scene.loadNextLevel();
            },
        });
        exit.play();
    }

    update(){
        console.log(this.sliding)
        if (this.platform instanceof PlatformCat){
            // detect fall
            if (this.x > this.platform.x + this.platform.displayWidth || this.x + this.displayWidth < this.platform.x){
                this.onLeavePlatform();
                console.log("called")
            }
        }
        
        

        if (!this.isGrounded) {
            if (this.body.velocity.y > 0){
                this.anims.play("miao_fall");
                this.setMaxVelocity(Player.MAX_V, Player.FALL_V);
               //console.log("YO")
            }
        } else {
            if (this.body.velocity.x == 0 && ["miao_idle", "miao_run"].indexOf(this.anims.getName()) == -1){
                this.anims.play("miao_idle");
                this.sliding = false;
                this.onXDown(this.isRunning());
                //this.setMaxVelocity(Player.MAX_V, Player.FALL_V);
            }
            if (this.sliding && !this.isRunning()){
                this.anims.play("miao_slide");
            }
        }
    }

}