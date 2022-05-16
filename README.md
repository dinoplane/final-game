# final-game

Final Game
https://dinoplane.github.io/final-game/

A game about cats in space!


## How to use Level Loader

Folder structure:
```
final-game
  -assets
    -docs (images for this guide)
    -images
      -concept  (concept art lives here)
      -(player and food assets)
      -cat_atlas.png  (atlas itself)
      -cat_atlas.json (for atlas) 
    -tilemaps
      -level0.tmx (the tilemap file)
      -level0.json (exported json)
    -tilesets (put your tilesets in here)
      -cats_tileset
        -(various tileset_images by cat name only)
        -ground_tileset.png
  -lib (phaser lives here)
  -src
    -prefab  (all prefabs live here)
    -scenes  (all scenes live here)
  main.js   (starts the mainloop)
```

TILED:
In TILED, the tilemap file should look like this:

![This is an image](/assets/docs/folder_structure.JPG)

Make sure you have created the tilemap file inside the ```tilemaps``` folder. The name of the file should be ```level{i}``` where i is the level name. So level 1 would have a filename of level1.tmx. 

![This is an image](/assets/docs/tm_loc.JPG)


Each tile is currently on a ground_tileset. You may add more tiles as needed. 
All these tiles have the same behavior; they collide with the player. 

You may see that there are 2 other layers. These are object layers. The level loader parses these layers 
and generates sprites from them.

![This is an image](/assets/docs/objects.JPG)


As you can see, there are 2 layers: Food and Cat. 1 layer is for the Dood, and 1 is for the cats.
Currently, the Goal layer contains only the cat food. The layer gets parsed by the level loader 
and food sprites replace the positions on the tilemap. 


![This is an image](/assets/docs/whats.JPG)

To properly add a cat to the level, you have to:

1. Add an image from the ```cats_tilesheet``` folder to the ```cats``` tilesheet. 

![This is an image](/assets/docs/cats_loc.JPG)


2. The cat is added to the level.
3. The cats tilesheet contains the cat and the cat has the correct type. You can edit tilesheets by clicking on the bottom right of the screen.

![This is an image](/assets/docs/edit_tileset.JPG)
![This is an image](/assets/docs/change_type.JPG)

4. Make sure the atlas contains the cat you want to add (or the texture is loaded). 
5. Make sure you add the the key:value entry to the dictionary of cats. We should have a string to a Class

![This is an image](/assets/docs/type2class.JPG)

6. Make sure the js file is loaded in index.html

If you need to add a tilesheet make sure you create tilesheets like below:

For sprites and objects...

![This is an image](/assets/docs/collection.JPG)

For tiles...

![This is an image](/assets/docs/tileset_image.JPG)

You can also save a tileset as a separate file and load it into each tilemap. Make sure to embed it in though!



