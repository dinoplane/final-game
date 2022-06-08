class CatSoul extends Phaser.Physics.Arcade.Sprite { // Used for the cat's before image
    constructor(cat){
        super(cat.scene, cat.x, cat.y, "cats_atlas", cat.name+"_owo");
        
        cat.scene.add.existing(this);
        cat.scene.physics.add.existing(this);
        this.body.allowGravity = false;
        this.setImmovable(true);

        this.name = cat.name;
        this.alpha = 0.25;
    }
}