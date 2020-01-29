/**
 * File: TeachingMachine.js
 * ------------------------
 * This program serves as the entry point to a more 
 * object-oriented realization of the teaching machine
 * discussed in the textbook, and will serve as a much 
 * better template for your Adventure assignment than the
 * version in the course reader.
 */

function TeachingMachine() {
   let course = TMCourse();
   if (course === undefined) {
      console.log("No course is defined in the HTML file");
   } else {
      course.run();
   }
}
