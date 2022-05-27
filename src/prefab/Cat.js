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
        this.rider = null;

        if (data["movesLeft"])
            this.selectsLeft = data["movesLeft"];
        else this.selectsLeft = 1;
        this.checkSleep();

        this.catSoul = null;
        this.my_friends = []; // FRIENDS not FRIEND (may overlap more than one)
    }

    addPointerCallbacks(){
        //this.pointer = this.scene.input.pointer1;
        // this.point = this.on('pointerm', (pointer, me) => {
            
        // });

        this.scene.input.setDraggable(this.setInteractive());

        this.dstart = this.on('dragstart', (pointer, dragX, dragY) => {
            this.onDragStart()
        });

        // this.dwhile = this.on('drag', (pointer, dragX, dragY) => {
        //     console.log("Pointer: %d, %d", pointer.x, pointer.y)
        //     console.log("Drag: %d, %d",dragX, dragY)
            
        // });

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
        console.log(this)
        if (this.my_friends.indexOf(that) == -1) this.my_friends.push(that);  // Cats are friendly to each other
        that.setTexture("cats_atlas", that.name+"_x3");
        this.setTexture("cats_atlas", this.name+"_x3");
    }

    onPlayerDragOverlap(player){
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
            //let j = Cat.P2C_OVERLAP.object2.indexOf(this);
                        
            Cat.P2C_COLLIDER.object2.splice(i,1);
            Cat.P2C_OVERLAP.collideCallback = (player, cat) => {
                cat.onPlayerDragOverlap(player);
            };
            
            Cat.SELECTED_CAT = this;

            this.catSoul = new CatSoul(this).setOrigin(0,1);
            this.setTexture("cats_atlas", this.name+"_owo");
            this.selected = true;
            this.setScale(1.01);
            this.setDepth(4);
        }
    }

    whileDrag(dragX, dragY){    // OwO AAAAAAAA
        let new_x = dragX;
        let new_y = dragY;
        //console.log("New Coords: %d, %d", new_x, new_y);
        if (this.selected && !this.canceled){
            //console.log(dragX, dragY);   

            //console.log("Curr Coords: %d, %d", this.x, this.y )
            if (this.body.wasTouching && !this.isTouching()){
                this.setTexture("cats_atlas", this.name+"_owo");
                //this.checkFriend();
            }
            let d = Math.sqrt((this.x - new_x)**2 + (this.y - new_y)**2);
            //this.debugtext.text = (this.body.embedded || !this.body.touching.none) ? "touching" : "alone"  ;
            //console.log(d)

            if (d > 1) {// a little offset doesn't hurt???
               // console.log("ME HERE!")

                this.x = new_x - this.displayWidth/2;
                this.y = new_y + this.displayHeight/2;}
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
        console.log("PUT ME DOWN")
        if (this.selected || this.canceled){  
            if (this.isTouching() || this.getOffsetDistance() <   Cat.OFFSET_FACTOR* this.getDiagonal()  || this.canceled){     // No not here!!!
                this.setPosition(this.catSoul.x, this.catSoul.y);
                this.setTexture("cats_atlas", this.name);
            } else {
                this.decrementSelect();     // ah yea thats the spot.
            }
            //this.checkFriend();
            this.canceled = false;
            Cat.SELECTED_CAT = null;
            Cat.P2C_COLLIDER.object2.push(this);
            Cat.P2C_OVERLAP.collideCallback = (player, cat) => {
                cat.onOverlap(player);
            };
            //Cat.P2C_OVERLAP.object2.push(this);
            this.catSoul.destroy();
            this.selected = false;
            this.setScale(1);
            this.setDepth(0);
        }
    }

    cx(){
        return this.x + this.displayWidth/2;
    }

    cy(){
        return this.y - this.displayHeight/2;
    }

    // adapted from https://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
    checkCatOverlap(friend){ 
        return ((Math.abs(this.cx() - friend.cx())) * 2 < (this.displayWidth + friend.displayWidth)) &&
                ((Math.abs(this.cy() - friend.cy())) * 2 < (this.displayHeight + friend.displayHeight))
    }

    checkFriend(friend){ // FIX ME!!!
        if (friend != null){    // sowwy X3 me touch!
            if (!this.checkCatOverlap(friend)){ // You no touchy anymore?
                let friend_state = (friend.isSelectable()) ? "" : "_uwu";
                friend.setTexture("cats_atlas", friend.name + friend_state);
                this.my_friends.splice(this.my_friends.indexOf(friend), 1);  // bye bye OwO
            }
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
        //console.log(this.frame.name)
        if (this.my_friends.length > 0){
            this.my_friends.forEach((cat) => {this.checkFriend(cat);})
        }
    
        if (pointer.primaryDown && this.selected){
            pointer = pointer.updateWorldPoint(this.scene.cameras.main);
            //console.log(pointer.worldX - this.width/2, pointer.worldY+this.height/2)
            this.whileDrag(pointer.worldX, pointer.worldY);
        }
        //console.log(this.texture)
    }
}