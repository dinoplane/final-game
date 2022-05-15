class LevelLoader {
    static TYPE2CLASS = {
                        "food" : Food,
                        "player" : Player,
                        "luna": PlatformCat,
                        "newton": FallingCat,
                        "hubert": LongCat,
                        "biscuit": PlatformCat,
                        "quinn": PlatformCat
                        }

    constructor(scene, i){
        this.scene = scene;
        this.map = scene.make.tilemap({key: 'level'+i});
        console.log(this.map);

        // this.map.tilesets.forEach(t => {
        //     let tileset_name;
        //     //if (t.name != "ground_tileset") tileset_name = t.name.replace(/.*\/([^/]+)\.[^/.]+$/, "$1_image");
        //     tileset_name = t.name+"_image";
            
        // });
        this.map.addTilesetImage("ground_tileset", "ground_tileset_image");
    }

    loadLevel(){
        let food_array = [];
        let cat_array = [];
        this.map.objects.forEach( (objlayer) => {
            console.log(objlayer.objects)
            objlayer.objects.forEach((obj) => {
                let e = null;
                if (obj.type == "player") this.scene.player = new Player(this.scene, obj.x, obj.y).setOrigin(0,1);
                else if (obj.type == "food") {
                    food_array.push(new Food(this.scene, obj.x, obj.y).setOrigin(0,1));
                } else {
                    console.log(obj)
                    cat_array.push(new LevelLoader.TYPE2CLASS[obj.type](
                                this.scene, obj.x, obj.y, obj.type, obj.properties).setOrigin(0,1));
                } 
                
            })
        });

        return {food: food_array, cats: cat_array};
    }

    loadGround(){
        let ret_array = [];
        this.map.layers.forEach( (l) => {
            let ground = this.map.createLayer(l.name, 'ground_tileset');
            if (l.name == "Ground") ground.setCollisionByExclusion(-1, true);
            ret_array.push(ground);
            
        });
        return ret_array;
    }
}