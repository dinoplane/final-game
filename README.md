# final-game

Final Game

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



