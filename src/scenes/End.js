class End extends Phaser.Scene {
    constructor() {
        super("endScene");
    }

    create(){
        this.end = this.add.image(game.config.width/2, 0, 'end').setOrigin(0.5, 0).setDepth(0);

        this.endtext = this.add.bitmapText(game.config.width/2, 60, 'neptune', 'THE END', 72).setOrigin(0.5, 0).setDepth(0);
        
        this.endtext = this.add.bitmapText(game.config.width/2, 180, 'neptune', 'Press SPACE to go back to menu.').setOrigin(0.5, 0).setDepth(0);
        
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        this.keySPACE.on('down', () => {
            level += 1;
            this.scene.get('transitionScene').transition();
            //this.scene.switch("playScene");
        });

    

    }
}