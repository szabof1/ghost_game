This is Ferenc Szabo's solution for the Gost Game test challenge.
July 30, 2015 / March 01, 2016

Attached you can find the programs and other required files for Gost Game.

1. File structure:
   ---------------
   +ghost_game
   |==========
    \
    |
    |\client -ghost_game_client.html (the client code, HTML + JavasScript with jQuery)
    | ======  ----------------------
    |
    |\server -ghost_game_server.js (the main program of the game server)
    ||======  --------------------
    | \
    | |      -game_engine.js (class, contains the controlling logic)
    | |       --------------
    | |
    | |      -game_status.js (calss, contains the logic connected with winning)
    | |       --------------
    | |
    | |      -game_words.js (class, contains the logic connected with word selection in order to prepare the best answer)
    | |       -------------
    | |
    | |      -dict.js (class, contains the logic connected with the dictionary)
    | |       -------
    | |
    | |\test -game_engine_test.js (Mocha unit tests for class GameEngine)
    | | ====  -------------------
    | |
    | |      -game_status_test.js (Mocha unit tests for class GameStatus)
    | |       -------------------
    | |
    | |      -game_words_test.js (Mocha unit tests for class GameWords)
    | |       -------------------
    | |
    | |      -dict_test.js (Mocha unit tests for class Dict)
    | |       ------------
    | |
    |  \node_modules (this directory and its subdirectories contain the node.js framework, modules and other files
    |   ============  that are necessary for the running)
    |
     \dict -dict.txt (the chosen dictionary file, see details is subdirectory 'the chosen dictionary')
      ====  --------
      
           -dict_z.txt (the words starting with 'z', used for testing)
            ----------

2. Modules, versions:
   ------------------
   The solution is built on the following components:
   * Client: - Simple HTML file using JavaScript and jQuery logic
   * Server: - Node.js (v5.6.0)
             - Express (v4.13.4)
             - body-parser (v1.15.0)
             - Cors (v2.7.1)

3. Configuration instructions:
   ---------------------------
   Create a directory 'ghost_game' and unpack the attached zip into it.
   The program was created for NodeJS v5.6.0.
   Module dependencies can be found in file 'package.json'.
   
   Start server: $ node ghost_game_server.js
   
   Start client: simply enter the url (eg. localhost:8000) into the browser
   
4. Comments:
   - Server doesn't use any user identification, as it was not a requirement.
     Any number of users can play simultaniously because the server is stateless.
   - The server uses a very basic error handling:
     - User requests for game play have a simple check for letters 'a', 'b', 'c',... 'z' [a-z] (only lowercase is accepted).
       Any other caharcter is omitted and there is no change in the game status on the client side too.
     - During server startup
       - if dictionary file is not found, or
       - if dictionary file is empty
       server writes error message to the console, throws error and stops.