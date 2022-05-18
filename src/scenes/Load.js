class Load extends Phaser.Scene { // First time load
    static CAT_NAMES = ["dreda", "newton", "horton", "jasmine", "luna", "biscuit", "quinn", "clyde", "hubert", "davinci"];
    constructor(){
        super("loadScene");
    }

    preload(){
        this.load.image("player", "./assets/images/player.png");
        this.load.image("food", "./assets/images/food.png");
        

        this.load.image("ground_tileset_image", "./assets/tilesets/ground_tileset.png" );
        // Load.CAT_NAMES.forEach(cat => { 
        //     this.load.image(cat+"_image", "./assets/tilesets/cats_tileset/"+cat+".png");
        // });
        this.load.atlas("cats_atlas", "./assets/images/cats_atlas.png", "./assets/images/cats_atlas.json")
        
        
        for (let i = 0; i < gameOptions.levels; i++)
            this.load.tilemapTiledJSON('level'+i, './assets/tilemaps/level'+i+'.json');


        this.load.audio('pickup_food', './assets/audio/pickup_food.wav');
            
    }

    create(){
        this.scene.start("playScene")
    }

}