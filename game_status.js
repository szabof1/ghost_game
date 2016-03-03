/**
 * GameStatus (class) {node file} 
 *
 * Checks if Human lost the game and Computer won.
 * Collects winning / losing words (string) and word lists (Dict).
 * Checks if Computer lost the game and Human won.
 */
// Created by       SzabóFerenc on August 05, 2015
// Last modified by SzabóFerenc on August 05, 2015


"use strict";


/** Constants */
var HUMAN = 'Human';
var COMPUTER = 'Computer';


var dict = require('./dict.js');
var gameWordsJs = require('./game_words.js');


/** Contructor */
function GameStatus() {
    this.init();
}


/**
 * Reset object attributes
 *
 * @return: {Dict} this (the object itself for chaining)
 */
GameStatus.prototype.init = function() {
    this.isGameOver = false;
    this.winner = null;
    this.winReason = null;
    this.words = gameWordsJs.getInstance();

    return this;
};


/**
 * Evaluate game status.
 * - Checks if Human lost.
 * - Finds all winning words, if any. Then chooses one of them randomly.
 * - Finds all losing words, if any. If there is no winning word then chooses the longest losing one.
 * - Checks if Computer lost.
 *
 * @param:  {Dict  } dict - hash table of words as keys
 *          {string} word - dict will be filtered for words starting with this string
 * @return: {Dict}   this (the object itself for chaining)
 */
GameStatus.prototype.evaluateGameStatus = function (dict, word, testRnd) {
    var gameWords = gameWordsJs.getInstance();

    // #1 Check if this word (chunk) is the root of a possible word
    if (!dict.isPresent()) {

        // Empty dict means: no root of any words -> Human lost
        this.isGameOver = true;
        this.winner = COMPUTER;
        this.winReason = 'Human entered wrong letter, so this word chunk cannot be extended into a valid word.'
        this.words = gameWords;

        return this; // RETURN STATEMENT HERE!

    }

    // This word (chunk) is the root of a possible word
    //
    // #2 Check if word is at least four letters in length and if Human completed a valid word
    if (word.length >= 4) {

        // Word (chunk) is long enough
        if (dict.hasWord(word)) {

            // Word from Human can be found in dict -> Human lost the game
            this.isGameOver = true;
            this.winner = COMPUTER;
            this.winReason = 'Human completed a word.'
            this.words = gameWords;

            return this; // RETURN STATEMENT HERE!
        }
    }

    // #3 Game is not finished yet -> get winning / losing words
    //                             -> select a word to go for
    gameWords.getWinningLosingWords(dict, testRnd);
    this.words = gameWords;

    // #4 If word (chunk) extended by computer is a valid (full) word -> Computer lost
    word += gameWords.wordSelected.charAt(word.length); // this is the new word (chunk)
    if (word.length >= 4) {

        // Word (chunk) is long enough
        if (dict.hasWord(word)) {

            // Word from Computer can be found in dict -> Computer lost the game
            this.isGameOver = true;
            this.winner = HUMAN;
            this.winReason = 'Computer completed a word.'

            return this; // RETURN STATEMENT HERE!
        }
    }

    return this;
}


// Exporting
//exports = GameStatus;
module.exports = {
    getInstance: function() {
        return new GameStatus();
    },
    HUMAN: HUMAN,
    COMPUTER: COMPUTER
};