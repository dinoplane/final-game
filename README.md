# final-game

Final Game

A game about cats in space!


## How to use Level Loader

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



