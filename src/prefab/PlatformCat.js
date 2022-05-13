class PlatformCat extends Cat { // A cat that caan be collided with
    static SELECTED_CAT = null;

    constructor(scene, x, y, texture){
        super(scene, x, y, "luna");
        
        this.addPointerCallbacks();

    }

    addPointerCallbacks(){
        this.setInteractive();
        this.on('pointerdown', (pointer) => {
            this.onLeftClicked();
        });
    }


    onCollide(player){
        player.resetJumps();
    }

    onLeftClicked(){
        console.log (this.selected)
        if (!this.selected && Cat.SELECTED_CAT == null){
            this.onSelected();
        } else if (this.selected && Cat.SELECTED_CAT != null){
            this.onDeselected()
        };
    }

    onRightClicked(){

    }

    onSelected(){
        this.selected = true;
        Cat.SELECTED_CAT = this;
        this.setTexture("cats_atlas", this.name+"_owo");
        // Create a sprite after image. add a collider that switches its animations. 

    }

    onDeselected(){
        Cat.SELECTED_CAT = null;
        this.setTexture("cats_atlas", this.name);
        this.selected = false;
    }



    update(){
    }
}