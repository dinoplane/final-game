class PlatformCat extends Cat { // A cat that can be collided with.
    static SELECTED_CAT = null;

    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture);
        this.body.allowGravity = false;
        this.setImmovable(true);
    }

    onCollide(player){
        player.resetJumps();
    }

    onOverlap(player){
        //if (player.y + player.height < this.y){
            player.setVelocityY(0);
            player.y -= player.y - this.y + this.height
        //}
    }
}