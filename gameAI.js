module.exports = (function () {

  var gameAIProto = {

    'depth' : 4,

    'computerIsEven' : true,

    'getPlayerMove' : function (currentDepth) {
      if (this.computerIsEven) {
        return (currentDepth % 2 === 0) ? 2 : 1;
      } else {
        return (currentDepth % 2 === 0) ? 1 : 2;
      }
    },

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

    'moveApiPlayer' : function (gameState) {
      gameState.gameBoard[gameState.bestMove[0]][gameState.bestMove[1]] = 2;
      gameState.turn = 1;
    },

  	'minimax' : (function () {
      var infin = Math.pow(2,53);

      return function (gameState, depth) {
        
        var branches,
            newGameState,
            depth;

        if (depth === undefined) {
          depth = this.depth;
        } 

        console.log('depth ' + depth);
        
        if (this.winner(gameState.gameBoard)) {
          console.log('in here');
          return infin;
        } else if (depth === 0) {
          return this.score(gameState.gameBoard);
        }
       
        var alpha = infin;
       
        branches = this.availableMoves(gameState.gameBoard);
  
        for (var col in branches) {
          if (!branches.hasOwnProperty(col)) continue;
          newGameState = [].arrayExtend(gameState.gameBoard);
          newGameState = this.move(this.getPlayerMove(depth), newGameState, branches[col], col);
          alpha = Math.min(alpha, -this.minimax({ 'gameBoard' : newGameState }, depth - 1)); 
        }
        console.log('This is the alpha');
        console.log(alpha);
        return alpha;
      }
  	}()),
/*
if (alpha !== gameState.storedAlpha) {
            gameState.storedAlpha = alpha;
            gameState.bestMove = [branches[col], col];
          }
        }
        if (gameState.storedAlpha) {
          gameState.bestMove[1] = parseInt(gameState.bestMove[1]);
          console.log(gameState.bestMove);
          this.moveApiPlayer(gameState);
        } 
*/

    'minimax2' : (function () {
      var infin = Math.pow(2,53);
      return function (gameState, depth) {
        var branches,
              newGameState,
              currAlpha,
              isAI,
              depth,
              currPlayer;

        if (depth === undefined) {
          depth = this.depth;
        }

        currPlayer = this.getPlayerMove(depth);

        isAI  = this.getPlayerMove(depth) === 2 ? 1 : 0;
        
        if (this.winner(gameState.gameBoard)) {
          if (this.winner(gameState.gameBoard) === 2) {
            return infin;
          } else {
            return -(infin);
          }
        } else if (depth === 0) {
          return this.score(gameState.gameBoard);
        }

        if (isAI) {
          alpha = -(infin);
        } else {
          alpha = infin;
        }
       
        branches = this.availableMoves(gameState.gameBoard);

        for (var col in branches) {
          if (!branches.hasOwnProperty(col)) continue;
          newGameState = [].arrayExtend(gameState.gameBoard);
          newGameState = this.move(this.getPlayerMove(depth), newGameState, branches[col], col);
          var o = {}.extend(gameState);
          o.gameBoard = newGameState;
          currAlpha = this.minimax2(o, depth - 1);
          if (isAI) {
            alpha = Math.max(currAlpha, alpha);
            if (depth === this.depth) {
              if (gameState.storedAlpha === undefined) {
                gameState.storedAlpha = alpha;
                gameState.bestMove = [branches[col], col];
              } else if (gameState.storedAlpha < alpha) {
                gameState.storedAlpha = alpha;
                gameState.bestMove = [branches[col], col];
              }
            } 
          } else {
              alpha = Math.min(currAlpha, alpha);
            } 
          }
          return alpha;
        }
      }()),

    'move' : function (player, board, row, col) {
      board[row][col] = player;
      return board;
    },

    'winner' : function (board) {
      if (this.checkWinnerRow(board)) {
        return this.checkWinnerRow(board);
      } else if (this.checkWinnerCol(board)) {
        return this.checkWinnerCol(board);
      } else if (this.checkWinnerDiagonal(board)) {
        return this.checkWinnerDiagonal(board);
      }
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
      return total;
    },

    'scoreCol' : function (board) {
      var colScoreTable = this.scoreTable();
      for (var row = 5; row >= 3; row -= 1) {
        for (var col = 0; col < 7; col += 1) {
          var counter = 0;
          if (board[row][col] !== 1 && 
              board[row - 1][col] !== 1 && 
              board[row - 2][col] !== 1 &&
              board[row - 3][col] !== 1) {
            for (var j = row; j >= row - 3; j -= 1) {
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
      for(var row = 5; row >= 0; row -= 1) {
        for (var col = 0; col < 4; col += 1) {
          var counter = 0;
          if (board[row][col+3]!== 1 && 
              board[row][col+2]!== 1 && 
              board[row][col+1]!== 1 && 
              board[row][col] !== 1) {
            for (var j = col; j <= col + 3; j += 1) {
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
      for (var row = 5; row >= 3; row -= 1){
        for (var col = 0; col < 7; col += 1) {
          if (board[row][col] !== 1 && 
              board[row - 3][col - 3] !== 1 && typeof board[row - 3][col - 3] !== 'undefined' &&
              board[row - 2][col - 2] !== 1 && typeof board[row - 2][col - 2] !== 'undefined' &&
              board[row - 1][col - 1] !== 1 && typeof board[row - 1][col - 1] !== 'undefined') {
            counter = 0;
            if (board[row][col] === 2) counter += 1;
            if (board[row - 1][col - 1] === 2) counter += 1;
            if (board[row - 2][col - 2] === 2) counter += 1;
            if (board[row - 3][col - 3] === 2) counter += 1;
            if (counter) diagScoreBoard[counter] += 1;
          }
          if (board[row][col] !== 1 && 
              board[row - 3][col + 3] !== 1 && typeof board[row - 3][col + 3] !== 'undefined' &&
              board[row - 2][col + 2] !== 1 && typeof board[row - 2][col + 2] !== 'undefined' &&
              board[row - 1][col + 1] !== 1 && typeof board[row - 1][col + 1] !== 'undefined') {
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
        var strRow = board[row].join();
        if (strRow.match(/1,1,1,1/)) {
          return 1;
        } else if (strRow.match(/2,2,2,2/)) {
          return 2;
        }
      }
      return false;
    },

    'checkWinnerCol' : function (board) {
      for (var col = 0; col < 7; col += 1) {
        var colStrMaker = [];
        for (var row = 5; row >=0; row -= 1) {
          colStrMaker.push(board[row][col]);
        }
        var strCol = colStrMaker.join();
        if (strCol.match(/1,1,1,1/)) {
          return 1;
        } else if (strCol.match(/2,2,2,2/)) {
          return 2;
        }
      }
      return false;
    },

    'checkWinnerDiagonal' : function (board) {
      for (var row = 5; row > 2; row -= 1) {
        for (var col = 0; col < 7; col += 1) {
          if(board[row][col] && board[row][col] === board[row-3][col-3]) {
            if (board[row][col] === board[row-1][col-1] && 
                board[row][col] === board[row-2][col-2]) {
              if (board[row][col] === 1) {
                return 1;
              } else {
                return 2;
              };
            }
          } else if (board[row][col] && board[row][col] === board[row-3][col+3]){
            if (board[row][col] === board[row-1][col+1] && 
                board[row][col] === board[row-2][col+2]) {
              if (board[row][col] === 1) {
                return 1;
              } else {
                return 2;
              }
            }
          }
        }
      }
      return false;   
    },

    'rowTrip' : function (board) {
      for (var row = 5; row >= 0; row -= 1) {
        var strRow = board[row].join();
        if (strRow.match(/0,2,2,2/) || strRow.match(/2,2,2,0/)) {
          for (var col = 0; col <= 6; col += 1) {
            if (board[row][col] === 0 && board[row][col+1] === 2 && board[row][col+2] === 2 && board[row][col+3] === 2) {
              if (row === 5 || (board[row+1] && board[row+1][col])) {
                return {'winRowRow' : row,
                        'winRowCol' : col 
                       };
              }
            } else if (board[row][col+3] === 0 && board[row][col] === 2 && board[row][col+1] === 2 && board[row][col+2] === 2) {
              if (row === 5 || (board[row+1] && board[row+1][col+3])) {
                return {'winRowRow' : row,
                      'winRowCol' : col+3 
                     };
              }
            }
          }
          
        } else if (strRow.match(/0,1,1,1/) || strRow.match(/1,1,1,0/)) {
          for (var col = 0; col <= 6; col += 1) {
            if (board[row][col] === 0 && board[row][col+1] === 1 && board[row][col+2] === 1 && board[row][col+3] === 1) {
              if (row === 5 || (board[row+1] && board[row+1][col])) {
                return {'blockRowRow' : row,
                      'blockRowCol' : col 
                     };
              }
            } else if (board[row][col+3] === 0 && board[row][col] === 1 && board[row][col+1] === 1 && board[row][col+2] === 1) {
              if (row === 5 || (board[row+1] && board[row+1][col+3])) {
                return {'blockRowRow' : row,
                      'blockRowCol' : col+3 
                     };
              }
            }
          }
        }
      }
      return false;
    },

    'colTrip' : function (board) {
      for (var col = 0; col < 7; col += 1) {
        var colStrMaker = [];
        for (var row = 5; row >=0; row -= 1) {
          colStrMaker.push(board[row][col]);
        }
        var strCol = colStrMaker.join();
        if (strCol.match(/2,2,2,0/)) {
          for (var r = 5; r >= 0; r -= 1) {
            if (board[r-3] && board[r-3][col] === 0 && 
                board[r][col] === 2 && 
                board[r-2][col] === 2 && 
                board[r-2][col] === 2) {
              return {'winColRow' : r-3,
                      'winColCol' : col 
                     };
            }
          }
        } else if (strCol.match(/1,1,1,0/)) {
          for (var r = 5; r >= 0; r -= 1) {
            if (board[r-3] && board[r-3][col] === 0 && 
                board[r][col] === 1 && 
                board[r-2][col] === 1 && 
                board[r-2][col] === 1) {
              return {'blockColRow' : r-3,
                      'blockColCol' : col 
                     };
            }
          }
        }
      }
      return false;
    },

    'threeScore' : function (board) {
      var row = this.rowTrip(board);
      var col = this.colTrip(board);
      console.log('got in three score function');
      console.log('row ' + JSON.stringify(row));
      console.log('col ' + JSON.stringify(col));
      if (row && row.winRowRow !== undefined) {
          board[row.winRowRow][row.winRowCol] = 2;
          return board;
        } else if (col && col.winColRow !== undefined) {
          board[col.winColRow][col.winColCol] = 2;
          return board;
        } else if (row && row.blockRowRow !== undefined) {
          board[row.blockRowRow][row.blockRowCol] = 2;
          return board;
        } else if (col && col.blockColRow !== undefined) {
          board[col.blockColRow][col.blockColCol] = 2;
          return board;
        } else {
          return false;
        }
    },

    'botChecker' : function (gameState) {
      var board = gameState.gameBoard;
      var rowStr = board[5].join();
      if (rowStr.match(/0,1,1,0/)) {
        for (var i = 0; i <= 6; i += 1) {
          if (board[5][i] === 0 && board[5][i+1] === 1 && board[5][i+2] === 1) {
            board[5][i] = 2;
            return gameState;
          }
        }

      } else if (rowStr.match(/0,1,0,1,0/)) {
        for (var i = 0; i <= 6; i += 1) {
          if (board[5][i] === 0 && board[5][i+1] === 1 && board[5][i+2] === 0 && board[5][i+3] === 1) {
            board[5][i+2] = 2;
            return gameState;
          }
        }
      } else if (rowStr.match(/1,1,0,1/)) {
        for (var i = 0; i <= 6; i += 1) {
          if (board[5][i] === 1 && board[5][i+1] === 1 && board[5][i+2] === 0 && board[5][i+3] === 1) {
            board[5][i+2] = 2;
            return gameState;
          }
        }
      }
      if (this.threeScore(board)) {
        return gameState;
      } else {
        this.minimax2(gameState);
      }
    }   
  }

  var init = function (that) {
    if (that.depth % 2 === 0) {
      that.computerIsEven = true;
    } else {
      that.computerIsEven = false;
    }
    return that;
  }

  return function (OO) {
  	return init(Object.create(gameAIProto).extend(OO));
  }

}());