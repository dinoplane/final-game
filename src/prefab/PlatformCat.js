class PlatformCat extends Cat { // A cat that can be collided with.
    static SELECTED_CAT = null;
    static STICK_VELOCITY = 3000;

    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);
        this.body.allowGravity = false;
        this.setImmovable(true);
        this.pvf = {x: 0, y:0};
        
        this.body.setOffset(25, 12);
        this.setSize(this.displayWidth-30, this.displayHeight - 25, false);
    }

    onCollide(player){
        if (player.body.touching.down && this.body.touching.up){
            player.onGround(this);
            this.rider = player;
        }

    }

    onBeforeCollide(player){
        if (!player.isGrounded)
            this.pvf.y = player.body.velocity.y;
        
        this.pvf.x = player.body.velocity.x;
    }


    onOverlap(player){
        if (!this.selected){
            //player.onGround();
        //if (player.y + player.height < this.y){
            player.setVelocityY(0);
            player.y = this.body.top;
        //}
        }
    }
}