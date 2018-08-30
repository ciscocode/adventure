/*
 * File: TMQuestion.js
 * -------------------
 * This class defines the data structure that represents a single question.
 */

/*
 * Class: TMQuestion
 * -----------------
 * This class represents a question for the teaching machine. Intuitively,
 * a TMQuestion object contains an array of strings representing the question
 * text and a map from each expected answer to the id of the next question.
 * The data fields, however, are private to the implementation and can be
 * manipulated only by calling the defined methods.
 */

/*
 * Factory method: TMQuestion
 * Usage: let question = TMQuestion(text, answers);
 * ------------------------------------------------
 * Creates a new TMQuestion object from the specified components.
 */

function TMQuestion(text, answers) {

   let question = { };

/*
 * Method: printQuestionText
 * Usage: question.printQuestionText();
 * ------------------------------------
 * Prints the text of the question on the console.
 */

   question.printQuestionText = function() {
      for (let i = 0; i < text.length; i++) {
         console.log(text[i]);
      }
   };

/*
 * Method: getNextQuestion
 * Usage: let nextQuestionName = question.getNextQuestion(answer);
 * ---------------------------------------------------------------
 * Looks up the answer in the response table for this question and
 * returns the name of the next question.  If the answer is not
 * recognized, this method returns the constant undefined.
 */

   question.getNextQuestion = function(answer) {
      return answers[answer.toLowerCase()];
   };

/*
 * Method: toString
 * Usage: let str = question.toString();
 * -------------------------------------
 * Returns an abbreviated string form of the question.
 */

   question.toString = function() {
      return "Question: " + text[0];
   };

   return question;

}

/*
 * Function: readQuestions
 * Usage: questions = readQuestions(courseXML);
 * --------------------------------------------
 * Creates the questions data structure by reading the elements
 * with the tag "question" from the XML for the course.  To ensure
 * that the course starts with the first question in the file, the
 * map stores a reference to that question under the key "START".
 */

function readQuestions(courseXML) {
   let tags = courseXML.getElementsByTagName("question");
   let questions = { };
   for (let i = 0; i < tags.length; i++) {
      let questionXML = tags[i];
      let name = questionXML.getAttribute("name");
      let text = readQuestionText(questionXML);
      let answers = readAnswers(questionXML);
      let question = TMQuestion(text, answers);
      if (i === 0) questions["START"] = question;
      questions[name] = question;
   }
   return questions;
}

/*
 * Function: readQuestionText
 * Usage: let questions = readQuestionText(questionXML);
 * -----------------------------------------------------
 * Reads the text of the question from the innerHTML of the
 * question, which contains all characters (including those
 * in tags) inside the <question> and </question> boundaries.
 */

function readQuestionText(questionXML) {
   let text = [ ];
   let lines = questionXML.innerHTML.split("\n");
   if (lines[0] === "") lines.shift();
   for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line.startsWith("<")) {
         text.push(line);
      }
   }
   return text;
}

/*
 * Function: readAnswers
 * Usage: let answers = readAnswers(questionXML);
 * ----------------------------------------------
 * Reads the data structure containing the answers, which maps
 * user responses to the name of the next question.
 */

function readAnswers(questionXML) {
   let answers = { };
   let tags = questionXML.getElementsByTagName("answer");
   for (let i = 0; i < tags.length; i++) {
      let answerXML = tags[i];
      let response = answerXML.getAttribute("response");
      let nextQuestion = answerXML.getAttribute("nextQuestion");
      answers[response.toLowerCase()] = nextQuestion;
   }
   return answers;
}
