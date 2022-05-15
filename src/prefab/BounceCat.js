class BounceCat extends PlatformCat { // A cat that stretches 
    constructor(scene, x, y, texture, data){
        super(scene, x, y, texture);
        console.log();
    }

    onCollide(player){
        super.onCollide(player);

        this.setInteractive(false);
        player.setBounce(100);
    }
}