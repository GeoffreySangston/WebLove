function GameManager(size, InputManager, Actuator, StorageManager){
	this.startingSize = size;
	this.inputManager = new InputManager;
	this.actuator = new Actuator;
	this.storageManager = new StorageManager;
	
	this.inputManager.on("swap", this.swapTiles.bind(this));
	this.inputManager.on("drag", this.dragTile.bind(this));
	this.inputManager.on("dragEnd", this.endDragTile.bind(this));
	this.inputManager.on("next", this.next.bind(this));
	this.inputManager.on("lose", this.lose.bind(this));
	this.inputManager.on("tick", this.tick.bind(this));
	this.inputManager.on("start", this.start.bind(this));
	
	var timerState = this.storageManager.getTimerState();
	if(timerState){
		if(timerState.time <= 0){
			this.actuator.start(false); // starts new game
		} else {
			this.actuator.start(true); // starts game at saved time
		}
		this.setup(false);
	} else {
		this.actuator.start(false);
		//this.setup(true);
	}
}
GameManager.prototype.start = function(){
	this.actuator.start(true,false);
	this.setup(true);
};
GameManager.prototype.nextRound = function(){
	this.score += this.timer.time;
		this.timer.time = 50;
		this.storageManager.setTime(this.timer.serialize());
		this.grid.createNewGrid();
};
GameManager.prototype.tick = function(time){
	this.actuator.updateTime(time);
	this.storageManager.setTime(this.timer.serialize());
};



GameManager.prototype.setup = function(startNew){
	var previousState = this.storageManager.getGameState();
	var timerState = this.storageManager.getTimerState();
	if(previousState && !startNew){
		this.grid = new Grid(previousState.grid.size,previousState.grid.tiles, previousState.grid.startTiles);
		this.timer = new Timer(timerState.time-1,this.inputManager);
		this.score = previousState.score;
	} else {
		this.grid = new Grid(this.startingSize);
		this.timer = new Timer(50, this.inputManager);
		this.score = 0;
	}
	this.timer.start();
	this.actuate();
};

//Sends the updated grid to the actuator
GameManager.prototype.actuate = function(){
	this.grid.registerMates();

	if(this.grid.mateCount >= this.grid.size*this.grid.size){ // make next puzzle and reset time
		this.nextRound();
	}
	
	if(this.storageManager.getBestScore() < this.score){
		this.storageManager.setBestScore(this.score);
	}
	
	this.storageManager.setGameState(this.serialize());
	this.actuator.actuate(this.grid, {
		score:		this.score,
		bestScore:	this.storageManager.getBestScore(),
	});
};

GameManager.prototype.swapTiles = function(sc,ec){ // start cell end cell
	if(!this.grid.tiles[sc].mated && !this.grid.tiles[ec].mated){
		var temp = this.grid.tiles[sc];
		this.grid.tiles[sc] = this.grid.tiles[ec];
		this.grid.tiles[ec] = temp;
		
	}
	this.actuate();
};

var element;
var counter = 0; // using this to make sure the tile selected is alway on top of all the others
GameManager.prototype.dragTile = function(data){
	if(!this.dragging){
		this.startTopScroll = document.body.scrollTop;
	}
	this.dragging = true;

	if(!element){
		counter++;
		if(document.elementFromPoint(data.mouse.x + data.offsetLeft,data.mouse.y + data.offsetTop).classList[0] == "tile-inner"){
			element = document.elementFromPoint(data.mouse.x + data.offsetLeft,data.mouse.y + data.offsetTop).parentNode;
		} else if(document.elementFromPoint(data.mouse.x + data.offsetLeft,data.mouse.y + data.offsetTop).classList[0] == "tile") {
			element = document.elementFromPoint(data.mouse.x + data.offsetLeft,data.mouse.y + data.offsetTop);
		}
		element.startTop = element.style.top;
		element.startLeft = element.style.left;

	}
	if(!hasClass(element, "tile-mated")){
		element.style.top = (data.mouse.y - parseInt(element.style.height)/2 + document.body.scrollTop) + "px";
		element.style.left = (data.mouse.x -parseInt(element.style.width)/2)+ "px";
		element.style.zIndex = counter;
	}

};

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

GameManager.prototype.endDragTile = function(data){
	this.dragging = false;
	if(!hasClass(element, "tile-mated")){
		var dx = data.mouse.x - data.start.x;
		var absDx = Math.abs(dx);	

		var dy = data.mouse.y - data.start.y;
		var absDy = Math.abs(dy);
	
		if(Math.max(absDy,absDx) > 500/(2.8*this.grid.size)){
			var tileNum;
			var swapTile;
			if(absDy > absDx){
				tileNum = this.getTileNumFromCoords(data.start.x,data.start.y+this.startTopScroll);
				if(dy > 0){
					swapTile = tileNum + this.grid.size;
				} else {
					swapTile = tileNum - this.grid.size;
				}
			} else {
				tileNum = this.getTileNumFromCoords(data.start.x,data.start.y+this.startTopScroll);
				if(dx > 0){
					swapTile = tileNum + 1;
				} else {
					swapTile = tileNum - 1;
				}
			}
			if(this.isValidSwapAndNumTile(tileNum, swapTile)){ //(swapTile >= 0 && swapTile <= this.grid.size*this.grid.size-1)
				this.swapTiles(tileNum, swapTile);
			} else {
				element.style.top = element.startTop;
				element.style.left = element.startLeft;
			}
		} else {
			element.style.top = element.startTop;
			element.style.left = element.startLeft;
		}
	
	}
	element = null;
	
};

GameManager.prototype.isValidSwapAndNumTile = function(numTile, swapTile){
	if(numTile < 0 || swapTile < 0){
		return false;
	} else if(numTile > this.grid.size*this.grid.size -1 || swapTile > this.grid.size*this.grid.size-1){
		return false;
	} else if((numTile % this.grid.size == 0) && (swapTile % this.grid.size == this.grid.size -1)){
		return false;
	} else if((numTile % this.grid.size == this.grid.size-1) && (swapTile % this.grid.size == 0)){
		return false;
	}
	return true;
}
GameManager.prototype.next = function(){
	this.grid.tiles = this.grid.startTiles.slice(0);
	this.actuate();
};

GameManager.prototype.lose = function(){
	this.actuator.lose();
};

GameManager.prototype.getTileNumFromCoords = function(x,y){
	var gameContainer = document.querySelector(".gamecontainer");
	var tileWidth = (parseInt(gameContainer.style.width)/(this.grid.size));
	var tileHeight = (parseInt(gameContainer.style.height)/(this.grid.size));
	var tileX = Math.floor(x/tileWidth);
	var tileY = Math.floor(y/tileHeight);
	
	return tileX + this.grid.size*tileY;
};


GameManager.prototype.serialize = function(){
	return {
		grid:			this.grid.serialize(),
		score:			this.score,
	};
};