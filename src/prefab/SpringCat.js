class SpringCat extends PlatformCat { // A cat that stretches 
    static BOUNCE_CASES = [["y", "up", "down", 1], ["x", "left", "right", 10]]

    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);

        this.body.setOffset(10, 11);
        this.setSize(this.displayWidth-30, this.displayHeight - 20, false);
        this.spring = this.scene.tweens.create({
            targets: this,
            scaleY:1,
            duration: 150,
            ease: 'Bounce.easeInOut',
            onUpdate: () => {

                if (this.rider != null && this.rider.body.touching.down && this.body.touching.up && this.body.top < this.scene.levelLoader.getMapHeight() -65){
                    this.rider.y = this.body.top;
                }
                
                if (this.over && Cat.THOUGHTS.active){
                    Cat.THOUGHTS.x = this.body.right + Cat.THOUGHTS.getAt(0).displayWidth/2;
                    Cat.THOUGHTS.y = this.body.top;
                 }
           },

        });

        this.compress = this.scene.tweens.create({
            targets: this,
            scaleY:0.3,
            duration: 1000,
            ease: 'Sine.easeInOut',
            //easeParams: [ 3.5 ],
            //delay: 1000,
            onUpdate: () => {

                 if (this.rider != null && this.body.top < this.scene.levelLoader.getMapHeight() -65){
                     this.rider.y = this.body.top;
                 }

                 if (this.over && Cat.THOUGHTS.active){
                    Cat.THOUGHTS.x = this.body.right;
                    Cat.THOUGHTS.y = this.body.top;
                 }
            },
            onComplete: () => {
                
                if (this.rider != null && !this.compress.isPlaying() && !this.spring.isPlaying() &&  this.body.top < this.scene.levelLoader.getMapHeight() -65){
                    this.setMaxVelocity(Player.MAX_V, Player.SPRING_V);
                    this.rider.setVelocityY(-Player.SPRING_V);
                    this.rider.isGrounded = false;
                    this.rider.play(this.rider.isBrain()+"_hop");
                }
                this.spring.play();
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
        if (!this.spring.isPlaying()){
            super.onOverlap(player);
        }
    }
    // update(){
    //     console.log(this.rider)
    // }
}