class PlatformCat extends Cat { // A cat that can be collided with.
    static SELECTED_CAT = null;

    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);
        this.body.allowGravity = false;
        this.setImmovable(true);
        this.pvf = {x: 0, y:0};
    }

    onCollide(player){
        //console.log(this.pvf)
        if (player.body.touching.down && this.body.touching.up) 
            player.onGround(this);
    }

    onBeforeCollide(player){
        //console.log(this.body.touching)
        if (!player.isGrounded){
            //player.anims.play("miao_land")
            //console.log(player.body.velocity.y);
            this.pvf.y = player.body.velocity.y;
        }
        // if (player.body.touching.right && this.body.touching.left ||
        //     player.body.touching.left && this.body.touching.right)
        this.pvf.x = player.body.velocity.x;
    }


    onOverlap(player){
        //if (player.y + player.height < this.y){
            player.setVelocityY(0);
            player.y -= player.y - this.y + this.displayHeight
        //}
    }
}