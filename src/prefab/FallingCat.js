class FallingCat extends PlatformCat { // A cat that falls
    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture, data);
    }

    onCollide(player){
        super.onCollide(player);

        this.setInteractive(false);
        this.selected = false;
        this.selectsLeft = 0;
        this.checkSleep();
        this.setAccelerationY(100);

    }
}