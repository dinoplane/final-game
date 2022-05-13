class FallingCat extends PlatformCat { // A cat that caan be collided with
    static SELECTED_CAT = null;

    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
    }

    onCollide(player){
        super.onCollide(player);

        this.setInteractive(false);
        this.setAccelerationY(100);

    }

    update(){
    }
}