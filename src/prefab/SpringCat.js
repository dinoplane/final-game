class SpringCat extends PlatformCat { // A cat that stretches 
    static BOUNCE_CASES = [["y", "up", "down", 1], ["x", "left", "right", 10]]

    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);


        this.spring = this.scene.tweens.create({
            targets: this,
            scaleY:1,
            duration: 100,
            ease: 'Bounce.easeInOut',
            onComplete: () => {
                this.rider = null;
            }
        });

        this.compress = this.scene.tweens.create({
            targets: this,
            scaleY:0.5,
            duration: 1000,
            ease: 'Sine.easeInOut',
            //easeParams: [ 3.5 ],
            //delay: 1000,
            onUpdate: () => {
                let d = (1*0.64 + 0.36*[0.92*1 + 0.08*(0.05*(9+1)+ 0.95*(107+9+1))])
                console.log(0.92*d + 0.08*(0.05*(9+d)+0.95*(107 + 9 + d)))
                 if (this.rider != null){
                     this.rider.y = this.y - this.displayHeight;
                 }
            },
            onComplete: () => {
                this.spring.play();
                if (this.rider != null && !this.compress.isPlaying() && !this.spring.isPlaying()){
                    this.rider.setVelocityY(-Player.SPRING_V);
                    this.rider.isGrounded = false;
                    this.rider.play(this.rider.isBrain()+"_hop");
                }
            }
        });


    }

    onCollide(player){

        if (player.body.touching.down && this.body.touching.up && !this.compress.isPlaying() && !this.spring.isPlaying()) {
            super.onCollide(player);
            this.rider = player;
            this.compress.play();
        } 
    }

    onOverlap(player){
        if (!this.selected && !this.spring.isPlaying()){
            player.setVelocityY(0);
            player.y -= player.y - this.y + this.displayHeight
        }
    }
}