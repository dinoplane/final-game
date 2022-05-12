class Food extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture){
        super(scene, x, y, 'food');


    }

    onCollide(player){
        this.visible = false;
        
    }
}