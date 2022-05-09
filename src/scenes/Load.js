class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }
    preload() {
        this.load.audio('bgMusic', './assets/mole_funk.mp3');
    }

    create(){}
    update() {
          this.scene.start('menuScene');
    }
}