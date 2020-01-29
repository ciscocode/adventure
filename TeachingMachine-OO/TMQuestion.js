/**
 * File: TMQuestion.js
 * -------------------
 * This class defines the data structure that represents a single question.
 */

/**
 * Class: TMQuestion
 * -----------------
 * This class represents a question for the teaching machine.
 * Intuitively, a TMQuestion object encapsulates 
 *   
 *  + the HTML markup text that should be published 
 *.   using console.write, and
 *  + a map from each expected answer to the id
 *.   of the next question.
 * 
 * The supplied parameters are private to the implementation
 * and are only accessed by invoked TMQuestion methods.
 */

function TMQuestion(html, answers) {
	let question = {};
	question.printQuestionText = function() {
		console.write(html + "<br/>");
	};
	question.getNextQuestion = function(answer) {
		let match = answers[answer.toLowerCase()];
		if (match === undefined) match = answers["*"];
		return match;
	};
	return question;
}

/**
 * Creates the questions data structure by reading the elements
 * with the tag "question" from the XML for the course.  To ensure
 * that the course starts with the first question in the file, the
 * map stores a reference to that question under the key "START".
 */
function readQuestions() {
   let elements = document.getElementsByTagName("question");
	if (elements.length === 0) return undefined;
   let questions = {};
   for (let i = 0; i < elements.length; i++) {
      let questionXML = elements[i];
      let id = questionXML.getAttribute("id");
      let html = questionXML.innerHTML;
      let answers = readAnswers(questionXML);
      questions[id] = TMQuestion(html, answers);
      if (i === 0) questions["START"] = questions[id];
   }
   return questions;
}

/**
 * Reads the data structure containing the answers, which maps
 * user responses to the DOM id of the next question.
 */
function readAnswers(questionXML) {
   let answers = { };
   let elements = questionXML.getElementsByTagName("answer");
   for (let i = 0; i < elements.length; i++) {
      let answerXML = elements[i];
      let response = answerXML.getAttribute("response");
      let nextQuestion = answerXML.getAttribute("nextQuestion");
      answers[response.toLowerCase()] = nextQuestion;
   }
   return answers;
}
