/*
 * File: AdvGame.js
 * ----------------
 * This file defines the AdvGame class, which records the information
 * necessary to play a game. Your job is to complete the implementation
 * of this file in stages as described in the "Milestones" section of
 * the assignment handout.
 */

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

/*
 * Factory method: AdvGame
 * Usage: let game = AdvGame();
 * ----------------------------
 * Creates an AdvGame object by reading data from the GameData element
 * in the index.html file.
 */

function AdvGame() {
   //begin by reading xml/html data to create the rooms, objects, and synonyms necessary to play the game
   let rooms = readRooms()
   let objects = readObjects()
   let synonyms = readSynonyms()
   let inventory = []

   //distribute objects into their respective rooms
   distributeObjects(objects,rooms,inventory)

   let element = document.getElementById("GameData");
   if (element === null) return undefined;

   // The game starts outside the building
   let currentRoom = rooms["OutsideBuilding"];
   
   //this function describes a room and its objects when you visit it
	function describeRoomAndObjects(currentRoom) {

      //during the first visit of a room print the long description
      //second visit of a room - print the short description
      if (currentRoom.hasBeenVisited()) { 
         currentRoom.printShortDescription()   
      } else {
         currentRoom.printLongDescription();
      }
      //set flag as true, after visiting the room tell the room it has been visited.
      currentRoom.setVisited(true)  
      
      //describe the current rooom and its objects
      currentRoom.describeObjects()

      //ask the user for another line to input
      console.requestInput("> ", checkInput); 
   }
   
   //this function checks the line the user inputs.
   function checkInput(lineInput) {

      let actionVerbs = ["quit","help","look","take","drop","inventory","cheat"] //this is a list of actionverbs
      let actionVerbBoolean = false // begin as false. if we happen to identify a word as an actionVerb then we can make this true
      
      lineInput = lineInput.toLowerCase() //make input lowercase
      lineInput = lineInput.split(" ") //if multiple words are entered split them into an array
      checkSynonyms(lineInput,synonyms) //check for synonyms first
      objectInput = lineInput[1] //the object in a command like "take water" or "drop water" will always be second in the array
      lineInput = lineInput[0] //input the first word in the array

      //this loop checks to see if my input is an action verb
      for (let i=0; i<actionVerbs.length; i++) {
         if (actionVerbs[i] === lineInput) {
            actionWordCommands(lineInput)
            actionVerbBoolean = true 
         }
      }

      //if the input is not an action word then treat it as a direction
      if (actionVerbBoolean === false) {
         let passages = currentRoom.getPassages()
         let nextRoom;
         let key;

         //use the input/direction to find the passage and send the character to the next room
         currentRoom = findPassageAndRoom(lineInput,passages,nextRoom,key,inventory,currentRoom,rooms,describeRoomAndObjects) 

         //if the game is over then call my endgame function. 
         if (currentRoom === "Game Over") {
            console.requestInput("> ", endGame)
            return
         }

         //otherwise describe the state of the new room and the objects within it
         describeRoomAndObjects(currentRoom);    
      }
   }

   //this function contains the commands that are run if a specific action word is typed in by the user
   function actionWordCommands(lineInput) {
      switch (lineInput) {
         case "look":
            currentRoom.printLongDescription();
            currentRoom.describeObjects()
            console.requestInput("> ", checkInput);
            break;
   
         case "help":
            printHelp();
            console.requestInput("> ", checkInput);
            break;

         case "take":
            takeObject(objectInput,objects,currentRoom,inventory)
            console.requestInput("> ", checkInput);
            break;

         case "drop":
            dropObject(objectInput,currentRoom,objects,inventory)
            console.requestInput("> ", checkInput);
            break;

         case "inventory":
            printInventory(inventory)
            console.requestInput("> ", checkInput);
            break;

         //cheat code that gives you every item. it could use more work though 
         //b/c it doesnt take into account that object have already been distributed into rooms
         case "cheat":
            cheatCode(objects,inventory);
            console.requestInput("> ", checkInput);
            break;
            
         case "quit":
            console.requestInput("> ", endGame)
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
      describeRoomAndObjects(currentRoom)
   };
   return game;
}

//this functin simply prints out a replay message if you lose
function endGame() {
   console.log("Refresh to play again!" )
   return
}

//this function find the possible forced passages for a room, and selects the correct passage for the player depending on whether or not the player is holding the correct key
function forcedPassages(currentRoomPassages,inventory,rooms) {
   //let oldRoom = currentRoom
   let indexOfForcedPassage 

   //if there is only one forced passage then the index will be 0 because there is only one passage
   if (currentRoomPassages.length === 1)  {
      indexOfForcedPassage = 0
   }  else {
      //if I have items in my inventory
      if (inventory.length > 0) {
         
         //then I will loop through my inventory to see if those items match a key of a forced passage
         for (let j=0; j<inventory.length; j++) {
            let foundMatch = false
               
            for (let i=0; i<currentRoomPassages.length; i++) {
   
               if (currentRoomPassages[i].getKey() !== undefined) {

                  //check to see if the items in your inventory match the key. if it matches the index is i b/c that index holds the key
                  // if it doesnt match the index of the forced passage is the last of the current room passages
                  if (inventory[j].getName().toLowerCase() === currentRoomPassages[i].getKey().toLowerCase()) {
                     indexOfForcedPassage = i
                     foundMatch = true
                     break
                  } else {
                     indexOfForcedPassage = currentRoomPassages.length - 1
                  }
               }   
            } 
            if (foundMatch === true) {
               break
            }   
         }
      } else {
         //if a person doesn't have an item then the forced index is the last one. All forced passages without keys are last.
         indexOfForcedPassage = currentRoomPassages.length - 1
      } 
   } 

   //use the newly found index of forced passage to change the value of your current room
    currentRoom = rooms[currentRoomPassages[indexOfForcedPassage].getDestinationRoom()]
    return currentRoom
}

//this function will find the correct passage for your character based on user input, and inventory
//it will then change the state of the current room based on the passage taken
function findPassageAndRoom(lineInput,passages,nextRoom,key,inventory,currentRoom,rooms,describeRoomAndObjects) {
      
   lengthOfPassageArray = passages.length

   let oldRoom = currentRoom //this variable will be returned in the event that the user inputs an incorrect direction. I want to be able to return what the old room was
   let arrayOfMatchingDirectionPassagesIndecies = []  //this array holds the possible passages for my character. 
   let keyArray = [] //this array will hold the keys of passages that have matching directions
   let destinationIndex //this variable will hold the index of my destination
   let matchingIndexOfKeyArray = null
      
   //run this loop to push possible passage indecies into my array
   for (let i=0; i<lengthOfPassageArray; i++) {
      //if input matches a direction in the passage array
      if (lineInput === passages[i].getDirection()) { 
         destinationIndex = i            
         arrayOfMatchingDirectionPassagesIndecies.push(i)
      }
   }

   //this loop creates an array of keys for the possible passages based on the user input
   for (let j=0; j<arrayOfMatchingDirectionPassagesIndecies.length; j++) {
      key = passages[arrayOfMatchingDirectionPassagesIndecies[j]].getKey()
      if (key === undefined) {
        key = null
      }
      keyArray.push(key)
   }

   if (inventory.length > 0) {
      //this loop checks my inventory. If an item in my inventory matches the key array, then I will get the index of that key array
      for (let i=0; i<inventory.length; i++) {
         for (let j=0; j<inventory.length; j++) {
            if (inventory[i].getName().toLowerCase() === keyArray[j]) {
               matchingIndexOfKeyArray = j
            }
         }
      }
   }

   //I can then take the index of my key array and use it to find the passage in my array of possible matching passages
   //I can then assign that value to my destination index
   if (matchingIndexOfKeyArray !== null) {
      destinationIndex = arrayOfMatchingDirectionPassagesIndecies[matchingIndexOfKeyArray]
   }

   //use my destination index to find my next room
   if (passages[destinationIndex] !== undefined) {
      nextRoom = passages[destinationIndex].getDestinationRoom()
   }

   //if the room is undefined return an error message and stay in the oldRoom
   //otherwise, change the value of currentRoom
   let roomName = nextRoom
   if (roomName === undefined) {
      console.log("I don't understand that response.");
      return currentRoom = oldRoom
      } else {
      currentRoom = rooms[roomName]; //changes value of the current room to the new room
         
      //after moving the player to the next room I must check for forced passages
      let currentRoomPassages = currentRoom.getPassages()
      if (currentRoomPassages[0].getDirection() === "forced") { //a forced passage will always be identified in the first index of the passage array
         describeRoomAndObjects(currentRoom); //before changing the room you must describe the current room

         //this conditional takes into account the scenario if you reach a room where your character loses
         if (currentRoom.getPassages()[0].getDestinationRoom() === "EXIT") {
            gameStatus = "Game Over"
            console.log(gameStatus)
            return gameStatus
         }
         
         //now you can redefine the current room based on the forced passages
         currentRoom = forcedPassages(currentRoomPassages,inventory,rooms) 

         //if your forced passage leads you to a room with another forced passage, then you can run the function again
         //I am using a while loop because the curtain passages will continue to force you into other curtains if you are holding certain items
         //until you finally get forced into the victory room
         while (currentRoom.getPassages()[0].getDirection() === "forced") {
            if (currentRoom.getPassages()[0].getDestinationRoom() === "EXIT") {
               break
            }
            describeRoomAndObjects(currentRoom);    
            currentRoomPassages = currentRoom.getPassages()
            currentRoom = forcedPassages(currentRoomPassages,inventory,rooms)
         } 
      } 
      return currentRoom
   }        
}

//this function allows you to take an object from a room and stores it inside your inventory
function takeObject(objectInput,objects,currentRoom,inventory) {
   let arrayOfObjects = Object.values(objects)
   let arrayOfObjectNames = Object.keys(objects)

   //if there was in fact an input then you can make it capital letters
   if (objectInput !== undefined) {
      objectInput = objectInput.toUpperCase() //turn the input into uppercase so it can match the names of the objects
   }
   
   //if there isnt an input then write an error message
   if (objectInput === undefined) {
      console.log("You didn't finish writing your sentence! What object should I take?")
      return
   }
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
      console.log("Taken.");
      currentRoom.removeObject(object) 
      inventory.push(object)
   } else {
      console.log("That item is not in this room.")
   }
}

//this function allows you to drop an item from your inventory into the current room the player is in
function dropObject(objectInput,currentRoom, objects, inventory) {
   let arrayOfObjects = Object.values(objects)
   let arrayOfObjectNames = Object.keys(objects)
   let indexOfObject

   //if there was in face an input then you can make it capital letters
   if (objectInput !== undefined) {
      objectInput = objectInput.toUpperCase() //turn the input into uppercase so it can match the names of the objects
   }

   //if there isnt an input then write an error message
   if (objectInput === undefined) {
      console.log("You didn't finish writing your sentence! What object should I drop?")
      return
   }

   //this loop allows us to find the index of the object according to its name
   for (let i=0; i<arrayOfObjectNames.length; i++) {
      if (objectInput === arrayOfObjectNames[i]) {
         indexOfObject = i
      }
   }

   let object = arrayOfObjects[indexOfObject]
   let inventoryBoolean = false

   //this loop searches through the inventory to see if the object defined above is in the inventory
   for (let i=0; i<inventory.length; i++) {
      if (object === inventory[i]) {
         inventory.splice(i,1) //remove the object from the inventory array
         currentRoom.addObject(object) //add the object to the current room
         console.log("Dropped.")
         inventoryBoolean = true
      }    
   }
   if (inventoryBoolean === false) {
      console.log("That item is not in your inventory.")
   }
}

//this function allows the user to print the current inventory the player is holding
function printInventory(inventory) {
   
   if (inventory.length > 0) {
      console.log("You are carrying:" )
      for (let i = 0; i<inventory.length; i++)
         console.write(inventory[i].getDescription() + "<br/>");
      }
   else {
      console.log("You are empty-handed.")
   }
}

//this function distributes objects into their respective rooms 
function distributeObjects(objects,rooms,inventory) {
   
   let numOfObjects = Object.keys(objects).length 
   let arrayOfObjects = Object.values(objects)
   let arrayOfRoomNames = Object.keys(rooms)
   let arrayOfRoomObjects = Object.values(rooms)

   for (let i=0; i<numOfObjects; i++) {
      let locationsOfObjects = arrayOfObjects[i].getLocation() 

      //first will distribute any objects belonging to the player straight into their inventory
      if (locationsOfObjects === "PLAYER") {
         inventory.push(arrayOfObjects[i])
      }

      //loop through my array of rooms. If the location of the object matches the name of the room, then I will add that object to that room
      for (let j=0; j<arrayOfRoomNames.length; j++) {
         let nameOfRoom = arrayOfRoomNames[j]
         if (locationsOfObjects === nameOfRoom) {
            arrayOfRoomObjects[j].addObject(arrayOfObjects[i])
         }
      }
   } 
}

//potential feature for future iteration of the program. it works but could use some tweaking
function cheatCode(objects,inventory) {
   console.log("you're cheating")
   let arrayOfObjects = Object.values(objects)
   for (let i=0; i<arrayOfObjects.length; i++) {
      inventory.push(arrayOfObjects[i])
   }
}

//this functions checks your input to see if it has a synonym. if there is a synonym it replaces your input with the definition
function checkSynonyms(lineInput,synonyms) {
   let arrayOfSynonyms = Object.keys(synonyms)
   let arrayOfSynonymsLowerCase = []
   let arrayOfSynonymObjects = Object.values(synonyms)

   //this loop creates an array that has the synonyms in lower case
   for (let i=0; i<arrayOfSynonyms.length; i++) {
     arrayOfSynonymsLowerCase[i] = arrayOfSynonyms[i].toLowerCase()
   }

   //this loop checks every word input in the line to see if it is a synonym
   for (let i=0; i<lineInput.length; i++) {
      for (let j=0; j<arrayOfSynonyms.length; j++) {
         if (lineInput[i] === arrayOfSynonymsLowerCase[j]) { // if the a word in the input matches a synonym
            lineInput[i] = arrayOfSynonymObjects[j].getDefinition() // then replace the value of the input line with the definition of the synonym
            lineInput[i] = lineInput[i].toLowerCase() //this brings the word back to lowercase after it has been shifted to capital with the synonym change
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
      synonymObjects[word] = AdvSynonym(word,definition)
   }
   return synonymObjects;
}

// this function loops so that every sentance in HELP_TEXT array is printed out neatly without commas breaking up every phrase
function printHelp() {
   for (let i = 0; i<HELP_TEXT.length; i++)
      console.write(HELP_TEXT[i] + "<br/>");
};
