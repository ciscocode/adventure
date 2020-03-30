/*
 * File: AdvGame.js
 * ----------------
 * This file defines the AdvGame class, which records the information
 * necessary to play a game. Your job is to complete the implementation
 * of this file in stages as described in the "Milestones" section of
 * the assignment handout.
 */

/*
 * Factory method: AdvGame
 * Usage: let game = AdvGame();
 * ----------------------------
 * Creates an AdvGame object by reading data from the GameData element
 * in the index.html file.
 */

 //this function distributes objects/items into their respective rooms in the game
function distributeObjects(objects,rooms) {
   //use a for loop.. loop through the objects
   //first read the post it and the location name
   // then push the object into the room when location matches room name //!! PLAYER is not a room!

   let numOfObjects = Object.keys(objects).length 
   let arrayOfObjects = Object.values(objects)
   let arrayOfRoomNames = Object.keys(rooms)
   let arrayOfRoomObjects = Object.values(rooms)

   for (let i=0; i<numOfObjects; i++) {
      let locationsOfObjects = arrayOfObjects[i].getLocation() //this takes the location from an object at an index
      for (let j=0; j<arrayOfRoomNames.length; j++) {
         let nameOfRoom = arrayOfRoomNames[j]

         if (locationsOfObjects === nameOfRoom) {
            arrayOfRoomObjects[j].addObject(arrayOfObjects[i])
         }
      }
   }   
}

function AdvGame() {
   let rooms = readRooms()
   let objects = readObjects()
  distributeObjects(objects,rooms)
   let element = document.getElementById("GameData");
   if (element === null) return undefined;

   // You write the code that initializes the state of the game
   let currentRoom = rooms["START"];	
	function describeRoom() {

      if (currentRoom.hasBeenVisited()) { //after you visit a room once the game should only print the short description the next time you visit
         currentRoom.printShortDescription()
      }

      else {
         currentRoom.printLongDescription();
      }
      currentRoom.setVisited(true) //set flag as true. after visiting the room tell the room it has been visited. If not, it will always print the long description.  
      currentRoom.describeObjects()
      console.requestInput("> ", checkAnswer); 
   }
   
   //this function checks the line the user inputs.
   function checkAnswer(line) {
      
      let actionVerbs = ["quit","help","look"] //this is a list of actionverbs
      let actionVerbBoolean = false // begin as false. if we happen to identify a word as an actionVerb then we can make this true
      
      //the following 3 lines are to ensure that the users input is subdivided into seperate words and that the first word is checked to be an action verb
      line = line.split(" ")
      line = line[0]
      line = line.toLowerCase()

      //run this look to check if the word you used is in fact an action word
      for (let i=0; i<actionVerbs.length; i++) {
        
         if (actionVerbs[i] === line) {
            actionWordCommands(line)
            actionVerbBoolean = true //turns boolean true if an action verb is used
         }
      }

      //if its not an action word then we can assume the word is a direction that leads us into a new room
      if (actionVerbBoolean === false) {
         let roomName = currentRoom.getName(line);
         if (roomName === undefined) {
             console.log("I don't understand that response.");
          } else {
             currentRoom = rooms[roomName];
          }
          describeRoom();  
      }
   }

   //this function contains the commands that are run if a specific action word is typed in by the user
   function actionWordCommands(line) {
      switch (line) {
         case "look":
            currentRoom.printLongDescription();
            console.requestInput("> ", checkAnswer);
            break;
   
         case "help":
            printHelp();
            console.requestInput("> ", checkAnswer);
            break;
            
         case "quit":
            return
            break;

      }
   }
	

   let game = { };
   

/*
 * Method: play
 * Usage: game.play();
 * -------------------
 * Plays the Adventure game.
 */

   game.play = function() {
      describeRoom()
   };

   return game;
}

/*
 * This constant defines the instructions for the adventure game so that
 * you don't have to retype it.  Make sure that you add additional lines
 * to HELP_TEXT to describe any extensions you've added for the contest.
 */

const HELP_TEXT = [
   "Welcome to Adventure!",
   "Somewhere nearby is Colossal Cave, where others have found fortunes in",
   "treasure and gold, though it is rumored that some who enter are never",
   "seen again.  Magic is said to work in the cave.  I will be your eyes",
   "and hands.  Direct me with natural English commands; I don't understand",
   "all of the English language, but I do a pretty good job.",
   "",
   "It's important to remember that cave passages turn a lot, and that",
   "leaving a room to the north does not guarantee entering the next from",
   "the south, although it often works out that way.  You'd best make",
   "yourself a map as you go along.",
   "",
   "Much of my vocabulary describes places and is used to move you there.",
   "To move, try words like IN, OUT, EAST, WEST, NORTH, SOUTH, UP, or DOWN.",
   "I also know about a number of objects hidden within the cave which you",
   "can TAKE or DROP.  To see what objects you're carrying, say INVENTORY.",
   "To reprint the detailed description of where you are, say LOOK.  If you",
   "want to end your adventure, say QUIT."
];

function printHelp() {
   // this function loops so that every sentance in HELP_TEXT array is printed out neatly without commas breaking up every phrase
   for (let i = 0; i<HELP_TEXT.length; i++)
      console.write(HELP_TEXT[i] + "<br/>");
};
