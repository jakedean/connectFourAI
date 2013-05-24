;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var player = require('./player'),
    board = require('./board'),
    gameAI = require('./gameAI');


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
	    myAI = gameAI();

	var update = function (ctx, myCanvas) {
  	myBoard.drawGameBoard(ctx, myCanvas);
  }

	myCanvas.addEventListener('click', function (e) {
		var result = myPlayer.move(e, gameState);
		if (result === true) {
      update(ctx, myCanvas);
      myAI.availableMoves(gameState);
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

  	'availableMoves' : function (gameState) {
      var board = gameState.gameBoard,
          possibleMoves = {};

      for (var col = 0; col < 7; col += 1) {
      	for (var row = 5; row >= 0; row -= 1) {
      		if (board[row][col] === 0) {
      			console.log('row ' + row);
      			console.log('column ' + col);
      			possibleMoves[col] = row;
      			break;
      		}
      	}
      }
      console.log(JSON.stringify(possibleMoves));
      return;
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
},{}]},{},[1])
;