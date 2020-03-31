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


function AdvGame() {

   //begin by reading xml/html data to create the rooms, objects, and synonyms necessary to play the game
   let rooms = readRooms()
   let objects = readObjects()
   let synonyms = readSynonyms()
   let inventory = []

   //distirbute objects into their respective rooms
   distributeObjects(objects,rooms)

   let element = document.getElementById("GameData");
   if (element === null) return undefined;

   // You write the code that initializes the state of the game
   let currentRoom = rooms["START"];
   
      
   //this function describes a room when you visit it
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
      
      let actionVerbs = ["quit","help","look","take","drop","inventory"] //this is a list of actionverbs
      let actionVerbBoolean = false // begin as false. if we happen to identify a word as an actionVerb then we can make this true
      
      line = line.toLowerCase() //made the input line lowercase
      line = line.split(" ") //if multiple words are entered split them into an array
      checkSynonyms(line) //check for synonyms first
      objectInput = line[1] //use this for now
      line = line[0] //input the first word
      //console.log(line)

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

         case "take":
            takeObject(objectInput,objects,currentRoom,inventory)
            console.requestInput("> ", checkAnswer);
            break;
            
         case "quit":
            return
            break;    

      }
   }

   //this functions checks your input to see if it has a synonym. if there is a synonym it replaces your input with the definition
   function checkSynonyms(line) {
      let arrayOfSynonyms = Object.keys(synonyms)
      let arrayOfSynonymsLowerCase = []
      let arrayOfSynonymObjects = Object.values(synonyms)

      //this loop creates an array that has the synonyms in lower case
      for (let i=0; i<arrayOfSynonyms.length; i++) {
        arrayOfSynonymsLowerCase[i] = arrayOfSynonyms[i].toLowerCase()
      }

      //this loop checks every word input in the line to see if it is a synonym
      for (let i=0; i<line.length; i++) {
         for (let j=0; j<arrayOfSynonyms.length; j++) {
            if (line[i] === arrayOfSynonymsLowerCase[j]) { // if the a word in the input matches a synonym
               line[i] = arrayOfSynonymObjects[j].getDefinition() // then replace the value of the input line with the definition of the synonym
               line[i] = line[i].toLowerCase() //this brings the word back to lowercase after it has been shifted to capital with the synonym change
            }
         } 
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

function takeObject(objectInput,objects,currentRoom, inventory) {
   let arrayOfObjects = Object.values(objects)
   let arrayOfObjectNames = Object.keys(objects)

   objectInput = objectInput.toUpperCase() //turn the input into uppercase so it can match the names of the objects
   let indexOfObject //initialize variable now

   //this loop allows me to find the index of the object according to its name
   for (let i=0; i<arrayOfObjects.length; i++) {
      if (objectInput === arrayOfObjectNames[i]) {
         indexOfObject = i 
      }
   }

   //take the index and find the object
   let object = arrayOfObjects[indexOfObject]
   
   if (currentRoom.contains(object)) { //if the room contains the object then remove the object from the room and place it in your inventory
      console.log("Taken");
      currentRoom.removeObject(object) 
      inventory.push(object)
   }
   else {
      console.log("that item is not in this room")
   }
}

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

//tbis function creates a synonym object 
function AdvSynonym(word, definition) {
   let synonymObject = { };

   synonymObject.getWord = function(word) {
      return word
   };
   synonymObject.getDefinition = function() {
      return definition
   };
   synonymObject.toString = function() {
      return "<AdvObject:" + word + ">";
   };

   return synonymObject;
}

// Creates a map from synonyms by reading the XML data from the <synonym> tags.
function readSynonyms() {
   let elements = document.getElementsByTagName("synonym");
   if (elements.length === 0) return undefined;
   let synonymObjects = {};
   for (let i = 0; i < elements.length; i++) {
      let objectXML = elements[i];
      let word = objectXML.getAttribute("word");
      let definition= objectXML.getAttribute("definition");
      synonymObjects[word] = AdvSynonym(word, definition)
   }
   return synonymObjects;
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
