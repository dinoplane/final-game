class FallingCat extends PlatformCat { // A cat that falls
    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);
    }

    onCollide(player){  // I fall when you touch me
        super.onCollide(player);

        this.setInteractive(false);
        this.selected = false;
        this.selectsLeft = 0;
        this.checkSleep();
        this.setAccelerationY(100);
        this.body.checkCollision.down = false; // Elegance
    }

    onOverlap(player){  // If somehow you get into me
        if (!this.selected && this.body.checkCollision.down){
            player.y = this.body.y;
        }
    }
}