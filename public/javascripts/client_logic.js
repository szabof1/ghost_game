/**
* This is Ferenc Szabo's solution for the Gost Game test challenge
* - Human interface and logic
*
* Written in pure JavaScript and jQuery 
*
* July 30, 2015
**/
function getGameLogic(logicObj) {
    "use strict";
    
    /** Constants **/
    var HUMAN = 'Human';
    var COMPUTER = 'Computer';
    var URL = 'http://127.0.0.1'; // 'https://ghost-game-szabof1.c9users.io/';
    var PORT = '8000';            // '8080';
    
    /** Handles word and related attribute(s) / method(s) **/
    var wordObj = {
        word:"", // the word, the beginning of it
        letter: "", // last letter entered by Human (client)
        addLetter: function(letter) { // adds last letter entered to wordObj attributes
           if (letter < 'a' || letter > 'z') {
              // Invalid letter entered -> set letter blank & leave word unchanged
              this.letter = '';
           } else {
              this.letter = letter;
              this.word += this.letter;
           }
        }
    };
    
    /** Flag for game over **/
    var isGameOver = false;
    
    
    /** Appends the letter given in <input id="a_letter" ...> **/
    function letter_append() {
        // Process letter entered
        wordObj.addLetter($('#a_letter').val());
        
        // Update screen
        $('#word').val(wordObj.word);
        $('#a_letter').val("");
    };
    
    /*
    * Handles the jobs related to letter given.
    * - Appends letter.
    * - Issues a GET request to the game server
    * - and handles the response.
    * - Finishes the game if won.
    */
    function handle_letter() { // URL + ':' + PORT + '/word/...'
        if (isGameOver) {
        
           // Reset client variables
           resetClientVars();
           location.reload();
        
        } else {
        
           // Appends letter to word
           letter_append();
        
           if (wordObj.letter) { // If letter entered is a valid letter
             // The fix part of the ajax object
             var ajaxObj = {
                 dataType: 'text', // 'json',
                 contentType: 'application/json',
                 cache: false,
                 processData: false,
                 success: function(jsonResp){
                    // Get rid of extra back slashes ('\"') in jsonResp
                    // These back slashes were not present during the original development in July, 2015
                    function trim(str, chr) {
                        var rgxtrim = (!chr) ? new RegExp('^\\s+|\\s+$', 'g') : new RegExp('^'+chr+'+|'+chr+'+$', 'g');
                        return str.replace(rgxtrim, '');
                    }
                    var jsonTxt = JSON.stringify(jsonResp).split('\\"').join('"');
                    
                    // Get rid of extra quotes (") in jsonResp
                    // These quotes were not present during the original development in July, 2015
                    if (jsonTxt.substring(0, 1) === '"' && jsonTxt.substring(jsonTxt.length - 1, jsonTxt.length) === '"') {
                        jsonTxt = jsonTxt.substring(1, jsonTxt.length - 1);
                    }
                    
                    // Show logging/testing information about the response of the computer (server)
                    console.log("Response content: '" + jsonTxt + "'");
                    $("#responseObject").text(jsonTxt); // Used for testing only
                    
                    // Update jsonResp based on the corrected jsonTxt
                    jsonResp = JSON.parse(jsonTxt);
                    
                    // Set the word updated by the computer (server)
                    wordObj.word = jsonResp.word;
                    $('#word').text(wordObj.word);
        
                    // Show information about the response of the computer (server)
                    var responseText = "";
                    if (!jsonResp.isGameOver || jsonResp.winner == HUMAN) {
                       responseText = "The computer responded with letter '" + 
                          jsonResp.computerLetter.toUpperCase() + "'";
                    }
                    
                    // Finishes the game if won.
                    // Add information about the winner to the response text
                    if (jsonResp.isGameOver) {
                       if (jsonResp.winner == HUMAN) {
        
                          responseText += "<br>Congratulations, you beated the computer and <strong><em>you won</em></strong> the game.";
        
                       } else {
        
                          responseText += "<br><strong><em>You lost</em></strong>. The computer won the game.";
        
                       }
        
                       responseText += "<br>" + jsonResp.winReason;
        
                       responseText += "<br><br> Press any key to restart the game.";
        
                       // Set game over flag to true 
                       isGameOver = true;
                    }
        
                    // Show response text
                    $('#response').html(responseText);
                 },
                 error: function(jqXHR, textStatus, errorThrown ) {
                    console.log('Error connecting to the server: "' + textStatus + '", "' + errorThrown + '"');
                    alert('Error connecting to the server: "' + textStatus + '", "' + errorThrown + '"');
                    resetClientVars();
                    location.reload();
                 },
                 timeout:10000
             };
             
             // Issues a POST/GET request to the game server and handles the response
             if (true) {
                 ajaxObj.type = "POST";
                 ajaxObj.url = URL + ':' + PORT + '/word/';
                 ajaxObj.data = '{"word":"' + wordObj.word + '", "letter":"' + wordObj.letter + '"}';
             } else {
                 ajaxObj.type = "GET";
                 ajaxObj.url = URL + ':' + PORT + '/word/' + wordObj.word + '/' + wordObj.letter;
                 ajaxObj.data = '';
             }
             $.ajax(ajaxObj);
           }
        }
        
        // Sets the input field of id="a_letter" active. More comfortable this way
        $("#a_letter").focus();
    }
    
    /*
    * Restarts client and server
    */
    function restart_game() { // URL + ':' + PORT + '/restart/
        // Reset client variables
        resetClientVars();
        location.reload();
        
        // Issues a GET request (/restart) to the game server
        $.ajax({
           type: "GET",
           url: URL + ':' + PORT + '/restart/',
           cache: false,
           dataType: "json",
           success: function(jsonResp){ }
        });
    }
    
    /*
    * Resets client variables
    */
    function resetClientVars() {
        wordObj.word = "";
        wordObj.letter = "";
        isGameOver = false;
    }
    
    // Expose the necessary functions:
    logicObj['handle_letter'] = handle_letter;
    logicObj['restart_game'] = restart_game;
}