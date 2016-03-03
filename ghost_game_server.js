/**
 * {node file} ghost_game_computer.js
 *
 * This is Ferenc Szabo's solution for the Gost Game test challenge
 * - Computer part logic
 * 
 * Modules installed:
 * - express v4.13.1
 * - cors    v2.7.1
 */
 // Created by       SzabóFerenc on August 05, 2015
 // Revised by       SzabóFerenc on March  01, 2016


"use strict";


// Load express and cors modules and construct the application object
var express = require('express');
var bodyParser = require('body-parser');
  /* Use 'cors' module for getting rid of error 
    "XMLHttpRequest cannot load http://external.service/. 
     No 'Access-Control-Allow-Origin' header is present on the requested resource. 
     Origin 'http://my.app' is therefore not allowed access." */
var cors = require('cors');
var app = express();


// Load class code and create game engine object
var ghostGameEngine = require('./game_engine.js');
var gameEngine = ghostGameEngine.getInstance();


//Configure body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Put on 'cors' module
app.use(cors());


// Variables
var PORT = 8000; // 8080;
var answer = '';


// Configure your server, make sure to put the correct paths
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
    //res.render('index.html');
});


// Manage routes..

// Routing for game restart
app.get('/restart', function(req, res, next) {
  gameEngine.restart();
  //res.render('index.jade'); // jQuery not working at the moment
  //res.render('index.html');
  res.sendFile(__dirname + '/views/index.html');
});


// Routing for the game play
if (true) { // POST
    app.post('/word/', function(req, res, next) {
      console.log(req)
      answer = gameEngine.play(req, {word: req.body.word, letter: req.body.letter}, next);
      console.log("\nResponse:\n" + JSON.stringify(answer) + "\n");
      res.json(answer); // This is CORS-enabled for all origins!
    });
} else { // GET
    app.get('/word/:word/:letter', function(req, res, next) {
      answer = gameEngine.play(req, {word: req.params.word, letter: req.params.letter}, next);
      console.log("\nResponse:\n" + JSON.stringify(answer) + "\n");
      res.json(answer); // This is CORS-enabled for all origins!
    });
}


// Start web server
app.listen(PORT, function(){
  console.log('CORS-enabled web server listening on port ' + PORT);
});


