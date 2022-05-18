class CatSoul extends Phaser.GameObjects.Sprite {
    constructor(cat){
        super(cat.scene, cat.x, cat.y, "cats_atlas", cat.name+"_owo");
        
        cat.scene.add.existing(this);


        this.name = cat.name;
        //this.body.allowGravity = false;
        this.scene.input.setDraggable(this.setInteractive());
        this.alpha = 0.25;


    }
}