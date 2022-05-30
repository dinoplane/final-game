class Load extends Phaser.Scene { // First time load
    static CAT_NAMES = ["dreda", "newton", "horton", "jasmine", "luna", "biscuit", "quinn", "clyde", "hubert", "davinci"];
    constructor(){
        super("loadScene");
    }

    preload(){
        this.load.image("player", "./assets/images/player.png");
        this.load.atlas("miao_atlas", "./assets/images/miao_atlas.png", "./assets/images/miao_atlas.json");
        this.load.atlas("brain_atlas", "./assets/images/brain_atlas.png", "./assets/images/miao_atlas.json");
        this.load.image("food", "./assets/images/food.png");

        this.load.image("ground_tileset_image", "./assets/tilesets/ground_tileset.png" );
        // Load.CAT_NAMES.forEach(cat => { 
        //     this.load.image(cat+"_image", "./assets/tilesets/cats_tileset/"+cat+".png");
        // });
        this.load.atlas("cats_atlas", "./assets/images/cats_atlas.png", "./assets/images/cats_atlas.json");
        this.load.atlas("zzz_atlas", "./assets/images/zzz_atlas.png", "./assets/images/zzz_atlas.json");
        this.load.atlas("popup_atlas", "./assets/images/popup_atlas.png", "./assets/images/popup_atlas.json");
        
        
        for (let i = 0; i < gameOptions.levels; i++)
            this.load.tilemapTiledJSON('level'+i, './assets/tilemaps/level'+i+'.json');


        this.load.audio('pickup_food', './assets/audio/pickup_food.wav');
        this.load.audio('jump', './assets/audio/jump.wav');
        this.load.audio('double_jump', './assets/audio/power_up.wav');
        this.load.audio('bg_music1', './assets/audio/wander.mp3');

        this.load.bitmapFont('neptune', './assets/fonts/neptune.png', './assets/fonts/neptune.xml');
    }

    create(){
        this.scene.start("playScene")
    }

}