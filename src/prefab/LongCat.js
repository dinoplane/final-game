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
                if (this.body.touching.up){

                }
            }
        })
        this.stretch.play();
    }
    onCollide(player){
        //player.isGrounded = true;
        //player.onLongCat = this;

        super.onCollide(player);
        
        //this.setAccelerationY(1000);

    }
}