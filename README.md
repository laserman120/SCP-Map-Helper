# SCP-Map-Helper
A simple website, allowing users to quickly draw out a map of SCP Containment Breach as well as mods of SCP:CB

This project is still unfinished.
Once completed it will be available to use one a website.

Features: 

- Draw the map using the buttons on each room to create adjacent rooms.
  + alternatively you can also use the arrow keys to do so, if you dont want to move to the newly created room, hold down ctrl
- Add icons onto existing rooms by double clicking a room. You can also search for the room you need. pressing enter selects the first shown room.
- You can save the created map locally, as well as load previously saved maps.

Creating additional game types:
- Inside the gameTypes folder there can be different types of gamemodes. These allow for modded versions of the game, by manually adding the needed images for the different rooms.
- Additionally you can provide information about the room, these are stored inside the info folder. $ is used to mark a new line. Using the word "spoiler" will hide all the text after it if spoilers are disabled.
- baseImages stores the default rooms. 
- icons stores the icons that are laid onto a room when selected. These dont need any rotational variants to be easily readable.
- rooms stores all the possible room type with each door count. When you add a new room it also needs to be added here. The first altName is used for the name of the images and info text.
- So it is recommended for the name and first alt name to be the same.
