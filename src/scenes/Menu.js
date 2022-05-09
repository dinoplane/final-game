class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        this.load.audio('bgMusic', './assets/mole_funk.mp3');
        this.load.audio('gem_collect', './assets/gem_collect.wav');
        this.load.audio('gameover', './assets/gameover.mp3');
        this.load.audio('boom', './assets/explosion.wav');
        this.load.audio('hit_hurt', './assets/hitHurt.wav');
        this.load.audio('brake', './assets/brake.mp3');

        this.load.image('gem', './assets/gem.png');
        this.load.image('gem_red', './assets/gem_red.png');
        this.load.image('gem_grn', './assets/gem_grn.png');

        this.load.image('cave_wall', './assets/background.png');
        this.load.image('purplestones', './assets/purplestones.png');
        this.load.image('stones', './assets/stones.png');
        
        this.load.image('cave_front', './assets/ground_front.png');
        this.load.image('cave_back', './assets/ground_back.png');
        this.load.image('i_wall', './assets/i_wall.png');
        this.load.image('pit', './assets/pit.png');

        this.load.image('tracks', './assets/tracks.png');

        this.load.atlas('sparks', './assets/sparks.png', './assets/sparks.json');

        this.load.atlas('mole_atlas', './assets/mole_atlas.png', './assets/mole_atlas.json');

        this.load.image('title', './assets/title.png');
        this.load.image('gameoverprompt', './assets/gameover.png');
        this.load.image('buttons', './assets/space.png');

        this.load.image('tutorial1', './assets/tutorial1.png');
        this.load.image('tutorial2', './assets/tutorial2.png');
        this.load.image('credits', './assets/credits.png');


        this.load.bitmapFont('lavender', './assets/numbers.png', './assets/numbers.xml');

        this.load.spritesheet('bat', './assets/bat.png', {frameWidth: 128, frameHeight: 64, startFrame: 0, endFrame: 6});
    }

    create(){
        this.cave_wall0 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cave_wall')
                                .setOrigin(0, 0).setDepth(0);
        this.cave_wall1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'purplestones')
                                .setOrigin(0, 0).setDepth(0);
        this.cave_wall2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'stones')
                                .setOrigin(0, 0).setDepth(0);
        this.title = this.add.image(0, 0, 'title').setOrigin(0, 0).setDepth(0);
        this.buttons = this.add.image(0,0, 'buttons').setOrigin(0, 0).setDepth(0);
        this.credits = this.add.image(0,0, 'credits').setOrigin(0, 0).setDepth(0);

        // let menuConfig = {
        //     fontFamily: 'Courier',
        //     fontSize: '28px',
        //     backgroundColor: '#F3B141',
        //     color: '#843605',
        //     align: 'right',
        //     padding: {
        //       top: 5,
        //       bottom: 5,
        //     },
        //     fixedWidth: 0
        // }
        // this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Mole Rush!', menuConfig).setOrigin(0.5);
        // menuConfig.backgroundColor = '#00FF00';
        // menuConfig.color = '#000';
        // this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press Space to Begin', menuConfig).setOrigin(0.5);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        this.bat = this.add.sprite(game.config.width, 500, 'bat', 0).setOrigin(0,0);
        this.bat.anims.create({
            key: 'flap',
            frames: this.anims.generateFrameNumbers('bat', { start: 0, end: 6, first: 0}),
            frameRate: 15,
            repeat: -1
        }); 
        this.bat.play('flap');
        
        this.tutorial = [];
        this.tutorial.push(this.add.image(0, 0, 'tutorial1').setOrigin(0, 0).setDepth(10).setVisible(false));
        this.tutorial.push(this.add.image(0, 0, 'tutorial2').setOrigin(0, 0).setDepth(10).setVisible(false));

        this.mode = 0;
        keyENTER.on('down', () => {
            if (this.mode < 2) this.tutorial[this.mode].setVisible(true);
            if (this.mode > 0) this.tutorial[this.mode-1].setVisible(false);            
            this.mode = (this.mode + 1) % 3;
        });

        keySPACE.on('down', () => {
            if (this.mode == 0) this.scene.start('playScene');
        });

        

        this.tweens.add({
            targets: this.bat,
            y: 600,
            //scale: 1,
            duration: 1000,
            ease: 'Sine.easeInOut',
            easeParams: [ 3.5 ],
            //delay: 1000,
            repeat:-1,
            yoyo: true,            
        });

    }
    update() {
        this.bat.x -= 1;
        if (this.bat.x < -this.bat.width)
            this.bat.x = game.config.width;
    }
}