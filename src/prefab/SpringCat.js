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
                this.player = null;
        
            }
            //easeParams: [ 3.5 ],
            //delay: 1000,
        });

        this.compress = this.scene.tweens.create({
            targets: this,
            scaleY:0.5,
            duration: 1000,
            ease: 'Sine.easeInOut',
            //easeParams: [ 3.5 ],
            //delay: 1000,
            onComplete: () => {
                this.spring.play();
                if (this.player.body.touching.down && this.body.touching.up && !this.compress.isPlaying() && !this.spring.isPlaying()){
                    this.player.setVelocityY(-Player.SPRING_V);
                    this.player.isGrounded = false;
                    this.player.play("miao_hop");
                }
            }
        });


    }

    onCollide(player){

        if (player.body.touching.down && this.body.touching.up && !this.compress.isPlaying() && !this.spring.isPlaying()) {
            super.onCollide(player);
            this.player = player;
            this.compress.play();
        }
        player.anims.play("miao_hop");   
    }
}