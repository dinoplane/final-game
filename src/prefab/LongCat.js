class LongCat extends PlatformCat { // A cat that stretches 
    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);

        this.body.setOffset(10, 11);
        this.setSize(this.displayWidth-30, this.displayHeight - 20, false);

        this.scaleY = data["init_scale"]; // initial scale
        this.stretch = this.scene.tweens.create({ // Stretching is repeated with hold
            targets: this,
            scaleY: data["end_scale"], // target scale
            duration:2000,
            hold: 500,
            repeatDelay: 500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut',
            
            onUpdate: () => { // Player stay on the cat!
                 if (this.rider != null && this.body.top < this.scene.levelLoader.getMapHeight() -65){
                     this.rider.y = this.body.top;
                 }
                 if (this.over && Cat.THOUGHTS.active){
                    Cat.THOUGHTS.x = this.body.right + Cat.THOUGHTS.getAt(0).displayWidth/2;
                    Cat.THOUGHTS.y = this.body.top;
                 }
            }
        })
        this.stretch.play();
    }
}