const { Game, Card, Values, Colors } = require('uno-engine');
const players = ['Player 1', 'Player 2']; // maximum 10 players with unique names
const game = Game(players); // initialize the game
game.newGame();