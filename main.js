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