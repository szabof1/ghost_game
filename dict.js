/**
 * Dict (class) {node file}
 *
 *  Wraps a dictionary, an object where words are attributes (having empty objects as dummy values for the keys).
 *  The dictionary itself is the 'words' attribute.
 *
 *  Eg. a_dict = { words: {a_word: {}, another_word: {} } }
 */
 // Created by       SzaboFerenc on August 05, 2015
 // Last modified by SzaboFerenc on August 05, 2015


"use strict";


/** Contructor */
function Dict() {
    /** Object with attributes as words (having empty objects as dummy values for the keys)*/
    this.words = {};
}


/**
 * Checks if word is already in Dict
 */
Dict.prototype.hasWord = function (word) {
    if (this.words.hasOwnProperty(word)) {
        return true;
    }

    return false;
};


/**
 * Adds a new word to 'words' attribute
 *
 * @param:  {string} word to be added
 * @return: {Dict} this (the object itself for chaining)
 */
Dict.prototype.addWord = function (word) {
    if (!this.hasWord(word)) {
        this.words[word] = {};
    }

    return this;
};

/**
 * Selects and returns a Dict object of the specified length words
 *
 * @param:  {number} len - the length for the words to be selected
 * @return: {object} wordsSelected (Dict object)
 *
 * Inner function, not to be exported
 */
Dict.prototype.selectWordsByLength = function (len) {
    var wordsSelected = new Dict();

    for (var word in this.words) {
        if (this.words.hasOwnProperty(word)) {
            if (word.length == len) {
                wordsSelected.addWord(word);
            }
        }
    }

    return wordsSelected;
}


/**
 * Selects and returns a random word (property) of a dict (object)
 *
 * @param:  {number} rnd - optional, mimics a random value [0, 1) - helps unit testing
 * @return: {string} (random word)
 *
 * Inner function, not to be exported
 */
Dict.prototype.selectRandomWord = function(testRnd) {
    var rnd;
    if (process.env.NODE_ENV === 'test' && testRnd >= 0 && testRnd < 1) {
        rnd = testRnd;
    } else {
        rnd = Math.random();
    }
    var words = this.getWordArray();
    var index = Math.floor(rnd * words.length);
    return words[index] || ''; // undefined -> ''
}


/**
 * Returns a dictionary filtered for words starting with parameter 'filteringWord'
 * @param:  {string} filteringWord - the dictionary will be filtered for words starting with this string
 * @return: {Dict}   wordsFound
 *
 */
Dict.prototype.filterDict = function (filteringWord) {
    var wordsFound = new Dict();

    for (var word in this.words) {
        if (this.words.hasOwnProperty(word)) {

            //console.log("### word: '" + word + "', filtering word: '" + filteringWord + "', slice: '" + word.slice(0, filteringWord.length) + "'");

            // Does word have a root equal to filteringWord?
            if (word.slice(0, filteringWord.length) == filteringWord) {

                // Actual key is a possible outcome for our filteringWord (chunk) -> save it
                wordsFound.addWord(word);

            }
        }
    }

    //console.log('Filtered dictionary:\n' + wordsFound.getWordArray());

    return wordsFound;
}

/**
 * Filters the dictionary for words starting with parameter 'filteringWord'
 * (replaces the dictionary with the words found)
 * @param:  {string} filteringWord - the dictionary will be filtered for words starting with this string
 */
Dict.prototype.filter = function (filteringWord) {
    var wordsFound = this.filterDict(filteringWord);

    // replace words of the original dict object (this) by the ones just filtered:
    this.words = JSON.parse(JSON.stringify(wordsFound.words));
}


/** Shows if we have words in the dictionary */
Dict.prototype.isPresent = function() {
    if (!this.words) {
        return false;
    } else if (this.getWordArray().length == 0) {
        return false;
    }
    return true;
}


/** Returns a clone (deep copy) of the dict */
Dict.prototype.cloneDict = function() {
    var newDict = new Dict();

    newDict.words = JSON.parse(JSON.stringify(this.words));
    return newDict;
}


/** Returns the words of dictionary in an array */
Dict.prototype.getWordArray = function() {
    return Object.keys(this.words);
}





/**
 * Loads dictionary text file into a Dict object
 * @param:  {string} startingLetterOrFullPathFileName
 *              if not set       then load file './dict/dict.txt'
 *              else if len == 1 then load file './dict/dict_{startingLetterOrFullPathFileName}.txt'
 *              else                  load file specified by the input string // Used for testing
 *          {function} callback - optional, called when EOF reached and dict is ready (loaded)
 *
 * Will throw error
 * - 'Dictionary file not found' if the file is missing
 * - 'The dictionary is empty'   if there are no words in the file
 */
Dict.prototype.loadDict = function(startingLetterOrFullPathFileName, callback) {
    var fs = require('fs')
      , readline = require('readline');
    var filename
      , self;

    /** Object for storing actual, previous and root values ('words') and the necessary methods */
    var wordChangeAndRootDetector = {
        /** Previous value property */
        prev: "#No Value#", // must be string, not undefined/null

        /** Actual value property */
        act: "#No Value#", // must be string, not undefined/null

        /**
         * Root value property:
         * Shows a shorter value (word) that is identical to the beginning of the actual value (word).
         * If there is no root then this property is equal to undefined.
         */
        root: "", // not undefined/null

        /** Sets actual value ('act') and saves its original value into previous value ('prev') */
        set: function(newValue) {
            this.prev = this.act;
            this.act = newValue;
        },

        /**
         * Checks if actual value ('act') has a root value
         * (a shorter value /word/ that is identical to the beginning of the actual value /word/)
         */
        checkRoot: function() {
            if (!this.root) {
                this.root = this.prev;
            }
            if (this.root.length >= 4 && this.act.length > this.root.length &&
                this.root == this.act.slice(0, this.root.length)) {
                //console.log("Rooted: " + this.act);
                return true;
            } else {
                //console.log("Not rooted: " + this.act);
                this.root = undefined;
                return false;
            };
        },

        /** Simple logging method for testing */
        log: function() {console.log("act: '" + this.act
            + "', prev: '" + this.prev + "', root: '" + this.root + "'");}
    };

    if (startingLetterOrFullPathFileName) {
        if (startingLetterOrFullPathFileName.length == 1) {
            filename = './dict/dict_' + startingLetterOrFullPathFileName + '.txt';
        } else {
            filename = startingLetterOrFullPathFileName;
        }
    } else {
        filename = './dict/dict.txt';
    }
    console.log('Opening file "' + filename + '" for reading');

    if (!fs.existsSync(filename)) {
        console.log('### Error: Dictionary file "' + filename + '" not found ###');
        throw new Error("Dictionary file not found");
    }

    // FILE READING
    self = this; // save this object reference for the function called below
    readline.createInterface({
        input: fs.createReadStream(filename),
        terminal: false
    }).on('line', function(word) {
        // Check the current word being read
        wordChangeAndRootDetector.set(word);

        // Is any of the previous words a root for the actual word?
        if (wordChangeAndRootDetector.checkRoot()) { // If yes (word has a root) -> Skip it

            // Do nothing.
            // Skip those words that have shorter roots,
            //   where these roots are at lest 4 letters long,
            // as they are useless for this game.

            //console.log("Skipping " + word); // used for testing

        } else { // If not (word has no root) -> Save it into dict

            // Add new word to the dictionary
            self.addWord(word);

            //console.log("Adding " + word); // used for testing
        }
    }).on('close', function() {
        if (!self.isPresent()) {
            console.log("### Error: the dictionary is empty: " + JSON.stringify(self.words) + " ###");
            throw new Error("The dictionary is empty.");
        } else {
            console.log("Successfully finished dictionary file read.");
            console.log("========== Run some simple tests against the loaded dictionary ==========");
            console.log("apple: " + self.words.apple + ": " + JSON.stringify(self.words.apple));
            console.log("zebra: " + self.words["zebra"] + ": " + JSON.stringify(self.words["zebra"]) + "\n");

            if (callback) {
                callback();
            }
        }
    });
}


// Exporting
//exports = Dict;
module.exports = {
    getInstance: function() {
        return new Dict();
    }
}
