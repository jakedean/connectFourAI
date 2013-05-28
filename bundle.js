;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
require('./extend');
var player = require('./player'),
    board = require('./board'),
    aiConstructor = require('./gameAI');


window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
	canvasApp();
}

function canvasApp() {

	var myCanvas = document.getElementById('myCanvas'),
	    ctx = myCanvas.getContext('2d'),
	    myBoard = board(),
	    gameState = myBoard.createGameArray(),
	    myPlayer = player(),
	    myAI = aiConstructor({ 'depth' : 2 });
      gameState.storedAlpha = -(Math.pow(2,53));

	var update = function (ctx, myCanvas) {
  	myBoard.drawGameBoard(ctx, myCanvas);
  }

	myCanvas.addEventListener('click', function (e) {
		var result = myPlayer.move(e, gameState);
		if (result === true) {
      update(ctx, myCanvas);
      myAI.minimax2(gameState);
      update(ctx, myCanvas);
		}
	});



  update(ctx, myCanvas);

}
},{"./extend":2,"./player":3,"./board":4,"./gameAI":5}],2:[function(require,module,exports){
// All credit to Anthony Nardi
// git@github.com:anthony-nardi/Extends.git

if (!Object.prototype.extend) {

  Object.prototype.extend = function (object) {

    for (key in object) {

      if (typeof object[key] === 'object' 
         && typeof this[key] === 'object'
         && this.hasOwnProperty(key)) {
        
        this[key].extend(object[key]);

      } else {
        this[key] = object[key];
      }
    }
    return this;
  };
};


if (!Array.prototype.arrayExtend) {
    
  Array.prototype.arrayExtend = function (object) {

    for (key in object) {

      if (typeof object[key] === 'object' 
         && typeof this[key] === 'object'
         && this.hasOwnProperty(key)) {

        this[key].arrayExtend(object[key]);      
      
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
},{}]},{},[1])
;