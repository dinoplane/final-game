class Load extends Phaser.Scene { // First time load
    static CAT_NAMES = ["dreda", "newton", "horton", "jasmine", "luna", "biscuit", "quinn", "clyde", "hubert", "davinci"];
    constructor(){
        super("loadScene");
    }

    preload(){
        this.load.image("player", "./assets/images/player.png");
        this.load.image("food", "./assets/images/food.png");
        this.load.image("token", "./assets/images/token.png");
        this.load.image("title", "./assets/images/startmenu.png");
        this.load.image('end', './assets/images/end.png');
        this.load.image('credits', './assets/images/credits.png');
        this.load.image('loading', './assets/images/loading.png');

        this.load.image("ground_tileset_image", "./assets/tilesets/ground_tileset.png" );
        this.load.atlas("miao_atlas", "./assets/images/miao_atlas.png", "./assets/images/miao_atlas.json");
        this.load.atlas("brain_atlas", "./assets/images/brain_atlas.png", "./assets/images/miao_atlas.json");
        this.load.image("miao_win", "./assets/images/miao_win.png");
        this.load.atlas("cats_atlas", "./assets/images/cats_atlas.png", "./assets/images/cats_atlas.json");
        this.load.atlas("zzz_atlas", "./assets/images/zzz_atlas.png", "./assets/images/zzz_atlas.json");
        this.load.atlas("popup_atlas", "./assets/images/popup_atlas.png", "./assets/images/popup_atlas.json");
        this.load.atlas("vfx_atlas", "./assets/images/vfx_atlas.png", "./assets/images/vfx_atlas.json");
        
        for (let i = 0; i < gameOptions.levels; i++)
            this.load.tilemapTiledJSON('level'+i, './assets/tilemaps/level'+i+'.json');

        this.load.audio('pickup_food', './assets/audio/pickup_food.wav');
        this.load.audio('jump', './assets/audio/jump.wav');
        this.load.audio('double_jump', './assets/audio/power_up.wav');
        this.load.audio('spring', './assets/audio/spring.wav');
        this.load.audio('compress', './assets/audio/compress.wav');
        this.load.audio('bg_music1', './assets/audio/wander.mp3');
        this.load.audio('win', './assets/audio/win.wav');
        this.load.audio('start', './assets/audio/start.wav');
        this.load.audio('restart', './assets/audio/restart.wav');
        this.load.audio('bounce', './assets/audio/bounce.wav');
        

        this.load.bitmapFont('neptune', './assets/fonts/neptune.png', './assets/fonts/neptune.xml');
        this.load.bitmapFont('lavender', './assets/fonts/numbers.png', './assets/fonts/numbers.xml');

        this.load.image('thought', './assets/images/think.png');
        this.load.image('levelhead', './assets/images/levelhead.png');
        
    }

    create(){
        this.scene.launch("menuScene").launch("transitionScene");
    }

}