var player = require('./player'),
    board = require('./board'),
    logic = require('./logic');


window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
	canvasApp();
}

function canvasApp() {
	var myCanvas = document.getElementById('myCanvas');
	var ctx = myCanvas.getContext('2d');
	var myBoard = board();
	var gameState = myBoard.createGameArray();
	var myPlayer = player();

	var update = function (ctx, myCanvas) {
  	myBoard.drawGameBoard(ctx, myCanvas);
  }

	myCanvas.addEventListener('click', function (e) {
		myPlayer.move(e, gameState);
		update(ctx, myCanvas);
	});

  update(ctx, myCanvas);

}