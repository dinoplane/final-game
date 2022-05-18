class Cat extends Phaser.Physics.Arcade.Sprite {
    static P2C_COLLIDER = null;
    static P2C_OVERLAP = null;
    static C2C_OVERLAP = null;
    

    constructor(scene, x, y, frame, data){
        super(scene, x, y, "cats_atlas", frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.addPointerCallbacks();
        this.debugtext = scene.add.text(x, y, "YOUR MOTHER");

        this.name = frame;
        this.selected = false;
        this.selectsLeft = 1;
        this.catSoul = null;
        this.my_friend = null;
    }

//Cat
// when clicked create a cat soul

// cat soul follows pointer as we drag

// when the drag ends check  if the cat soul is in a valid position

// If so move and decrement selects
// If not move back and act like that never happened.


    addPointerCallbacks(){
        this.setInteractive();
        // this.on('pointerdown', (pointer) => {
        //     console.log(pointer.x, pointer.y);
        //     this.onDragStart();
        // });
        this.scene.input.setDraggable(this.setInteractive());

        this.on('dragstart', (pointer, dragX, dragY) => {
            console.log("HELLO!");
            
            this.onDragStart()
        });

        this.on('drag', (pointer, dragX, dragY) => {
            this.whileDrag(dragX, dragY);
        });

        this.on('dragend', (pointer, dragX, dragY) => {
            console.log("END");
            this.onDragEnd();
            
        });
    }

    onCollide(player){

    }

    onOverlap(player){

    }

    onCatOverlap(that){ // No pun intended no pun intended
        this.my_friend = that;  // Cats are friendly to each other
        that.setTexture("cats_atlas", that.name+"_x3");
        this.setTexture("cats_atlas", this.name+"_x3");
    }

    isTouching(){
        return this.body.embedded || !this.body.touching.none ;
    }

    isSelectable(){
        return this.selectsLeft > 0;
    }

    onDragStart(){
        if (this.isSelectable() && !this.isTouching() && !this.selected){
            let i = Cat.P2C_COLLIDER.object2.indexOf(this);
            let j = Cat.P2C_OVERLAP.object2.indexOf(this);
                        

            Cat.P2C_COLLIDER.object2.splice(i,1);
            Cat.P2C_OVERLAP.object2.splice(j,1);
            
            //Cat.P2C_OVERLAP.object2.remove(this);

            
            this.catSoul = new CatSoul(this).setOrigin(0,1);
            this.setTexture("cats_atlas", this.name+"_owo");
            this.selected = true;
            this.setScale(1.2);
            this.setDepth(4);

        }
    }

    whileDrag(dragX, dragY){
        if (this.selected){   
            if (this.body.wasTouching && !this.isTouching()){
                this.setTexture("cats_atlas", this.name+"_owo");
                let friend_state = (this.my_friend.isSelectable()) ? "" : "_uwu";
                this.my_friend.setTexture("cat_atlas", this.my_friend.name + friend_state);
            }
            this.debugtext.text = (this.body.embedded || !this.body.touching.none) ? "touching" : "alone"  ;
            this.x = dragX;
            this.y = dragY;
        }
    }

    onDragEnd(){
        if (this.selected){  
            if (this.isTouching()){
                this.setPosition(this.catSoul.x, this.catSoul.y);
                this.setTexture("cats_atlas", this.name);
            }
            else {
                this.decrementSelect();
            }
            Cat.P2C_COLLIDER.object2.push(this);
            Cat.P2C_OVERLAP.object2.push(this);
            this.catSoul.destroy();
            this.selected = false;
            this.setScale(1);
            this.setDepth(0);

        }
    }

    decrementSelect(){
        this.selectsLeft -= 1;
        if (!this.isSelectable) this.setTexture("cat_atlas", this.my_friend.name + "_uwu");
        else this.setTexture("cats_atlas", this.name);
    }

    update(){

    }
}