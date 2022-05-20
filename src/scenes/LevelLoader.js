class LevelLoader {
    static TYPE2CLASS = {
                        "food" : Food,
                        "player" : Player,
                        "luna": PlatformCat,
                        "newton": FallingCat,
                        "hubert": LongCat,
                        "biscuit": PlatformCat,
                        "quinn": PlatformCat,
                        "dreda": PlatformCat,
                        "horton": BounceCat
                        }

    static BG_NAMES = ["Background"]
    constructor(scene, i){
        this.scene = scene;
        this.map = scene.make.tilemap({key: 'level'+i});
        //this.dataManager = new Phaser.Data.DataManager(this);
        console.log(this.map);

        scene.physics.world.bounds.setTo(0,0, this.map.widthInPixels, this.map.heightInPixels);
        scene.cameras.main.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);
        scene.cameras.main.setRoundPixels(true);
        // this.map.tilesets.forEach(t => {
        //     let tileset_name;
        //     //if (t.name != "ground_tileset") tileset_name = t.name.replace(/.*\/([^/]+)\.[^/.]+$/, "$1_image");
        //     tileset_name = t.name+"_image";
            
        // });

        
        this.map.addTilesetImage("ground_tileset", "ground_tileset_image");
    }

    cleanInput(data){
        let ret = {};
        for (let d of data){
            ret[d.name] = d.value;
        }
        return ret;
    }

    loadLevel(){
        let food_array = [];
        let cat_array = [];
        this.map.objects.forEach( (objlayer) => {
            //console.log(objlayer.objects)
            objlayer.objects.forEach((obj) => {
                
                let e = null;
                if (obj.type == "player") this.scene.player = new Player(this.scene, obj.x, obj.y).setOrigin(0,1).setDepth(3);
                else if (obj.type == "food") {
                    food_array.push(new Food(this.scene, obj.x, obj.y, obj.type).setOrigin(0,1).setDepth(2));
                } else {
                    console.log()
                    cat_array.push(new LevelLoader.TYPE2CLASS[obj.type](
                                this.scene, obj.x, obj.y, obj.type, this.cleanInput(obj.properties)).setOrigin(0,1).setDepth(2));
                }
                
            })
        });

        return {food: food_array, cats: cat_array};
    }

    loadGround(){
        let ret_array = [];
        let backGround = this.map.createLayer("Background", "ground_tileset",0,0).setScrollFactor(0.5)
        let ground = this.map.createLayer("Ground", 'ground_tileset',0,0);
        ground.setCollisionByExclusion(-1, true);
            ret_array.push(ground);
        
        // Path count {0, {i}};
        
        // this.map.layers.forEach( (l) => {
            
            
        // });
        return ret_array;
    }

    loadBackground(){

    }
}