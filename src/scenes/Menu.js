class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create(){
        this.title = this.add.image(game.config.width/2, 0, 'title').setOrigin(0.5, 0).setDepth(0);
        this.title.setScale(game.config.height/this.title.displayHeight);
        ;
        this.credits = this.add.image(0,0, 'credits').setOrigin(0, 0).setDepth(0);


        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        this.keySPACE.on('down', () => {
            this.scene.start('playScene');
        });

    

    }
}