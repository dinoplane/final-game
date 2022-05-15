class Play extends Phaser.Scene {

    constructor(){
        super("playScene");
        this.VELOCITY = 200;

    }

    create(){

        this.levelLoader = new LevelLoader(this, level);
        this.player = null;
        
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

        this.physics.add.collider(this.player, this.objects.cats, (player, cat) => {
            cat.onCollide(player);
        });
        this.physics.add.overlap(this.player, this.objects.cats, (player, cat) => {
            cat.onOverlap(player);
        });
        
        
        this.input.on("pointerdown", (pointer, obj) => {
            if (Cat.SELECTED_CAT != null && obj.length == 0){
                Cat.SELECTED_CAT.setPosition(pointer.x-Cat.SELECTED_CAT.width/2, pointer.y+Cat.SELECTED_CAT.height/2);
                Cat.SELECTED_CAT.onDeselected();
            }
        })
        //this.physics.add.collider(this.player, )
        //this.physics.world.setBounds(game.config.width, game.config.height);
    }

    onGameOver(){
    }
    
    update(time, delta){
        if (this.player.food == this.foodNum){
            level = (level + 1) % gameOptions.levels;
            this.scene.restart();
        }

    }

    onGroundCollide(player, ground){
        player.resetJumps();
    }

}

