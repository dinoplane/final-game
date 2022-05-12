class LevelLoader {
    static TYPE2CLASS = {
                        "food" : Food,
                        "player" : Player,
                        "biscuit": PlatformCat
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
        let ret_array = [];
        this.map.objects.forEach( (objlayer) => {
            console.log(objlayer.objects)
            objlayer.objects.forEach((obj) => {
                if (obj.type == "player") this.scene.add.sprite(obj.x, obj.y, "player").setOrigin(0,1);
                else if (obj.type == "food") this.scene.add.sprite(obj.x, obj.y, "food").setOrigin(0,1);
                else this.scene.add.sprite(obj.x, obj.y,"cats_atlas", obj.type).setOrigin(0,1); 
                
            })
        });

        return ret_array;
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