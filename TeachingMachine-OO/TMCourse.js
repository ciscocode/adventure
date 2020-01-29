/*
 * File: TMCourse.js
 * -----------------
 * This class defines the data structure for a course for use with
 * the TeachingMachine program.
 */

/*
 * Creates a TMCourse object by extracting data from 
 * the index.html file.
 */

function TMCourse() {
   let questions = readQuestions();
	if (questions === undefined) return undefined;
	let currentQuestion = questions["START"];
	
	function askQuestion() {
	   currentQuestion.printQuestionText();
	   console.requestInput("> ", checkAnswer);
	}

   function checkAnswer(line) {
      let questionID = currentQuestion.getNextQuestion(line);
     	if (questionID === "EXIT") return;
     	if (questionID === undefined) {
         console.log("I don't understand that response.");
      } else {
         currentQuestion = questions[questionID];
      }
      askQuestion();
   }
	
	let course = {};
	course.run = askQuestion;
	return course;
}
