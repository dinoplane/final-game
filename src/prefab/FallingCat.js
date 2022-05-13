class FallingCat extends PlatformCat { // A cat that caan be collided with
    static SELECTED_CAT = null;

    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        
        this.body.allowGravity = false;
        this.setImmovable(true);
        

    }




    onCollide(player){
        super.onCollide(player);
        this.body.allowGravity = true;

    }





    update(){
    }
}