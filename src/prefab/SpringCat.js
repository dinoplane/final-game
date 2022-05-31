class SpringCat extends PlatformCat { // A cat that stretches 
    static BOUNCE_CASES = [["y", "up", "down", 1], ["x", "left", "right", 10]]

    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);

        this.body.setOffset(10, 11);
        this.setSize(this.displayWidth-30, this.displayHeight - 20, false);
        
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

                 if (this.rider != null){
                     this.rider.y = this.body.top;
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
        super.onCollide(player);
        if (player.body.touching.down && this.body.touching.up && !this.compress.isPlaying() && !this.spring.isPlaying()) {
            // player.onGround();
            // console.log(player.anims.getName());
            
            // this.rider = player;
            this.compress.play();
        } 
    }

    onOverlap(player){
        if (!this.selected && !this.spring.isPlaying()){
            player.onGround();

            player.setVelocityY(0);
            player.y -= player.y - this.y + this.displayHeight
        }
    }
    // update(){
    //     console.log(this.rider)
    // }
}