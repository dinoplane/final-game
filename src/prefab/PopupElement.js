// Adapted overlap from https://codepen.io/samme/pen/WaZQOX

class PopupElement { // Takes in an element and tweens it when the player is in range
    static RANGE_BODIES = [];
    static RANGE_OVERLAP = null;

    constructor(scene, x, y, data){ // data contains rangeOffsetX, rangeOffsetY, range, oneUse
        this.scene = scene;
        //this.element = element;
        this.x = x;
        this.y = y;
        //console.log
        // Create a circle 
        this.range = new Phaser.GameObjects.Ellipse(scene, this.x + data["rangeOffsetX"], 
                                                    this.y+data["rangeOffsetY"], 
                                                    data["rangeWidth"], data["rangeHeight"]);
       
        this.scene.add.existing(this.range);
        this.scene.physics.add.existing(this.range);
        this.range.body.immovable = true;
        this.range.body.allowGravity = false;
        this.range.visible = false;

        this.elements = [];
        this.parseElements(this.scanElements(data["elements"]));
        this.setUpTween();

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
            //console.log(element[0]);
            if (element[0] == "'") {
                element = element.match(/\'(.*)\'/)[1];
                this.elements.push(this.scene.add.bitmapText(curr_x, curr_y, 'neptune', "HELLO")
                                        .setOrigin(0, 1).setDepth(1).setAlpha(0));
            } else ;
        });
        
    }

    setUpTween(){
        this.appear = this.scene.tweens.create({
            targets: this.elements,
            alpha: 1,
            duration: 250,
            ease: 'Sine.easeInOut',
            //easeParams: [ 3.5 ],
            //delay: 1000,
            onUpdate: () => {

            },
            onComplete: () => {

            }
        });

        this.disappear = this.scene.tweens.create({
            targets: this.elements,
            alpha: 0,
            duration: 250,
            ease: 'Sine.easeInOut',
            //easeParams: [ 3.5 ],
            //delay: 1000,
            onUpdate: () => {

            },
            onComplete: () => {

            }
        });
    }

    onOverlapStart(){
        this.appear.play();
    }

    onOverlapEnd(){
        this.disappear.play();
    }

    update() {
        var touching =  !this.range.body.touching.none || this.range.body.embedded;
        var wasTouching = !this.range.body.wasTouching.none;

        if (touching && !wasTouching && !this.isTouching) this.range.emit("overlapstart");
        else if (!touching && wasTouching && this.isTouching) this.range.emit("overlapend");
    }
}