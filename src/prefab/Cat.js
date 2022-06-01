class Cat extends Phaser.Physics.Arcade.Sprite {
    static P2C_COLLIDER = null;
    static P2C_OVERLAP = null;
    static C2C_OVERLAP = null;

    static SELECTED_CAT = null;
    static OFFSET_FACTOR = 0.1;
    // MOMMY MOMMY MOMMY MOMMY

    static THOUGHTS = null;

    constructor(scene, x, y, frame, data){
        super(scene, x, y, "cats_atlas", frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.addPointerCallbacks();
        this.zzz = null;

        this.name = frame;
        this.selected = false;
        this.over = false;
        this.canceled = false; // O nwo me no use twitta
        this.rider = null;

        this.selectsLeft = data["movesLeft"];
        this.checkSleep();
        

        this.catSoul = null;
        this.my_friends = []; // FRIENDS not FRIEND (may overlap more than one)
    }

    addPointerCallbacks(){
        this.scene.input.setDraggable(this.setInteractive());
        this.setInteractive();

        this.pover = this.on("pointerover", (pointer) => {
            this.startThinking();
        });

        this.pover = this.on("pointerout", (pointer) => {
            this.stopThinking();
        });
        

        this.dstart = this.on('dragstart', (pointer, dragX, dragY) => {
            this.onDragStart()
        });

        this.dend = this.on('dragend', (pointer, dragX, dragY) => {
            this.onDragEnd(pointer);  
        });

    }

    static createThoughts(scene){
        let thought_pic = scene.add.image(0,0, 'thought').setOrigin(0.5, 0.5).setScale(1.5);
        let moves = scene.add.bitmapText(thought_pic.x+7, thought_pic.y-1, 'lavender', "4567").setOrigin(0.5, 0.5);
        Cat.THOUGHTS = scene.add.container(400,400, [thought_pic, moves]).setDepth(6);
        Cat.THOUGHTS.setActive(false);
        Cat.THOUGHTS.setVisible(false);
        
    }

    onCollide(player){

    }

    onBeforeCollide(player){

    }

    onOverlap(player){

    }

    setUpAnimations(){
        this.drowsy = this.anims.create({
            key: 'drowsy',
            defaultTextureKey: 'cat_atlas',
            frames:  [Animationthis.name+"_uwu", this.name, this.name+"_uwu", this.name],
            frameRate: 12,
            repeat: -1,
            delay: 2000
        });
    }

    onCatOverlap(that){ // X3 sowwy me touchy
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

    isSleepy(){
        return this.selectsLeft == 1;
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
            this.stopThinking();
            this.setScale(1.01);
            this.setDepth(5);
        }
    }

    whileDrag(dragX, dragY){    // OwO AAAAAAAA
        let new_x = dragX;
        let new_y = dragY;
        if (this.selected && !this.canceled){
            if (this.body.wasTouching && !this.isTouching())
                this.setTexture("cats_atlas", this.name+"_owo");
            
            let d = Math.sqrt((this.x - new_x)**2 + (this.y - new_y)**2);
            if (d > 5) {// a little offset doesn't hurt???
                this.x = new_x - this.displayWidth/2;
                this.y = new_y + this.displayHeight/2;
            }
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

            this.canceled = false;
            Cat.SELECTED_CAT = null;
            Cat.P2C_COLLIDER.object2.push(this);
            Cat.P2C_OVERLAP.collideCallback = (player, cat) => {
                cat.onOverlap(player);
            };
            this.catSoul.destroy();
            this.selected = false;
            this.setScale(1);
            this.setDepth(3);
            this.startThinking();

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
                friend.checkSleep();
                this.my_friends.splice(this.my_friends.indexOf(friend), 1);  // bye bye OwO
            }
        }            
    }

    decrementSelect(){  // Am I tired yet? 
        this.selectsLeft -= 1;
        this.checkSleep();
    }

    startSleeping(){
        if (this.zzz == null){
            this.zzz = this.scene.add.sprite(this.x + this.displayWidth, 
                            this.y - this.displayHeight, "zzz_atlas", "zzz000").setOrigin(0, 1).setDepth(5);
            this.zzz.anims.create({
                    key: 'zzz',
                    defaultTextureKey: 'zzz_atlas',
                    frames:  this.anims.generateFrameNames('zzz_atlas', { 
                    prefix: 'zzz', 
                    start: 0, 
                    end: 5, 
                    suffix: '',
                    zeroPad: 3,
                }),
                frameRate: 6,
                repeat: -1
            });
            //this.anims.play('drowsy');
            this.zzz.anims.play('zzz');
        }
    }

    startThinking(){
        if (!this.over && Cat.SELECTED_CAT == null && !this.selected && this.isSelectable()){
            this.over = true;
            Cat.THOUGHTS.setActive(true);
            Cat.THOUGHTS.setVisible(true);
            Cat.THOUGHTS.getAt(1).text = this.selectsLeft;
            Cat.THOUGHTS.x = this.body.right + Cat.THOUGHTS.getAt(0).displayWidth/2;
            Cat.THOUGHTS.y = this.body.top;
        }
    }

    stopThinking(){
        if (this.over || this.selected){
            this.over = false;
            Cat.THOUGHTS.setActive(false);
            Cat.THOUGHTS.setVisible(false);
        }
    }

    checkSleep(){   // Me nappy...
        if (!this.isSelectable()){ // Me sleepy uwu
            
            this.startSleeping();
            this.setTexture("cats_atlas", this.name + "_uwu");
        } else if (this.isSleepy()){
            //this.startSleeping();
            this.setTexture("cats_atlas", this.name);
        } else this.setTexture("cats_atlas", this.name);  
    }

    update(){
        if (this.my_friends.length > 0){
            this.my_friends.forEach((cat) => {this.checkFriend(cat);})
        }

        if (this.zzz != null){
            this.zzz.x = this.x + this.displayWidth;
            this.zzz.y = this.y - this.displayHeight
        }
    
        if (pointer.primaryDown && this.selected){
            pointer = pointer.updateWorldPoint(this.scene.cameras.main);
            this.whileDrag(pointer.worldX, pointer.worldY);
        }
    }
}