class LongCat extends PlatformCat { // A cat that stretches 
    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);
        this.scaleY = data["init_scale"]; // initial scale
        this.stretch = this.scene.tweens.create({
            targets: this,
            scaleY: data["end_scale"], // target scale
            duration:2000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                 if (this.rider != null){
                     this.rider.y = this.y - this.displayHeight;
                 }
            }
        })
        this.stretch.play();

        this.rider = null;
    }
    onCollide(player){
        //player.isGrounded = true;
        //player.onLongCat = this;
        super.onCollide(player);
        if (player.body.touching.down && this.body.touching.up && !player.isGrounded){
            
            //player.body.maxVelocity.y = PlatformCat.STICK_VELOCITY;
            //player.setVelocityY(PlatformCat.STICK_VELOCITY)
            this.rider = player;
        }        
        //this.setAccelerationY(1000);

    }
    // onOverlap() {};
}