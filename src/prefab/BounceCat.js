class BounceCat extends PlatformCat { // A cat that stretches 
    static BOUNCE_CASES = [["y", "up", "down"], ["x", "left", "right"]]

    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);
    }

    onCollide(player){
        super.onCollide(player);
        for (let c of BounceCat.BOUNCE_CASES){
            if (player.body.touching[c[1]] && this.body.touching[c[2]]) 
                player.body.velocity[c[0]] = +this.pvf[c[0]];
            if (player.body.touching[c[2]] && this.body.touching[c[1]]) 
                player.body.velocity[c[0]] = -this.pvf[c[0]];
        }        
        player.anims.play("miao_hop")
    }
}