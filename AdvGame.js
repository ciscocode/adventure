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

function AdvGame() {
   let element = document.getElementById("GameData");
   if (element === undefined) return undefined;

   // You write the code that initializes the state of the game

   let game = { };

/*
 * Method: play
 * Usage: game.play();
 * -------------------
 * Plays the Adventure game.
 */

   game.play = function() {
      // You fill in the code for the play method
   };

   return game;
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
