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

    'moveApiPlayer' : function (gameState, depth) {
      console.log(depth);
      console.log('This is an api move');
      console.log(String(gameState.bestMove));
      gameState.gameBoard[gameState.bestMove[0]][gameState.bestMove[1]] = 2;
      gameState.turn = 1;
      console.log(JSON.stringify(gameState));
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
      }

  	}()),

    'minimax2' : (function () {
      var infin = Math.pow(2,53);
      return function (gameState, depth) {
        var branches,
              newGameState,
              currAlpha,
              isAI,
              depth;

        if (depth === undefined) {
          depth = this.depth;
        }

        isAI  = this.getPlayerMove(depth) === 2 ? 1 : 0;
        
        if (this.winner(gameState.gameBoard)) {
          console.log('in here');
          if (isAI) {
            return infin;
          } else {
            return -(infin);
          }
          
        } else if (depth === 0) {
          return this.score(gameState.gameBoard);
        }
       

        var obj = {
          'alpha' : undefined,
          'move' : undefined,
          'player' : this.getPlayerMove(depth)
        }
       
        branches = this.availableMoves(gameState.gameBoard);

        for (var col in branches) {
          if (!branches.hasOwnProperty(col)) continue;
          newGameState = [].arrayExtend(gameState.gameBoard);
          newGameState = this.move(this.getPlayerMove(depth), newGameState, branches[col], col);
          console.log(JSON.stringify(newGameState));
          currAlpha = this.minimax2({ 'gameBoard' : newGameState }, depth - 1);
          console.log('currAlpha ' + currAlpha);
          if (isAI) {
            if (currAlpha > obj.alpha || obj.alpha === undefined) {
              console.log('IS AIIII IS 111111111111111');
              console.log('old alpha ' + obj.alpha);
              console.log('new alpha ' + currAlpha);
              obj.alpha = currAlpha;
              obj.move = [branches[col], col];
            } 
          } else {
            if (currAlpha < obj.alpha || obj.alpha === undefined) {
              console.log('IS AIIII IS 0000000000')
              console.log('old alpha ' + obj.alpha);
              console.log('new alpha ' + currAlpha);
              obj.alpha = currAlpha;
              obj.move = [branches[col], col];
            } 
          }
        }
        if (depth === this.depth) {
          console.log('********************************')
          obj.move[1] = parseInt(obj.move[1]);
          gameState.bestMove = obj.move;
          console.log(gameState.bestMove);
          this.moveApiPlayer(gameState, depth);
        } else {
          console.log('alpha at the end  ' + obj.alpha);
          return obj.alpha;
        }

      }
    }()),

    'move' : function (player, board, row, col) {
      board[row][col] = player;
      return board;
    },

    'winner' : function (board) {
      if (this.checkWinnerRow(board) ||
          this.checkWinnerCol(board) ||
          this.checkWinnerDiagonal(board)) {
        console.log('there is a winner');
        return true;
      }
    },

  	'score' : function (board) {
      console.log('score');
      console.log(this.scoreTotal(this.scoreRow(board)) + 
               this.scoreTotal(this.scoreCol(board)) + 
               this.scoreTotal(this.scoreDiagonal(board)));
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
      for(var row = 5; row > 0; row -= 1) {
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
        if ((strRow.match(/1,1,1,1/)) || (strRow.match(/2,2,2,2/))) {
          return true;
        } else if (strRow.match(/0,0,0,0,0,0,0/)) {
          return;
        }
      }
    },

    'checkWinnerCol' : function (board) {
      for (var col = 0; col < 7; col += 1) {
        var colStrMaker = [];
        for (var row = 5; row >=0; row -= 1) {
          colStrMaker.push(board[row][col]);
        }
        var strCol = colStrMaker.join();
        if ((strCol.match(/1,1,1,1/)) || (strCol.match(/2,2,2,2/))) {
          return true;
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