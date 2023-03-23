# Adventure

# Project Description

This program is a text-based adventure game inspited by Will Crowther's pioneering
"Adventure" program of the early 1970s. In this game the player wanders
around from one location to another, picking up objects, and solving simple puzzles.

The program is written in Javascript and is made up of the following files:
- Adventure.js - The main program, which gets the program started.
- AdvPassage.js - Keeps track of the passages leading from a room.
- AdvGame.js -Contains the code and data necessary to play the game.
- AdvRoom.js - Maintains the data structure for each room in the cave.
- AdvObject.js - Maintains the data structure for each object that can be carried by the player.

In addition to the Javascript files above the, index.html file contains the XML data used to describe
the attributes for each room within the game. The data is accessed through the Document Object Model (DOM)

# Installation

To run the game simply download the repository and open the index.html file

# How to play

Use the following commands to navigate through the world and complete the Adventure!

| Command | Description |
| --- | --- |
| East | moves player east |
| West | moves player west |
| North | moves player north |
| South | moves player south |
| Look | prints out a description of the room you are in |
| In | players moves into a room |
| Out | player exits a room |
| Take _____ | players grabs the object |
| Drop _____ | players drops the object |
| East | moves player east |
| Inventory | lists the objects held by the player |
| Quit | player quits the game |
| Help | print game instructions |
