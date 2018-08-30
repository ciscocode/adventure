/*
 * File: TMCourse.js
 * -----------------
 * This class defines the data structure for a course for use with
 * the TeachingMachine program.
 */

/*
 * Factory method: TMCourse
 * Usage: let course = TMCourse();
 * -------------------------------
 * Creates a TMCourse object by reading data from the CourseData element
 * in the index.html file.
 */

function TMCourse() {
   let element = document.getElementById("CourseData");
   if (element === undefined) return undefined;
   let questions = readQuestions(element);
   let currentQuestion = questions["START"];

/*
 * Function: askQuestion
 * Usage: askQuestion();
 * ---------------------
 * Asks the current question and then waits for a response.
 */

   function askQuestion() {
      currentQuestion.printQuestionText();
      console.requestInput("> ", checkAnswer);
   }

/*
 * Function: checkAnswer
 * Usage: checkAnswer(line);
 * -------------------------
 * Checks the user's answer and moves to the appropriate next question.
 * The line is the string entered by the user.
 */

   function checkAnswer(line) {
      let nextQuestionName = currentQuestion.getNextQuestion(line);
      if (nextQuestionName === undefined) {
         console.log("I don't understand that response.");
      } else {
         if (nextQuestionName === "EXIT") return;
         currentQuestion = questions[nextQuestionName];
      }
      askQuestion();
   };

   let course = { };

/*
 * Exported method: run
 * --------------------
 * Runs through the programmed instruction course.
 */

   course.run = function() {
      askQuestion();
   };

   return course;

}
