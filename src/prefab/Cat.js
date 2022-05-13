class Cat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, frame){
        super(scene, x, y, "cats_atlas", frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.name = frame;
        this.selected = false;
        this.body.allowGravity = false;
        this.setImmovable(true);
    }

    onCollide(player){

    }

    onOverlap(player){
        
    }

    onClicked(pointer){

    }

    onSelected(pointer){

    }

    onDeselected(pointer){

    }

    update(){

    }
}