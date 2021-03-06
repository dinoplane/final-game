class Food extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.allowGravity = false;
        this.setImmovable(true);

        this.pickup = scene.sound.add('pickup_food');
    }

    onCollide(player){  // Player collects
        if (this.visible){
            this.visible = false;
            this.body.checkCollision.none = true;
            player.incrementFood(); 
            this.pickup.play();
            this.scene.events.emit('food_pickup');
        }
    }

    reset(){
        this.visible = true;
    }

    
}