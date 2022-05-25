class BounceCat extends PlatformCat { // A cat that stretches 
    static BOUNCE_CASES = [["y", "up", "down", 1], ["x", "left", "right", 10]]

    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);
    }

    onCollide(player){
        //super.onCollide(player); // set a bouncing thing.
        for (let c of BounceCat.BOUNCE_CASES){
            if ((player.body.touching[c[1]] && this.body.touching[c[2]]) || 
               (player.body.touching[c[2]] && this.body.touching[c[1]])) {
                player.body.velocity[c[0]] = -this.pvf[c[0]] * c[3];
                if (c[0] == "x"){
                    this.setOrigin(0.5, 1);
                    this.x += this.width/2;
                    player.sliding = player.isGrounded;
                    this.scene.tweens.create({
                        targets: this,
                        scaleX : 0.8,
                        duration: 100,
                        ease: 'Elastic.easeOut',
                        //easeParams: [ 3.5 ],
                        //delay: 1000,
                        yoyo: true,
                        onComplete: () => {
                            this.setOrigin(0, 1);
                            this.x -= this.width/2;
                        }
                    }).play();
                    if (player.sliding) player.setAccelerationX(0);
                } else {
                    this.scene.tweens.create({
                        targets: this,
                        scaleY:0.9,
                        duration: 100,
                        ease: 'Cubic.easeInOut',
                        //easeParams: [ 3.5 ],
                        //delay: 1000,
                        yoyo: true,
                    }).play();
                }
                break;
                
                
            }        
        }        
        player.anims.play("miao_hop");
    }
}