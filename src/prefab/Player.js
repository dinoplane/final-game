class Player extends Phaser.Physics.Arcade.Sprite {
    static ACCEL = 3000;
    static JUMP_V = 500;
    static MAX_V = 300;
    static DRAG = 1000;
    static MAX_JUMPS = 2;

    static CONTROL_CONFIG = [{name: 'left', arg: -Player.ACCEL - 500, },
                             {name: 'right', arg: +Player.ACCEL}]

    constructor(scene, x, y){
        super(scene, x, y, "player");
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.gameOver = false;
        this.levelComplete = false;
        this.food = 0;
        this.jumps = 0;

        this.scene.input.keyboard.enabled = true;

        this.cursors = this.scene.input.keyboard.addKeys({ 
            'left': Phaser.Input.Keyboard.KeyCodes.A, 
            'right': Phaser.Input.Keyboard.KeyCodes.D, 
            up: Phaser.Input.Keyboard.KeyCodes.W, 
        });

        this.cursors.up.on('down', key =>{
            if (this.jumps < Player.MAX_JUMPS){
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
                    console.log(key)
                    this.onXUp(c.arg);
                });
//                d.push(tmpKey);   
        }

        this.setMaxVelocity(Player.MAX_V, Player.JUMP_V);
        this.setDragX(Player.DRAG);
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;   
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

    update(){
        console.log(this.isMidair)
    }

    onXUp(a){
        if (!this.gameOver && !this.levelComplete){
            let d = (a < 0) ? 'right': 'left';
            let k = this.cursors[d];
            //for (let k of this.controls[d]){
                if (!k.isDown){
                    this.setAcceleration(0, 0);
                } else {
                    this.setAcceleration(-a, 0);
            //        break;
                }
            //}          
        }
    }

    onXDown(a){
        if (!this.gameOver && !this.levelComplete){
            this.setAcceleration(a, 0);
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
            duration: 2000,
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