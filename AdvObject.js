/*
 * File: AdvObject.js
 * ------------------
 * This file defines a class that models an object in Adventure.
 * Each object is characterized by the following properties:
 *
 * - The object name, which is the noun used to refer to the object
 * - The object description, which is a one-line string
 * - The name of the room in which the object initially lives
 *
 * The XML format for an object is described in the assignment.
 */

"use strict";

// The definition of the AdvObject class includes the header lines
// of the methods you need to implement, but not the actual code.
// You need to fill the definitions in as part of Milestone #4.

/*
 * Factory method: AdvObject
 * Usage: let obj = AdvObject(name, description, location);
 * --------------------------------------------------------
 * Creates an AdvObject from the specified properties.
 */

function AdvObject(name, description, location) {

   let obj = { };

/*
 * Method: getName
 * Usage: let name = obj.getName();
 * --------------------------------
 * Returns the name of this object.
 */

   obj.getName = function(name) {
      // You write this method
      let match = objects[name.toLowerCase()];
      if (match === undefined) match = name["*"];
      return match;
   };

/*
 * Method: getDescription
 * Usage: let description = obj.getDescription();
 * ----------------------------------------------
 * Returns the description of this object.
 */

   obj.getDescription = function(objectXML) {
      // You write this method
      let description = objectXML.innerHTML
      return description

   };

/*
 * Method: getLocation
 * Usage: let roomName = obj.getLocation();
 * ----------------------------------------
 * Returns the name of the room in which this object initially lives.
 */

   obj.getLocation = function(objectXML) {
      // You write this method
      let location = objectXML.getAttribute("location");
      return location
   };

/*
 * Method: toString
 * Usage: (usually called implicitly)
 * ----------------------------------
 * Returns the string form of the AdvObject.
 */

   obj.toString = function() {
      return "<AdvObject:" + name + ">";
   };

   return obj;

}

/*
 * Function: readObjects
 * Usage: let objects = readObjects();
 * ----------------------------------
 * Creates a map from object names to objects by reading the XML data
 * from the <object> tags.
 */

function readObjects() {
   // You fill in the code
   let elements = document.getElementsByTagName("object");
   if (elements.length === 0) return undefined;
   let objects = {};
   for (let i = 0; i < elements.length; i++) {
      let objectXML = elements[i];
      let name = objectXML.getAttribute("name");
      let object = objectXML.innerHTML; //do I need this?
      let location = objectXML.getAttribute("location");
      //let passages = readPassages(objectXML);
      let description = getDescription(objectXML)
      objects[name] = AdvObject(name, description, location)
      //if (i === 0) rooms["START"] = rooms[name];
   }
   return objects;
}
