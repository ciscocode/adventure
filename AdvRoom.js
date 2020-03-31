/*
 * File: AdvRoom.js
 * ----------------
 * This file defines a class that models a single room in Adventure.
 * Each room is characterized by the following properties:
 *
 * - The room name, which uniquely identifies the room
 * - The short description
 * - The multiline long description
 * - The passage table specifying the exits and where they lead
 * - A list of objects contained in the room
 * - A flag indicating whether the room has been visited
 *
 * The XML format for a room is described in the assignment.
 */

"use strict";

// The definition of the AdvRoom class includes the header lines
// of the methods you need to implement, but not the actual code.

/*
 * Factory method: AdvRoom
 * Usage: let room = AdvRoom(name, shortDescription, longDescription, passages)
 * ----------------------------------------------------------------------------
 * Creates an AdvRoom object from the specified properties.
 */

function AdvRoom(name, shortDescription, longDescription, passages) {

   let room = { };
   let objectArray = []; //this is an Array of AdvObject values
   room.objectArray = objectArray //add the array as a propery 

/*
 * Method: getName
 * Usage: let name = room.getName();
 * ---------------------------------
 * Returns the name of the room.
 */


room.getName = function(name) {
   // You fill this in as part of Milestone #1
   let match = passages[name.toLowerCase()];
   if (match === undefined) match = name["*"];
	return match;
};

//prints description initially
/*room.printDescription = function() {
   console.write(longDescription + "<br/>");
};*/

/*
 * Method: printShortDescription
 * Usage: room.printShortDescription();
 * ------------------------------------
 * Prints the short description of the room.  If no short description
 * exists, this method prints the long description.
 */

   room.printShortDescription = function() {
      // You fill this in as part of Milestone #2
      console.write(shortDescription + "<br/>");
   };

/*
 * Method: printLongDescription
 * Usage: room.printLongDescription();
 * -----------------------------------
 * Prints the long description of the room, which may consist of several
 * lines.
 */

   room.printLongDescription = function() {
      // You fill this in as part of Milestone #1
      for (let i = 0; i<longDescription.length; i++)
         console.write(longDescription[i] + "<br/>");
   };

/*
 * Method: getNextRoom
 * Usage: let nextRoomName = room.getNextRoom(dir);
 * ------------------------------------------------
 * Returns the name of the next room that comes from following the passage
 * in the indicated direction.  If no direction applies, this function
 * returns the constant undefined.
 */

   room.getNextRoom = function(dir) {
      // You fill this in as part of Milestone #1
      // In Milestone #7, you will move this method to AdvGame.js and
      // replace it with a getPassages method

      let passages = { };
      let elements = dir.getElementsByTagName("passage");
      for (let i = 0; i < elements.length; i++) {
         let passageXML = elements[i];
         let direction = passageXML.getAttribute("dir");
         let nextRoom = passageXML.getAttribute("room");
         passages[direction.toLowerCase()] = nextRoom;
      }
      return passages;
   };

/*
 * Method: setVisited
 * Usage: room.setVisited(flag);
 * -----------------------------
 * Sets an internal flag in the room that determines whether it has been
 * visited.  The Boolean argument flag must be either true or false.
 */

   let flagVisited; //create a variable that tells you whether or not a room has been visited

   room.setVisited = function(flag) {
      // You fill this in as part of Milestone #2
      //set the parameter (which will be true) when you call the function to flagvisited
      flagVisited = flag 

   };

/*
 * Method: hasBeenVisited
 * Usage: if (room.hasBeenVisited()) . . .
 * ---------------------------------------
 * Returns true if the room has been visited, and false otherwise.
 */

   room.hasBeenVisited = function() {
      // You fill this in as part of Milestone #2
      return flagVisited
   };

/*
 * Method: describeObjects
 * Usage: room.describeObjects();
 * ------------------------------
 * Describes the objects that exist in the room.
 */

   room.describeObjects = function() {
      // You fill this in as part of Milestone #4
      for (let i=0; i<objectArray.length; i++) {
         console.write("There is " + objectArray[i].getDescription() + "here." + "<br/>");
      }
   };

/*
 * Method: addObject
 * Usage: room.addObject(obj);
 * ---------------------------
 * Adds the specified object to the list of objects in the room.
 */

   room.addObject = function(obj) {
      // You fill this in as part of Milestone #4
      objectArray.push(obj)
   };

/*
 * Method: removeObject
 * Usage: room.removeObject(obj);
 * ------------------------------
 * Removes the specified object from the list of objects in the room.
 */

   room.removeObject = function(obj) {
      // You fill this in as part of Milestone #4
      //refactor to use filter. Splice mutates the array. 
      for (let i=0; i<objectArray.length; i++) {
         if (objectArray[i] === obj) { 
            objectArray.splice(i,1)
         }
      }
   };

/*
 * Method: contains
 * Usage: if (room.contains(obj)) . . .
 * ------------------------------------
 * Returns true if the room contains the specified object.
 */

   room.contains = function(obj) {
      // You fill this in as part of Milestone #4
      for (let i=0; i<objectArray.length; i++) {
         if (obj === objectArray[i]) {
            return true
         }
         else {
            return false
         }
      }
   };

/*
 * Method: toString
 * Usage: (usually called implicitly)
 * ----------------------------------
 * Returns the string form of the AdvRoom.
 */

   room.toString = function() {
      return "<AdvRoom:" + name + ">";
   };

   return room;

}

/*
 * Function: readRooms
 * Usage: let rooms = readRooms();
 * -------------------------------
 * Creates a map for the rooms by reading all the room tags from the
 * XML data for the game.  The keys in the map are the room names,
 * and the values are the AdvRoom objects that contain the data for
 * the corresponding room.  To ensure that the game starts with the
 * first room in the XML data, the map also stores a reference to the
 * first room under the name "START".
 *
 * Your implementation will benefit **greatly** from using the
 * getLongDescription function supplied below.
 */

function readRooms() {
   // You fill this in as part of Milestone #1
   let elements = document.getElementsByTagName("room");
   if (elements.length === 0) return undefined;
   let rooms = {};
   for (let i = 0; i < elements.length; i++) {
      let roomXML = elements[i];
      let name = roomXML.getAttribute("name");
      //let room = roomXML.innerHTML; //do I need this?
      let shortDescription = roomXML.getAttribute("short");
      let passages = readPassages(roomXML);
      let longDescription = getLongDescription(roomXML)
      rooms[name] = AdvRoom(name, shortDescription, longDescription, passages)
      if (i === 0) rooms["START"] = rooms[name];
   }
   return rooms;
}

function readPassages(roomXML) {
   let passages = { };
   let elements = roomXML.getElementsByTagName("passage");
   for (let i = 0; i < elements.length; i++) {
      let passageXML = elements[i];
      let direction = passageXML.getAttribute("dir");
      let nextRoom = passageXML.getAttribute("room");
      passages[direction.toLowerCase()] = nextRoom;
   }
   return passages;
}

/*
 * Function: getLongDescription
 * ----------------------------
 * This is a convenience function that can be used to extract
 * all of the visible lines of room.innerHTML and return them
 * in an array.  So, if the roomXML looks like this:
 *
 *   <room name="OutsideBuilding" short="Outside building">
 *     You are standing at the end of a road before a small brick
 *     building.  A small stream flows out of the building and
 *     down a gully to the south.  A road runs up a small hill
 *     to the west.
 *     <passage dir="WEST" room="EndOfRoad" />
 *     <passage dir="UP" room="EndOfRoad" />
 *     <passage dir="NORTH" room="InsideBuilding" />
 *     <passage dir="IN" room="InsideBuilding" />
 *     <passage dir="SOUTH" room="Valley" />
 *     <passage dir="DOWN" room="Valley" />
 *   </room>
 * 
 * then getLongDescription(roomXML) would return an array of length
 * 4 that looks like this:
 *
 *   ["You are standing at the end of a road before a small brick",
 *    "building.  A small stream flows out of the building and",
 *    "down a gully to the south.  A road runs up a small hill",
 *    "to the west."]
 *
 * One can then iterate over this array and use console.log to print each line.
 */
function getLongDescription(roomXML) {
	let lines = [];
	let raw = roomXML.innerHTML.split("\n");
	while (raw.length > 0) {
		let line = raw.shift().trim();
		if (line.length > 0 && !line.startsWith("<")) {
			lines.push(line);
		}
	}
	return lines;
}
