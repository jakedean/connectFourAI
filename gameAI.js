module.exports = (function () {

  var gameAI = {

  	'availableMoves' : function (gameState) {
      var board = gameState.gameBoard,
          possibleMoves = {};

      for (var col = 0; col < 7; col += 1) {
      	for (var row = 5; row >= 0; row -= 1) {
      		if (board[row][col] === 0) {
      			possibleMoves[col] = row;
      			break;
      		}
      	}
      }
      return possibleMoves;
  	},

  	'bestMove' : function (gameState) {
      
  	},

  	'minimax' : function (gameState) {
      
  	},

  	'isLegalMove' : function (gameState) {
      
  	},

  	'value' : function (gameState) {

  	}, 

    'checkVerical' : function (gameState) {
      
    },

    'checkHorizontal' : function (gameState) {

    },

    'checkDiagonal' : function (gameState) {

    }
 
  }

  return function () {
  	return gameAI;
  }

}());