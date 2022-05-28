class FallingCat extends PlatformCat { // A cat that falls
    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);
        this.setSize(this.displayWidth-50, this.displayHeight - 60);
    }

    onCollide(player){
        super.onCollide(player);

        this.setInteractive(false);
        this.selected = false;
        this.selectsLeft = 0;
        this.checkSleep();
        this.setAccelerationY(100);
    }

    onOverlap(player){
        if (!this.selected){
            console.log(player.y, this.body.y, this.y - this.displayHeight);
        //if (player.y + player.height < this.y){
            //player.setVelocityY(0);
            player.y = this.body.y;
        //}
        }
    }
}