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
        
        this.input.mouse.disableContextMenu();
        this.input.on("pointerdown", (pointer, obj) => {
            if (pointer.rightButtonDown() && Cat.SELECTED_CAT != null){
                Cat.SELECTED_CAT.canceled = true;
            }
        });
        

        // Cameras
        //game.renderer.renderSession.roundPixels = true;
        this.cameras.main.roundPixels = true;
        this.cameras.main.startFollow(this.player, true, );
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
            this.levelComplete = true;
            this.player.onLevelComplete();
        }
        this.player.update();
    }

    loadNextLevel(){
        level = (level + 1) % gameOptions.levels;
        this.scene.restart();
    }



    onGroundCollide(player, ground){
            player.onGround();
            player.body.touching.down = true;
            player.body.touching.none = false;
    }

}

