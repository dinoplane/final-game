class Transition extends Phaser.Scene {
    constructor() {
        super("transitionScene");
    }

    create(){
        let back = this.add.image(0,0, 'levelhead').setOrigin(0,1);
        let front = this.add.bitmapText(game.config.width/2, -back.height/2,'neptune', 'ploop').setOrigin(0.5,0.5)
        this.levelhead = this.add.container(0, 0, [back, front]).setActive(true).setVisible(true);
        this.loading_screen = this.add.image(game.config.width, 0, 'loading').setOrigin(0,0);
        this.startSfx = this.sound.add('start');
        this.setUpTweens();
    };

    setUpTweens(){
        this.levelpeek = this.tweens.create({
            targets: this.levelhead,
            y: this.levelhead.getAt(0).height  ,
            duration: 500,
            hold: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true
        });

        this.open = this.tweens.create({
            targets: this.loading_screen,
            x: game.config.width,
            duration: 1000,
            delay: 500,
            ease: 'Bounce.easeIn',

            onComplete: ()=> {

                if (this.scene.isActive('playScene')) {
                    //Music control
                    if (bg_music == null){
                        bg_music = this.sound.add('bg_music1', {
                            loop: true,
                            volume: 1,
                        });
                        bg_music.play()
                    }

                    let playscene = this.scene.get('playScene');
                    playscene.input.keyboard.enabled = true;
                    playscene.input.mouse.enabled = true;
                    let leveltext = playscene.levelLoader.getLevelName();
                    this.levelhead.getAt(1).text = leveltext;
                    this.levelpeek.play();
                }
                //this.scene.start('playScene');
            }
        });


    }

    transition(){

        this.close = this.tweens.create({
            targets: this.loading_screen,
            x: 0,
            duration: 1000,
            ease: 'Bounce.easeOut',
            onStart: () => {
                if (this.scene.isActive('menuScene')) {
                    this.startSfx.play();
                }
            },

            onComplete: ()=> {

                if (level == gameOptions.levels){ // No more levels.. end
                    this.scene.get('playScene').scene.switch('endScene');
                    bg_music.stop()
                    bg_music = null;
                } else if (this.scene.isActive('menuScene')) { // Menu to play
                    level = 7;
                    if (this.scene.isSleeping('playScene')) {
                        new_play = true;
                        this.scene.get('menuScene').scene.switch('playScene').restart();
                    }
                    this.scene.get('menuScene').scene.switch('playScene');
                    
                } else if (this.scene.isActive('endScene')) { // end to menu
                    this.scene.get('endScene').scene.switch('menuScene');
                }
                else this.scene.get('playScene').scene.restart(); // play restart
                 
                this.open.play();
            }
        });
        
        this.close.play();
    }

    

    
}