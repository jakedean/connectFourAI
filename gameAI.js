module.exports = (function () {

  var gameAI = {

  	'availableMoves' : function (board) {
      var possibleMoves = {};

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

  	'minimax' : (function () {
      var infin = Math.pow(2,53);
      return function (gameState, depth) {
        var branches,
            newGameState;
        if (this.winner(gameState.gameBoard)) {
          return (infin);
        } else if (depth === 0) {
          return this.score(gameState.gameBoard);
        }
        var alpha = infin;
        branches = this.availableMoves(gameState.gameBoard);
        for (var col in branches) {
          if (!branches.hasOwnProperty(col)) continue;
          newGameState = [].extend(gameState.gameBoard);
          newGameState = this.move(depth % 2, newGameState, branches[col], col);
          console.log(JSON.stringify(newGameState))
          alpha = Math.min(alpha, -this.minimax({ 'gameBoard' : newGameState }, depth - 1));
        }
        return alpha;
      }
  	}()),

    'move' : function (oddOrEven, board, row, col) {
      if (oddOrEven === 0) {
        board[row][col] = 1;
      } else {
        board[row][col] = 2;
      }
      return board;
    },

  	'isLegalMove' : function (gameState) {
      
  	},

    'winner' : function (board) {
      return (this.checkWinnerRow(board) ||
              this.checkWinnerCol(board) ||
              this.checkWinnerDiagonal(board));
    },

  	'score' : function (board) {
      
  	}, 

    'scoreCol' : function (gameState) {
      
    },

    'scoreRow' : function (gameState) {

    },

    'scoreDiagonal' : function (gameState) {

    },

    'checkWinnerRow' : function (board) {
      for (var i = 5; i >= 0; i -= 1) {
        var counter = 0;
        for (var k = 0; k < 7; k += 1) {
          if (k >= 4 && counter === 0) {
            break;
          }
          if (board[i][k]) {
            counter += 1;
            if (board[i][k] ===  board[i][k - 1]) {
              continue;
            } else if (board[i][k] !==  board[i][k - 1]) {
              counter = 1;
            }
          } else {
            counter = 0;
          }
          if (counter === 4) { return true }
        }
      }
    },

    'checkWinnerCol' : function (board) {
      for (var k = 0; k < 7; k += 1) {
        var counter = 0;
        for (var i = 5; i >= 0; i -= 1) {
          if (board[i][k]) {
            counter += 1;
            if (board[i][k] ===  board[i][k - 1]) {
              continue;
            } else if (board[i][k] !==  board[i][k - 1]) {
              counter = 1;
            }
          } else {
            counter = 0;
            break;
          }
          if (counter === 4) { return true }
        }
      }
    },

    'checkWinnerDiagonal' : function (board) {
      for (var i = 5; i > 2; i -= 1) {
        var counter = 0;
        for (var k = 0; k < 7; k += 1) {
          if(board[i][k] === board[i-3][k-3]) {
            if (board[i][k] === board[i-1][k-1] && board[i][k] === board[i-2][k-2]) {
              return true;
            }
          } else if (board[i][k] === board[i-3][k+3]){
            if (board[i][k] === board[i-1][k+1] && board[i][k] === board[i-2][k+2]) {
              return true;
            }
          }
        }
      }   
    }
 
  }

  return function () {
  	return gameAI;
  }

}());