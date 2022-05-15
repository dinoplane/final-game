class Food extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, 'food');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.allowGravity = false;
        this.setImmovable(true);
    }

    onCollide(player){
        if (this.visible){
            this.visible = false;
            this.body.checkCollision.none = true;
            player.incrementFood();    
        }
    }

    reset(){
        this.visible = true;
    }

    
}