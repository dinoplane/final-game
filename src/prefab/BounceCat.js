class BounceCat extends PlatformCat { // A cat that stretches 
    static BOUNCE_CASES = [["y", "up", "down", 1], ["x", "left", "right", 10]]

    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);
        
        this.body.setOffset(30, 85);
        this.setSize(this.displayWidth-30, this.displayHeight - 105, false);

        this.bounceSfx = scene.sound.add('bounce', {volume: 3});
    }

    onCollide(player){
        super.onCollide(player); // set a bouncing thing.
        this.bounceSfx.play();
        player.jumps = 1; // Player leaving counts as a jump!
        for (let c of BounceCat.BOUNCE_CASES){ // Boing!
            if ((player.body.touching[c[1]] && this.body.touching[c[2]]) || 
               (player.body.touching[c[2]] && this.body.touching[c[1]])) {
                player.body.velocity[c[0]] = -this.pvf[c[0]] * c[3];

                if (c[0] == "x"){ // If hit from sides
                    this.setOrigin(0.5, 1);
                    this.x += this.width/2;
                    player.sliding = player.isGrounded;
                    this.scene.tweens.create({  // Boing
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
                } else {    // Hit from top!
                    this.scene.tweens.create({ // bounce
                        targets: this,
                        scaleY:0.9,
                        duration: 100,
                        ease: 'Cubic.easeInOut',
                        //easeParams: [ 3.5 ],
                        //delay: 1000,
                        yoyo: true,
                    }).play();
                    player.isGrounded = false;
                }
                break;
                
                
            }        
        }        
        player.anims.play(player.isBrain()+"_hop"); // Make her hop!
    }
}