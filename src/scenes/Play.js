class Play extends Phaser.Scene {

    constructor(){
        super("playScene");
        this.VELOCITY = 200;

    }

    create(){

        this.levelLoader = new LevelLoader(this, level);
        this.player = null;
        this.levelComplete = false;
        
        this.objects = this.levelLoader.loadLevel();
        console.log(this.objects)

        //this.player = this.physics.add.sprite(0,0, 'player');
        this.physics.add.collider(this.player, this.levelLoader.loadGround(),
                                    (p, g) => {
                                        this.onGroundCollide(p, g);
                                    });

        this.physics.add.overlap(this.player, this.objects.food, (player, food) => {
            food.onCollide(player);
        });
        this.foodNum = this.objects.food.length;

        Cat.P2C_COLLIDER = this.physics.add.collider(this.player, this.objects.cats.slice(), (player, cat) => {
            cat.onCollide(player);
        });
        Cat.P2C_OVERLAP = this.physics.add.overlap(this.player, this.objects.cats.slice(), (player, cat) => {
            cat.onOverlap(player);
        });
        
        Cat.C2C_OVERLAP = this.physics.add.collider(this.objects.cats.slice(), this.objects.cats.slice(), (cat1, cat2) => {
            cat1.onCatOverlap(cat2);
        });
        
        
        this.input.on("pointerdown", (pointer, obj) => {
            if (Cat.SELECTED_CAT != null && obj.length == 0){
                Cat.SELECTED_CAT.decrementSelect();
                Cat.SELECTED_CAT.setPosition(pointer.worldX - Cat.SELECTED_CAT.width/2, pointer.worldY + Cat.SELECTED_CAT.height/2);
                Cat.SELECTED_CAT.onDeselected();
            }
        })

        // Cameras
        //game.renderer.renderSession.roundPixels = true;
        this.cameras.main.roundPixels = true;
        this.cameras.main.startFollow(this.player, true);
        // set camera dead zone
//        this.cameras.main.setDeadzone(200, 200);
        //this.cameras.main.setName("center");

        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyR.on('down', (key) => {
            this.scene.restart();
        }); 

        //this.physics.add.collider(this.player, )
        //this.physics.world.setBounds(game.config.width, game.config.height);
    }

    onGameOver(){
    }
    
    update(time, delta){
        if (this.player.food == this.foodNum && !this.levelComplete){
            console.log("Hello")
            this.levelComplete = true;
            this.player.onLevelComplete();
        }
        console.log(this.cameras.main.roundPixels)
       //console.log(this.input.mousePointer.x, this.input.mousePointer.y);
    }

    loadNextLevel(){
        level = (level + 1) % gameOptions.levels;
        this.scene.restart();
    }



    onGroundCollide(player, ground){
        player.resetJumps();
    }

}

