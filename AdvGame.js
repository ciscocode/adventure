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
   let gameStatus = "" 

   //distirbute objects into their respective rooms
   distributeObjects(objects,rooms,inventory)

   let element = document.getElementById("GameData");
   if (element === null) return undefined;

   // The game starts outside the building
   let currentRoom = rooms["OutsideBuilding"];
   
   //this function describes a room when you visit it
	function describeRoom() {
     
      //after you visit a room once the game should only print the short description the next time you visit
      if (currentRoom.hasBeenVisited()) { 
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
   function checkAnswer(lineInput) {

      let actionVerbs = ["quit","help","look","take","drop","inventory","cheat"] //this is a list of actionverbs
      let actionVerbBoolean = false // begin as false. if we happen to identify a word as an actionVerb then we can make this true
      
      lineInput = lineInput.toLowerCase() //made the input line lowercase
      lineInput = lineInput.split(" ") //if multiple words are entered split them into an array
      checkSynonyms(lineInput,synonyms) //check for synonyms first
      objectInput = lineInput[1] //use this for now
      lineInput = lineInput[0] //input the first word

      //run this look to check if the word you used is in fact an action word
      for (let i=0; i<actionVerbs.length; i++) {
        
         if (actionVerbs[i] === lineInput) {
            actionWordCommands(lineInput)
            actionVerbBoolean = true //turns boolean true if an action verb is used
         }
      }

      //if its not an action word then we can assume the word is a direction that leads us into a new room
      if (actionVerbBoolean === false) {
         let passages = currentRoom.getPassages()
         let nextRoom;
         let key;

         findPassage(lineInput,passages,nextRoom,key,inventory) 

         //if the game is over then end the function
         if (gameStatus === "Game Over") {
            console.log("Game Over")
            return
         }
         describeRoom();  
      }
   }

   function findPassage(lineInput,passages,nextRoom,key,inventory) {
      
      lengthOfPassageArray = passages.length

      let arrayOfMatchingDirectionPassagesIndecies = []
      let keyArray = [] //this array will hold the keys of passages that have matching directions
      let destinationIndex //this variable will hold the index of my destination
      let matchingIndexOfKeyArray = null
      
      for (let i=0; i<lengthOfPassageArray; i++) {

         //if input matches a direction in the passage array
         if (lineInput === passages[i].getDirection()) { 
            destinationIndex = i            

            //this array holds the possible passages. I know they are possible passages because their direction matches my input
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

      if (passages[destinationIndex] !== undefined) {
      nextRoom = passages[destinationIndex].getDestinationRoom()
      }

      let roomName = nextRoom
      if (roomName === undefined) {
          console.log("I don't understand that response.");
       } else {
          currentRoom = rooms[roomName];
       }
     
      //after moving the player to the next room I must check for forced passages
      let currentRoomPassages = currentRoom.getPassages()
      forcedPassages(currentRoomPassages, inventory, rooms )         
   }

   //this function find the possible forced passages for a room, and selects the correct passage for the player depending on whether or not the player is holding the correct key
   function forcedPassages(currentRoomPassages, inventory, rooms) {

       //if the passage of the room is forced
      if (currentRoomPassages[0].getDirection() === "forced") { //a forced passage will always be identified in the first index of the passage array
         
         //before entering a forced passage describe the current room you just entered 
         describeRoom()
         
         let indexOfForcedPassage 

         //if there is only one forced passage then the index will be 0 because there is only one passage
         if (currentRoomPassages.length === 1)  {
            // console.log("puppy")
            indexOfForcedPassage = 0
         }  

         else {
            //if I have items in my inventory
            if (inventory.length > 0) {
               
               //then I will loop through my inventory to see if those items match a key of a forced passage
               for (let j=0; j<inventory.length; j++) {
                     
                  //if there is in fact a key attached to the passage
                  if (currentRoomPassages[0].getKey() !== undefined) {
                        
                     //check to see if the items in your inventory match the key
                     if (inventory[j].getName().toLowerCase() === currentRoomPassages[0].getKey().toLowerCase()) {
                        indexOfForcedPassage = 0
                        break
                     }
                     //if it doesnt match the key then the index of the forced key is 1
                     else {
                        indexOfForcedPassage = 1
                     }
                  }
               }
            }

            //if a person doesn't have an item then the forced index is one. All forced passages with items have an index of 0
            else {
               indexOfForcedPassage = 1
           } 
         } 
         
         //if the destination of the room you are entering is called "EXIT" then you have either won or lost the game
         if (currentRoomPassages[indexOfForcedPassage].getDestinationRoom() === "EXIT") {
            gameStatus = "Game Over"
            return
         }

         //use the newly found index of forced passage to change the value of your current room
         currentRoom = rooms[currentRoomPassages[indexOfForcedPassage].getDestinationRoom()]

         //if your forced passage leads you to a room with another forced passage, then you can run the function again
         if (currentRoom.getPassages()[0].getDirection() === "forced") {
            currentRoomPassages = currentRoom.getPassages()
            forcedPassages(currentRoomPassages, inventory, rooms)
         } 
      } 
   }

   //this function contains the commands that are run if a specific action word is typed in by the user
   function actionWordCommands(lineInput) {
      switch (lineInput) {
         case "look":
            currentRoom.printLongDescription();
            currentRoom.describeObjects()
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

         case "drop":
            dropObject(objectInput,currentRoom,objects,inventory)
            console.requestInput("> ", checkAnswer);
            break;

         case "inventory":
            printInventory(inventory)
            console.requestInput("> ", checkAnswer);
            break;

         //this is a potentially useful feature to add all objects in the room. it is not fully worked out yet.
         case "cheat":
            cheatCode(objects,inventory);
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

//this function allows you to take an object from a room and stores it inside your inventory
function takeObject(objectInput,objects,currentRoom,inventory) {
   let arrayOfObjects = Object.values(objects)
   let arrayOfObjectNames = Object.keys(objects)

   //if there was in face an input then you can make it capital letters
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
   }
   else {
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

   //this loop searches through the inventory to see if the object defined above is in the inventory
   for (let i=0; i<inventory.length; i++) {
      if (object === inventory[i]) {
         inventory.splice(i,1) //remove the object from the inventory array
         currentRoom.addObject(object) //add the object to the current room
         console.log("Dropped.")
      }
      else {
         console.log("That item is not in your inventory.")
      }
   }
}

//this function allows the user to print the current inventory the player is holding
function printInventory(inventory) {
   let inventoryDescriptions = []

   //this adds the description of each item to the inventory description array
   for (let i=0; i<inventory.length; i++) {
      let description = inventory[i].getDescription() 
      inventoryDescriptions.push(description)
   }
   if (inventory.length > 0) {
      console.log("You are carrying:" )
      for (let i = 0; i<inventoryDescriptions.length; i++)
         console.write(inventoryDescriptions[i] + "<br/>");
      }
   else {
      console.log("You are empty-handed.")
   }
}

function distributeObjects(objects,rooms,inventory) {
   //use a for loop.. loop through the objects
   //first read the post it and the location name
   // then push the object into the room when location matches room name //!! PLAYER is not a room!

   let numOfObjects = Object.keys(objects).length 
   let arrayOfObjects = Object.values(objects)
   let arrayOfRoomNames = Object.keys(rooms)
   let arrayOfRoomObjects = Object.values(rooms)

   for (let i=0; i<numOfObjects; i++) {
      let locationsOfObjects = arrayOfObjects[i].getLocation() //this takes the location from an object at an index

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

//potential feature for future iteration of the program. not Fully coplete yet
function cheatCode(objects,inventory) {
   console.log("you're cheating")
   let arrayOfObjects = Object.values(objects)
   for (let i=0; i<arrayOfObjects.length; i++) {
      inventory.push(arrayOfObjects[i])
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
