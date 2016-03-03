/**
 * GameWords (class) {node file} 
 *
 * Collection of words (string) and word lists (Dict):
 * - {Dict}   winningWords - a list of all words that will lead to a win
 * - {Dict}   losingWords  - a list of all words that will lead to a lose
 * - {string} winningWordSelected  - a word of 'winningWords', selected randomly
 * - {string} losingWordSelected   - a word of maximum length elements of 'losingWords' , selected randomly
 * - {string} wordSelected - if not empty then winningWordSelected, else losingWordSelected
 */
// Created by       SzabóFerenc on August 05, 2015
// Last modified by SzabóFerenc on August 05, 2015


"use strict";


var dict = require('./dict.js');


/** Contructor */
function GameWords() {
    this.init();
}


/**
 * Reset object attributes
 *
 * @return: {GameWords} this (the object itself for chaining)
 */
GameWords.prototype.init = function() {
    this.winningWords = dict.getInstance();
    this.losingWords = dict.getInstance();
    this.winningWordSelected = '';
    this.losingWordSelected = '';
    this.wordSelected = '';

    return this;
};


/**
 * Collects winning and losing words and finds the longest losing word into losingWordSelected property.
 *
 * @param:  {Dict}   dict    - dictionary (word list)
 *          {number} testRnd - optional, mimics a random value [0, 1) - helps unit testing
 * @return: {GameWords} this (the object itself for chaining)
 *
 * Inner function, not to be exported
 */
GameWords.prototype.getWinningLosingWords = function(dict, testRnd) {
    if (this.wordSelected) {
        this.init();
    }

    for (var word in dict.words) {
        if (dict.words.hasOwnProperty(word)) {
            if (word.length >= 4) {
                if (word.length % 2 == 1) {

                    // Winning words are odd in length
                    this.winningWords.addWord(word);

                    //console.log("Winning word added: '" + word + "'");

                } else {

                    // Losing words are even in length
                    this.losingWords.addWord(word);

                    //console.log("Losing word added: '" + word + "'");

                    // Longest losing word should be saved into losingWordSelected property
                    if (this.losingWordSelected.length < word.length) {
                        this.losingWordSelected = word;
                    }

                }
            }
        }
    }

    // Save randomly selected winning word into winningWordSelected property
    this.winningWordSelected = this.winningWords.selectRandomWord(testRnd);

    // Save randomly selected maximum length losing word into losingWordSelected property
    // (because our gameWords.losingWordSelected is not randomly selected at this moment,
    //  however correct in size)
    if (this.losingWordSelected) { // we have losing word(s)
        var longestLosingWords = this.losingWords.selectWordsByLength(this.losingWordSelected.length);
        this.losingWordSelected = longestLosingWords.selectRandomWord(testRnd);
    }

    // Choose a winning word, if any. Else take the longest losing word.
    if (this.winningWordSelected) { // we have winning word(s)
        this.wordSelected = this.winningWordSelected;
    } else if (this.losingWordSelected) { // we have losing word(s)
        this.wordSelected = this.losingWordSelected;
    } else {
        this.wordSelected = '';
    }

    //console.log("### gameWords: \n" + JSON.stringify(this)) + "\n"; // Used for testing

    return this;
};


// Exporting
//exports = GameWords;
module.exports = {
    getInstance: function() {
        return new GameWords();
    }
};