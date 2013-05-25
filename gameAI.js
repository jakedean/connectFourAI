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

  	'bestMove' : function (gameState, depth) {
      gameState.gameBoard.depth = depth;
      return this.minimax(gameState, depth)
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
          newGameState = this.move(depth, newGameState, branches[col], col);
          console.log(JSON.stringify(newGameState))
          alpha = Math.min(alpha, -this.minimax({ 'gameBoard' : newGameState }, depth - 1));
          console.log(alpha)
        }
        return alpha;
      }
  	}()),

    'move' : function (currentDepth, board, row, col) {
      var maxDepth = board.depth;
      if (maxDepth % 2 === 0) {
        if (currentDepth % 2 === 0) {
          board[row][col] = 2;
        } else {
          board[row][col] = 1;
        }
      } else {
        if (currentDepth % 2 === 0) {
          board[row][col] = 1;
        } else {
          board[row][col] = 2;
        }
      }
      return board;
    },

    'winner' : function (board) {
      return (this.checkWinnerRow(board) ||
              this.checkWinnerCol(board) ||
              this.checkWinnerDiagonal(board));
    },

  	'score' : function (board) {
      return   (this.scoreTotal(this.scoreRow(board)) + 
               this.scoreTotal(this.scoreCol(board)) + 
               this.scoreTotal(this.scoreDiagonal(board)));       
    },

    'scoreTotal' : function (scoreTable) {
      var total = 0,
          calculator = {
            1 : 1,
            2 : 4,
            3 : 32
          };
      for (var count in scoreTable) {
        if (!scoreTable.hasOwnProperty(count)) continue;
        total += scoreTable[count] * calculator[count];
      }
      console.log('Total = ' + total)
      return total;
    },

    'scoreCol' : function (board) {
      var colScoreTable = this.scoreTable();
      for (var row = 5; row <= 3; row -= 1) {
        for (var col = 0; col < 7; col += 1) {
          var counter = 0;
          if (board[row][col] !== 1 && 
              board[row - 1][col] !== 1 && 
              board[row - 2][col] !== 1 &&
              board[row - 3][col] !== 1) {
            for (var j = row; j < row - 3; j -= 1) {
              if (board[j][col] === 2) counter += 1;
            }
            if (counter) colScoreTable[counter] += 1;
          }
        }
      }
      return colScoreTable;
    },

    'scoreRow' : function (board) {
      var rowScoreTable = this.scoreTable();
      for(var row = 5; row > 0; row -= 1) {
        for (var col = 0; col < 4; col += 1) {
          var counter = 0;
          if (board[row][col+3]!== 1 && 
              board[row][col+2]!== 1 && 
              board[row][col+1]!== 1 && 
              board[row][col] !== 1) {
            for (var j = col; j < col + 3; j += 1) {
              if (board[row][j] === 2) counter += 1;
            }
            if (counter) rowScoreTable[counter] += 1;
          }
        }
      }
      return rowScoreTable;
    },

    'scoreDiagonal' : function (board) {
      var diagScoreBoard = this.scoreTable(),
          counter = 0;
      for (var row = 5; row >= 3; row -= 3){
        for (var col = 0; col < 7; col += 1) {
          if (board[row][col] !== 1 && 
              board[row - 1][col - 1] !== 1 && 
              board[row - 2][col - 2] !== 1 && 
              board[row - 3][col - 3] !== 1) {
            counter = 0;
            if (board[row][col] === 2) counter += 1;
            if (board[row - 1][col - 1] === 2) counter += 1;
            if (board[row - 2][col - 2] === 2) counter += 1;
            if (board[row - 3][col - 3] === 2) counter += 1;
            if (counter) diagScoreBoard[counter] += 1;
          }
          if (board[row][col] !== 1 && 
              board[row - 1][col + 1] !== 1 &&
              board[row - 2][col + 2] !== 1 &&
              board[row - 3][col + 3] !== 1) {
            counter = 0;
            if (board[row][col] === 2) counter += 1;
            if (board[row - 1][col + 1] === 2) counter += 1;
            if (board[row - 2][col + 2] === 2) counter += 1;
            if (board[row - 3][col + 3] === 2) counter += 1;
            if (counter) diagScoreBoard[counter] += 1;
          }
        }
      }
      return diagScoreBoard;
    },

    'scoreTable' : function () {
      return {
        1 : 0,
        2 : 0,
        3 : 0
      }
    },

    'checkWinnerRow' : function (board) {
      for (var row = 5; row >= 0; row -= 1) {
        var counter = 0;
        for (var col = 0; col < 7; col += 1) {
          if (col >= 4 && counter === 0) {
            break;
          }
          if (board[row][col]) {
            counter += 1;
            if (board[row][col] ===  board[row][col - 1]) {
              continue;
            } else if (board[row][col] !==  board[row][col - 1]) {
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
      for (var col = 0; col < 7; col += 1) {
        var counter = 0;
        for (var row = 5; row >= 0; row -= 1) {
          if (board[row][col]) {
            counter += 1;
            if (board[row][col] ===  board[row][col - 1]) {
              continue;
            } else if (board[row][col] !==  board[row][col - 1]) {
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
      for (var row = 5; row > 2; row -= 1) {
        var counter = 0;
        for (var col = 0; col < 7; col += 1) {
          if(board[row][col] && board[row][col] === board[row-3][col-3]) {
            if (board[row][col] === board[row-1][col-1] && 
                board[row][col] === board[row-2][col-2]) {
              return true;
            }
          } else if (board[row][col] && board[row][col] === board[row-3][col+3]){
            if (board[row][col] === board[row-1][col+1] && 
                board[row][col] === board[row-2][col+2]) {
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