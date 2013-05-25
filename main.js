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
	    gameState.storedAlpha = -(Math.pow(2,53));

	var update = function (ctx, myCanvas) {
  	myBoard.drawGameBoard(ctx, myCanvas);
  }

	myCanvas.addEventListener('click', function (e) {
		var result = myPlayer.move(e, gameState);
		if (result === true) {
      update(ctx, myCanvas);
      myAI.minimax(gameState, 1);
      update(ctx, myCanvas);
		}
	});



  update(ctx, myCanvas);

}