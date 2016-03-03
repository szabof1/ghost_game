/**
 * GameEngine (class) {node file} 
 *
 *  Collection of very basic data and functions necessary 
 *  for the ghost_game_server.js
 * /
 // Created by       SzabóFerenc on August 05, 2015
 // Last modified by SzabóFerenc on August 05, 2015


"use strict";


/** Constants */
var HUMAN = 'Human';
var COMPUTER = 'Computer';


var dict = require('./dict.js')
  , gameStatus = require('./game_status.js');


/** Contructor */
function GameEngine() {
    this.setUpGameEngine();
}


/** 
 * Plays the actual turn of the game (responds to user request) 
 * @param: req, res, next - come from the router
 *         {number} testRnd - optional, mimics a random number [0, 1) - used for testing only
 */
GameEngine.prototype.play = function(req, userResp, next, testRnd) {
  console.log("Request:\n" + JSON.stringify(req.params));
    // Set basic word-related variables
    this.initVars(userResp.word, userResp.letter);

    // Print the data (word, letter) for which request is made
    console.log("Request for " + this.word + "/" + this.letter + " received.");

    // Set gameStatus
    this.resetGameStatus();

    // Check for valid letter and set flag for it
    if (this.letter) {
        this.letter = this.letter.charAt(0).toLowerCase(); // all letters must be lowercase, because the dictionary is in lowercase
        if (this.letter < 'a' || this.letter > 'z') { // filter invalid characters
            this.isValidLetter = false;
        }
    } else {
        this.isValidLetter = false;
    }


    if (this.isValidLetter) { 

        // VALID letter provided by human, 
        // that means this is a valid English letter.

        // HTTP Status: 200 : OK

        //console.log('A valid letter received: "' + this.letter + '"');
        console.log('A valid letter received: "' + this.letter + '"'  +  " (apple: " + this.fullDict.words.apple + ": " + JSON.stringify(this.fullDict.words.apple) + ")");

        // Check if actual dictionary contains actual word (chunk)
        // If not then 'actualDict' must be a clone of 'fullDict'
        var wArray = this.actualDict.getWordArray();
        if (wArray.length == 0) {
            // Reload the full dictionary
            this.actualDict = this.fullDict.cloneDict();
        } else if (this.word < wArray[0].slice(0, this.word.length) ||
            this.word > wArray[wArray.length - 1].slice(0, this.word.length)) {
            // Reload the full dictionary
            this.actualDict = this.fullDict.cloneDict();
        }


        // Find the best answer (letter)
        this.actualDict.filter(this.word);
        this.gameStatus = gameStatus.getInstance();
        this.gameStatus.evaluateGameStatus(this.actualDict, this.word, testRnd);
        if (!this.gameStatus.isGameOver) {

            // Game continues
            this.letterOut = this.gameStatus.words.wordSelected.charAt(this.word.length);

        } else {

            // Game over
            if (this.gameStatus.winner == COMPUTER) {
                this.letterOut = "" ; // Human lost, so computer shouldn't add another letter
            } else {
                this.letterOut = this.gameStatus.words.wordSelected.charAt(this.word.length);
            }

            // Reload the full dictionary
            this.actualDict = this.fullDict.cloneDict();

        }

    } else { 

        // INVALID letter provided by human
        // that means this is not a valid English letter.
        // User can try again.

        // HTTP Status: 400 : Bad Request

        console.log('An invalid letter received: "' + this.letter + '"');

        // No letter from computer side because bad letter was provided by human
        this.letterOut = "";

    }

    // Construct new word (chunk)
    this.word += this.letterOut; 

    // Return answer for the response body
    return {
      computerLetter: this.letterOut, humanLetter: this.letter, word: this.word
    , isGameOver: this.gameStatus.isGameOver, winner: this.gameStatus.winner
    , winReason: this.gameStatus.winReason
    , wordSelected: this.gameStatus.words.wordSelected               // just for testing
    , winningWordSelected: this.gameStatus.words.winningWordSelected // just for testing
    , losingWordSelected: this.gameStatus.words.losingWordSelected   // just for testing
    };
}


/** Resets word/letter variables */
GameEngine.prototype.initVars = function(word, letter) {
    this.word = word || '';
    this.letter = letter || '';
    this.letterOut = '';
    this.isValidLetter = true;
}


/** Resets game status */
GameEngine.prototype.resetGameStatus = function() {
    this.gameStatus = gameStatus.getInstance();
}


/**
 * Initialises game engine variables,
 * loads dictionary (results will be put in object 'fullDict')
 * then (in the callback) make a clone of it ('fullDict' -> 'actualDict')
 */
GameEngine.prototype.setUpGameEngine = function(startingLetterOrFullPathFileName) {
    console.log("Initialize game engine");

    this.initVars();
    this.resetGameStatus();

    // First: Load dictionary. Results will be put in object 'fullDict'
    // Then (in the callback): Make a clone of 'fullDict' into 'actualDict'
    this.fullDict = dict.getInstance()
    if (process.env.NODE_ENV != 'test') {
        startingLetterOrFullPathFileName = undefined;
    }
    self = this;
    this.fullDict.loadDict(startingLetterOrFullPathFileName, function() { self.actualDict = self.fullDict.cloneDict(); });

    console.log("Game engine initialized\n");
}


/** Restarts game engine. Resets all properties except 'fullDict' */
GameEngine.prototype.restart = function() {
    this.initVars();
    this.resetGameStatus();
    // Reload the full dictionary
    this.actualDict = this.fullDict.cloneDict();

    console.log("Human requested game restart. Game restarted.\n");
}


// Exporting
//exports = GameEngine;
module.exports = {
    getInstance: function() {
        return new GameEngine();
    }
}