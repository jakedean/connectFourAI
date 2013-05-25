;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var player = require('./player'),
    board = require('./board'),
    gameAI = require('./gameAI');


window.addEventListener('load', eventWindowLoaded, false);

if (!Array.prototype.extend) {
    
  Array.prototype.extend = function (object) {

    for (key in object) {

      if (typeof object[key] === 'object' 
         && typeof this[key] === 'object'
         && this.hasOwnProperty(key)) {

        this[key].extend(object[key]);      
      
      } else {    
        if (object[key] instanceof Array) {
        	this[key] = object[key].slice(0);
        } else {
          this[key] = object[key];      
        }
      }
    }    
    return this;  
  };
};

function eventWindowLoaded() {
	canvasApp();
}

function canvasApp() {

	var myCanvas = document.getElementById('myCanvas'),
	    ctx = myCanvas.getContext('2d'),
	    myBoard = board(),
	    gameState = myBoard.createGameArray(),
	    myPlayer = player(),
	    myAI = gameAI();

	var update = function (ctx, myCanvas) {
  	myBoard.drawGameBoard(ctx, myCanvas);
  }

	myCanvas.addEventListener('click', function (e) {
		var result = myPlayer.move(e, gameState);
		if (result === true) {
      update(ctx, myCanvas);
      myAI.bestMove(gameState, 1);
      console.log(gameState)
		}
	});



  update(ctx, myCanvas);

}
},{"./player":2,"./board":3,"./gameAI":4}],2:[function(require,module,exports){
module.exports = (function () {

  var playerProto = {

  	'locateMousePos' : function (e) {
  		var myCanvas = document.getElementById('myCanvas');
      return {
      	'x' : Math.floor(
      		  e.clientX
      		  + document.body.scrollLeft
      		  + document.documentElement.scrollLeft
      		  - myCanvas.offsetLeft
      		  ),
      	'y' : Math.floor(
      		  e.clientY
      		  + document.body.scrollTop
      		  + document.documentElement.scrollTop
      		  - myCanvas.offsetTop
      		  )
      };
  	},

  	'move' : function (e, gameState) {
  		var myCanvas = document.getElementById('myCanvas');
  		var mousePos = this.locateMousePos(e);
      if (mousePos.x > myCanvas.offsetLeft + 25 &&
      	  mousePos.x < (myCanvas.offsetLeft) + (myCanvas.width + 25) &&
      	  mousePos.y > myCanvas.offsetTop + 25 &&
      	  mousePos.y < (myCanvas.offsetTop) + (myCanvas.height - 25) &&
      	  gameState.turn === 1) {
      	var columnIndex = Math.floor((mousePos.x - myCanvas.offsetLeft - 75)/100);
      	for (var i = 5; i >= 0; i -= 1) {
      		if (gameState.gameBoard[i][columnIndex] === 0) {
      			gameState.gameBoard[i][columnIndex] = 1;
      			gameState.turn = 2;
      			return true;
      		}
      	}
      }
  	}
  }

  return function () {
  	return Object.create(playerProto);
  }

}());
},{}],3:[function(require,module,exports){
module.exports = (function () {
  var gameInitProto = {

  	'createGameArray' : function () {
  		var gameBoard = [];
  		for (var i = 0; i < 6; i += 1) {
        gameBoard.push([]);
  			for (var k = 0; k < 7; k += 1) {
          gameBoard[i].push(0);
  			}
  		}
  		this.gameBoard = gameBoard;
  		this.turn = 1;
  		return this;
  	},

  	'drawGameBoard' : function (ctx, myCanvas) {
  		//set fill
  		ctx.fillStyle = '#000000'
  		ctx.lineWidth = 5;
      //draw outline
      ctx.strokeRect(0,0,myCanvas.width, myCanvas.height);

      //draw background
      ctx.strokeRect(25,25,myCanvas.width-50, myCanvas.height-50)

      //draw vertical lines
      for (var i = 25; i < myCanvas.width-25; i += 100) {
      	ctx.beginPath();
      	ctx.moveTo(i,25);
      	ctx.lineTo(i,myCanvas.height-25);
      	ctx.closePath();
      	ctx.stroke();
      }

      //draw horizontal lines
      for (var k = 25; k < myCanvas.height-25; k += 100) {
      	ctx.beginPath();
      	ctx.moveTo(25,k);
      	ctx.lineTo(myCanvas.width-25,k);
      	ctx.closePath();
      	ctx.stroke();
      }
      
      //draw slots
      for (var j = 0; j < 6; j += 1) {
      	for (var m = 0; m < 7; m += 1) {
      		if (this.gameBoard[j][m] === 0) {
      			ctx.fillStyle = '#FFFFFF';
      		} else if (this.gameBoard[j][m] === 1) {
      			ctx.fillStyle = '#0000FF';
      		} else {
      			ctx.fillStyle = '#003300'
      		}
      		ctx.beginPath();
      		ctx.arc((25 + (m * 50) + ((m + 1) * 50)), (25 + (j * 50) + ((j + 1) * 50)), 40, 0, Math.PI*2, true)
          ctx.closePath();
          ctx.fill();
          ctx.lineWidth = 5;
          ctx.strokeStyle = '#000000';
          ctx.stroke(); 
      	}
      }
  	}
  }

  return function () {
  	return Object.create(gameInitProto);
  }

}());

},{}],4:[function(require,module,exports){
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
},{}]},{},[1])
;