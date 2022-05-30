class LongCat extends PlatformCat { // A cat that stretches 
    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);

        this.body.setOffset(10, 11);
        this.setSize(this.displayWidth-30, this.displayHeight - 20, false);

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
                     this.rider.y = this.body.top;
                 }
            }
        })
        this.stretch.play();
    }
    // onCollide(player){
    //     //player.isGrounded = true;
    //     //player.onLongCat = this;
    //     super.onCollide(player);
    //     //console.log(player.anims.getName())

    // }
    // onOverlap() {};
}