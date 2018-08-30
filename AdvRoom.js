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

/*
 * Method: getName
 * Usage: let name = room.getName();
 * ---------------------------------
 * Returns the name of the room.
 */

   room.getName = function() {
      // You fill this in as part of Milestone #1
   };

/*
 * Method: printShortDescription
 * Usage: room.printShortDescription();
 * ------------------------------------
 * Prints the short description of the room.  If no short description
 * exists, this method prints the long description.
 */

   room.printShortDescription = function() {
      // You fill this in as part of Milestone #2
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
   };

/*
 * Method: setVisited
 * Usage: room.setVisited(flag);
 * -----------------------------
 * Sets an internal flag in the room that determines whether it has been
 * visited.  The Boolean argument flag must be either true or false.
 */

   room.setVisited = function(flag) {
      // You fill this in as part of Milestone #2
   };

/*
 * Method: hasBeenVisited
 * Usage: if (room.hasBeenVisited()) . . .
 * ---------------------------------------
 * Returns true if the room has been visited, and false otherwise.
 */

   room.hasBeenVisited = function() {
      // You fill this in as part of Milestone #2
   };

/*
 * Method: describeObjects
 * Usage: room.describeObjects();
 * ------------------------------
 * Describes the objects that exist in the room.
 */

   room.describeObjects = function() {
      // You fill this in as part of Milestone #4
   };

/*
 * Method: addObject
 * Usage: room.addObject(obj);
 * ---------------------------
 * Adds the specified object to the list of objects in the room.
 */

   room.addObject = function(obj) {
      // You fill this in as part of Milestone #4
   };

/*
 * Method: removeObject
 * Usage: room.removeObject(obj);
 * ------------------------------
 * Removes the specified object from the list of objects in the room.
 */

   room.removeObject = function(obj) {
      // You fill this in as part of Milestone #4
   };

/*
 * Method: contains
 * Usage: if (room.contains(obj)) . . .
 * ------------------------------------
 * Returns true if the room contains the specified object.
 */

   room.contains = function(obj) {
      // You fill this in as part of Milestone #4
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
 * Usage: let rooms = readRooms(gameXML);
 * --------------------------------------
 * Creates a map for the rooms by reading all the room tags from the
 * XML data for the game.  The keys in the map are the room names,
 * and the values are the AdvRoom objects that contain the data for
 * the corresponding room.  To ensure that the game starts with the
 * first room in the XML data, the map also stores a reference to the
 * first room under the name "START".
 */

function readRooms(gameXML) {
   // You fill this in as part of Milestone #1
}
