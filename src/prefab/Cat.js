class Cat extends Phaser.Physics.Arcade.Sprite {
    static P2C_COLLIDER = null;
    static P2C_OVERLAP = null;
    static C2C_OVERLAP = null;

    static SELECTED_CAT = null;
    static OFFSET_FACTOR = 0.1;
    // MOMMY MOMMY MOMMY MOMMY

    constructor(scene, x, y, frame, data){
        super(scene, x, y, "cats_atlas", frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        //this.setCollideWorldBounds(true);
        this.addPointerCallbacks();

        this.name = frame;
        this.selected = false;
        this.canceled = false; // O nwo me no use twitta

        if (data["movesLeft"])
            this.selectsLeft = data["movesLeft"];
        else this.selectsLeft = 1;
        this.checkSleep();

        this.catSoul = null;
        this.my_friend = null;
    }

    addPointerCallbacks(){
        this.scene.input.setDraggable(this.setInteractive());

        this.dstart = this.on('dragstart', (pointer, dragX, dragY) => {
            this.onDragStart()
        });

        this.dwhile = this.on('drag', (pointer, dragX, dragY) => {
            this.whileDrag(dragX, dragY);
        });

        this.dend = this.on('dragend', (pointer, dragX, dragY) => {
            this.onDragEnd(pointer);  
        });
    }

    onCollide(player){

    }

    onBeforeCollide(player){

    }

    onOverlap(player){

    }

    onCatOverlap(that){ // X3 sowwy me touchy
        this.my_friend = that;  // Cats are friendly to each other
        that.setTexture("cats_atlas", that.name+"_x3");
        this.setTexture("cats_atlas", this.name+"_x3");
    }

    isTouching(){       // Am i touchy?
        return this.body.embedded || !this.body.touching.none ;
    }

    isSelectable(){     // Am i tired?
        return this.selectsLeft > 0;
    }

    onDragStart(){  // OwO you grab me!
        if (this.isSelectable() && !this.isTouching() && !this.selected){
            let i = Cat.P2C_COLLIDER.object2.indexOf(this);
            let j = Cat.P2C_OVERLAP.object2.indexOf(this);
                        
            Cat.P2C_COLLIDER.object2.splice(i,1);
            Cat.P2C_OVERLAP.object2.splice(j,1);
            
            Cat.SELECTED_CAT = this;

            this.catSoul = new CatSoul(this).setOrigin(0,1);
            this.setTexture("cats_atlas", this.name+"_owo");
            this.selected = true;
            this.setScale(1.01);
            this.setDepth(4);
        }
    }

    whileDrag(dragX, dragY){    // OwO AAAAAAAA
        if (this.selected && !this.canceled){   
            if (this.body.wasTouching && !this.isTouching()){
                this.setTexture("cats_atlas", this.name+"_owo");
                this.checkFriend();
            }
            //this.debugtext.text = (this.body.embedded || !this.body.touching.none) ? "touching" : "alone"  ;
            this.x = dragX;
            this.y = dragY;
        }
    }

    getOffsetDistance(){
        if (this.catSoul != null)
           return Phaser.Math.Distance.Between(this.x + this.displayWidth/2, this.y - this.displayHeight/2,
                                                this.catSoul.x + this.displayWidth/2, this.catSoul.y - this.displayHeight/2); 
    }
    getDiagonal(){
        
        return Math.sqrt(this.displayWidth**2 + this.displayHeight**2);
    }

    onDragEnd(pointer){    // PUT ME DOWN PUT ME DOWN PUT ME DOWN
        if (this.selected || this.canceled){  
            if (this.isTouching() || this.getOffsetDistance() <   Cat.OFFSET_FACTOR* this.getDiagonal()  || this.canceled){     // No not here!!!
                this.setPosition(this.catSoul.x, this.catSoul.y);
                this.setTexture("cats_atlas", this.name);
            } else {
                this.decrementSelect();     // ah yea thats the spot.
            }
            this.checkFriend();
            this.canceled = false;
            Cat.SELECTED_CAT = null;
            Cat.P2C_COLLIDER.object2.push(this);
            Cat.P2C_OVERLAP.object2.push(this);
            this.catSoul.destroy();
            this.selected = false;
            this.setScale(1);
            this.setDepth(0);
        }
    }

    checkFriend(){
        if (this.my_friend != null){    // sowwy X3 me touch!
            let friend_state = (this.my_friend.isSelectable()) ? "" : "_uwu";
            this.my_friend.setTexture("cats_atlas", this.my_friend.name + friend_state);
            this.my_friend = null;  // bye bye OwO
        }            
    }

    decrementSelect(){  // Am I tired yet? 
        this.selectsLeft -= 1;
        this.checkSleep();
    }

    checkSleep(){   // Me nappy...
        if (!this.isSelectable()) // Me sleepy uwu
            this.setTexture("cats_atlas", this.name + "_uwu");
        else this.setTexture("cats_atlas", this.name);
    }

    update(){

    }
}