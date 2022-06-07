// Adapted overlap from https://codepen.io/samme/pen/WaZQOX

class PopupElement { // Takes in an element and tweens it when the player is in range
    static RANGE_BODIES = [];
    static RANGE_OVERLAP = null;

    constructor(scene, x, y, data){ // data contains rangeOffsetX, rangeOffsetY, range, oneUse
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.oneUse = data["oneUse"];
        this.isUsed = false;
        if (this.oneUse > 0){
            this.useTimer = this.scene.time.addEvent({
                delay: 500,                // ms
                callback: this.reset,
                //args: [],
                callbackScope: this,
                loop: true
            });
        }

        this.elements = [];
        this.parseElements(this.scanElements(data["elements"]));
        this.setUpTween();


        // Create a ellipse
        this.range = new Phaser.GameObjects.Ellipse(scene, this.x + data["rangeOffsetX"], 
                                                    this.y+data["rangeOffsetY"], 
                                                    data["rangeWidth"], data["rangeHeight"]);
       
        this.scene.add.existing(this.range);
        this.scene.physics.add.existing(this.range);
        
        this.range.body.immovable = true;
        this.range.body.allowGravity = false;
        this.range.visible = false;

        this.isTouching = false;
        this.range.on("overlapstart", () => {
            this.isTouching = true;
            this.onOverlapStart();
        });
        this.range.on("overlapend", () => {
            this.isTouching = false;
            this.onOverlapEnd();
        })
        PopupElement.RANGE_BODIES.push(this.range);
    }

    scanElements(elements){// Taking in a string of format "'Text', image"
        // Use a regex to split the string
        return elements.split(/\s*,\s*/);
    }

    parseElements(elements){
        let curr_x = this.x;
        let curr_y = this.y;
        elements.forEach(element => {
            let e = null;
            if (element[0] == "'") {
                element = element.match(/\'(.*)\'/)[1];
                e = this.scene.add.bitmapText(curr_x, curr_y, 'neptune', element);
            } else {
                e = this.scene.add.image(curr_x, curr_y, 'popup_atlas', element);
            }

            e.setOrigin(0, 1).setDepth(1).setAlpha(0);
            this.elements.push(e);

            if (e != null) curr_x += e.width;
        });

        // We want to center everything so we need to calculate the center and offset
        let offset = (curr_x - this.x) / 2;
        this.elements.forEach(element =>{
            element.x -= offset;
        });
        
    }

    setUpTween(){
        this.appear = this.scene.tweens.create({
            targets: this.elements,
            alpha: 1,
            y: '-=20',
            duration: 250,
            ease: 'Sine.easeInOut',
            //easeParams: [ 3.5 ],
            //delay: 1000,
        });

        this.disappear = this.scene.tweens.create({
            targets: this.elements,
            alpha: 0,
            y: '+=20',
            duration: 250,
            ease: 'Sine.easeInOut',
            //easeParams: [ 3.5 ],
            //delay: 1000,
        });
    }

    reset(){
        this.isUsed = false;
        this.disappear.play();
        this.useTimer.paused = true;
    }

    onOverlapStart(){
        if (!(this.oneUse == 0 && this.isUsed))
            this.appear.play();
            if (this.oneUse > 0) {
                this.useTimer.paused = true
                this.useTimer.delay = this.oneUse;
            };
    }

    onOverlapEnd(){
        if (!(this.oneUse == 0 && this.isUsed)){
            this.isUsed = true;

            if (this.oneUse > 0) this.useTimer.paused = false;
            else this.disappear.play();
        }
    }

    update() {
        var touching =  !this.range.body.touching.none || this.range.body.embedded;
        var wasTouching = !this.range.body.wasTouching.none;
        if (this.oneUse > 0) console.log(this.useTimer.delay);
        if (touching && !wasTouching && !this.isTouching) this.range.emit("overlapstart");
        else if (!touching && wasTouching && this.isTouching) this.range.emit("overlapend");
    }
}