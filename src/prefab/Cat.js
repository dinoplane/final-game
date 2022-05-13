class Cat extends Phaser.Physics.Arcade.Sprite {
    static SELECTED_CAT = null;

    constructor(scene, x, y, frame, data){
        super(scene, x, y, "cats_atlas", frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.addPointerCallbacks();

        this.name = frame;
        this.selected = false;
    }

    addPointerCallbacks(){
        this.setInteractive();
        this.on('pointerdown', (pointer) => {
            this.onLeftClicked();
        });
    }

    onCollide(player){

    }

    onOverlap(player){

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