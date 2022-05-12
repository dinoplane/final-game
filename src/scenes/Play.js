class Play extends Phaser.Scene {

    constructor(){
        super("playScene");
        this.VELOCITY = 200;

    }

    create(){
        this.levelLoader = new LevelLoader(this, level);
        this.player = null;
        
        let objects = this.levelLoader.loadLevel();

        //this.player = this.physics.add.sprite(0,0, 'player');
        this.physics.add.collider(this.player, this.levelLoader.loadGround(),
                                    (p, g) => {
                                        this.onGroundCollide(p, g);
                                    });

        //this.physics.add.collider(this.player, )

        

        
    }

    onGameOver(){
    }
    
    update(time, delta){
        // if (!cursors.right.isDown && !cursors.left.isDown){
        //     this.player.body.setVelocityX(0);            
        // }

        // // check keyboard input
        // if(cursors.left.isDown) {
        //     this.player.body.setVelocityX(-this.VELOCITY);
        // } else if(cursors.right.isDown) {
        //     this.player.body.setVelocityX(this.VELOCITY);
        // } else if(cursors.up.isDown) {
        //     this.player.body.setVelocityY(-this.VELOCITY);
        // }

        console.log(this.player.isMidair);
    }

    onGroundCollide(player, ground){
        player.resetJumps();
    }

}

