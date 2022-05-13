/*
For anyone who uses this:

This is a Level Loader that loads levels into the play scene. 

How to use:

There are 2 major steps divided by the application you use and what you are adding.  

Folder structure:


TILED:
In TILED, the tilemap file should look like this:

Each tile is currently on a ground_tileset. You may add more tiles as needed. 
All these tiles have the same behavior; they collide with the player. 

You may see that there are 2 other layers. These are object layers. The level loader parses these layers 
and generates sprites from them.

As you can see, there are 2 layers: Goal and Cat. 1 layer is for the Goal, and 1 is for the cats.
Currently, the Goal layer contains only the cat food. The layer gets parsed by the level loader 
and Can sprites replace the positions on the tilemap. 

To properly add a cat to the level, you have to:

1. Add an image from the "cats_tilesheet" folder to the "cats" tilesheet. 
2. Make sure the atlas contains the cat you want to add. Or the texture is loaded. 
3. Make sure you add the the key:value entry to the dictionary of cats. We should have a string to a Class


Loading up the images in phaser:

Make sure the atlas contains the cat you want. 


*/

class LevelLoader {
    static TYPE2TEXTURE = {
                            "food" : 'food',
                            "player" : 'player',
                            "biscuit": ''
                          }
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
                    cat_array.push(new PlatformCat(this.scene, obj.x, obj.y, obj.type).setOrigin(0,1));
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