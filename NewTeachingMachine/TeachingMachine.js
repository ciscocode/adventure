/*
 * File: TeachingMachine.js
 * ------------------------
 * This program executes a programmed instruction course.
 */

function TeachingMachine() {
   let course = TMCourse();
   if (course === undefined) {
      console.log("No course is defined in the HTML file");
   } else {
      course.run();
   }
}
