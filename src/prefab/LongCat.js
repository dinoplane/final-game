class LongCat extends PlatformCat { // A cat that stretches 
    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);
        console.log(data);
        this.scaleY = data["init_scale"]; // initial scale

        this.stretch = this.scene.tweens.create({
            targets: this,
            scaleY: data["end_scale"], // target scale
            duration:2000,
            repeat: -1,
            yoyo: true,
            ease: 'Cubic.easeInOut',
        })
        this.stretch.play();
    }

    // onCollide(player){
    //     super.onCollide(player);

    //     this.setInteractive(false);
    //     this.setAccelerationY(100);

    // }
}