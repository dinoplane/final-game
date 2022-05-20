class Player extends Phaser.Physics.Arcade.Sprite {
    static ACCEL = 3000;
    static JUMP_V = 500;
    static MAX_V = 300;
    static DRAG = 1000;
    static MAX_JUMPS = 2;

    static CONTROL_CONFIG = [{name: 'left', arg: -Player.ACCEL - 500, },
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
        this.isGrounded = false;
        this.falling = false;

        this.scene.input.keyboard.enabled = true;

        this.cursors = this.scene.input.keyboard.addKeys({ 
            'left': Phaser.Input.Keyboard.KeyCodes.A, 
            'right': Phaser.Input.Keyboard.KeyCodes.D, 
            up: Phaser.Input.Keyboard.KeyCodes.W, 
        });

        this.cursors.up.on('down', key =>{
            if (this.jumps < Player.MAX_JUMPS){
                this.isGrounded = false;
                this.anims.play("miao_hop");
                //this.falling = false;
                this.setVelocityY(-Player.JUMP_V);  
                this.jumps += 1;
            }
        });

        for (let c of Player.CONTROL_CONFIG){
            // let d = [];
            // for (let kc of c.keycodes){
            //     let tmpKey = this.scene.input.keyboard.addKey(kc);
            //     //console.log("key", kc, c.keycodes)
                this.cursors[c.name].on( 'down', (key) => {
                    this.onXDown(c.arg)
                });
                this.cursors[c.name].on('up', (key) => {
                    this.onXUp(c.arg);
                });
//                d.push(tmpKey);   
        }

        this.setMaxVelocity(Player.MAX_V, Player.JUMP_V);
        this.setDragX(Player.DRAG);
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;   
        this.anims.play("miao_idle");
    }
    
    setUpAnimations(){
        this.run = this.anims.create({
            key: 'miao_run',
            defaultTextureKey: 'miao_atlas',
            frames:  this.anims.generateFrameNames('miao_atlas', { 
                prefix: 'miao_run', 
                start: 0, 
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

        this.land = this.anims.create({
            key: 'miao_land',
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
            frameRate: 12,
            repeat: -1,
            yoyo: true,
            //repeatDelay: 500
        });
    }

    resetJumps(){
        this.jumps = 0;
        console.log();
    }

    incrementFood(){
        this.food += 1;
    }

    resetFood(){
        this.food = 0;
    }

    isMidAir(){
        return !this.body.embedded;
    }

    onGround(){

        if (!this.isGrounded) {// We have just fallen (this is called multple times so gatekeep)
                //let anim =  ;
//                console.log("We went here %s", anim)
            let keyDown = false;
            for (let c of Player.CONTROL_CONFIG){
                keyDown |= (this.cursors[c.name].isDown)
            }
            this.anims.play( (keyDown) ? "miao_run" : "miao_idle");
            
        }
        this.isGrounded = true;

        this.resetJumps();
        //this.falling = false;
    }

    update(){
       // console.log("Not Embedded: %s, TouchingNone: %s, notGrounded: %s, Falling: %s", 
         //       !this.body.embedded, this.body.touching.none, !this.isGrounded, this.falling);
        //console.log(this.body.touching)
        if ((!this.isGrounded) && this.body.velocity.y > 0){
            //this.falling = true;
            this.anims.play("miao_fall");
        }

        if (this.isGrounded && this.body.velocity.y > 0){
            this.isGrounded = false;
        }

        // 
        //     if (!this.body.touching.down){
        //         console.log("FAAAAALLLING: %s", this.isMidAir())
        //         this.isGrounded = false;
        //     }
    }

    onXUp(a){
        if (!this.gameOver && !this.levelComplete){
            let d = (a < 0) ? 'right': 'left';
            let k = this.cursors[d];
            //for (let k of this.controls[d]){
                if (!k.isDown){
                    console.log("ended here")
                    if (this.isGrounded) this.anims.play("miao_idle");
                    this.setAcceleration(0, 0);
                } else {
                    this.setFlipX(-a < 0);
                    this.setAcceleration(-a, 0);
            //        break;
                }
            //}          
        }
    }

    onXDown(a){
        if (!this.gameOver && !this.levelComplete){
            this.setFlipX(a < 0);
            this.setAcceleration(a, 0);
        }
        console.log("I'm here");
        if (this.isGrounded) this.anims.play("miao_run")
        else console.log("HELLO");
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
}