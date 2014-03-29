function Grid(numRows, previousStateTiles, previousStateStartTiles){
	this.tiles;
	this.mateCount = 0;
	if(numRows % 2 == 1){
		throw("GRID SIZE MUST BE EVEN");
	} else {
		this.size = numRows;
	}
	if(previousStateTiles){
		this.tiles = previousStateTiles;
		this.startTiles = previousStateStartTiles;
	} else {
		this.createNewGrid();

	}
}

Grid.prototype.initGrid = function(){
	this.tiles = [];
	this.genArray(this.tiles);
	this.tiles = shuffle(this.tiles);
	this.registerMates();

};

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

Grid.prototype.genArray = function(array){
	var halfSize = this.size*this.size/2;
	var stayOnCurNumProb = .5;
	var curNum = 1;
	for(var i = 0; i < halfSize; i++){
		array.push(new Tile(curNum));
		if(Math.random() > stayOnCurNumProb){
			curNum++;
		}
	}
	for(var i = halfSize; i < 2*halfSize; i++){
		array.push(array[i-halfSize]);
	}
};

Grid.prototype.registerMates = function(){
	this.mateCount = 0;
	for(var i = 0; i < this.size*this.size; i++){
		var adjacent = this.getAdjacentTileNumbers(i);
		var isMated = 0;
		for(var j = 0; j < adjacent.length; j++){
		
			if(this.tiles[i].number == this.tiles[adjacent[j]].number){
				this.tiles[i].mated = true;
				
				isMated++;
			} 
		}
		if(isMated == 0){
			
			this.tiles[i].mated = false; // not sure if this is necessary right now
		} else {
			this.mateCount++;
		}
	}
};
Grid.prototype.createNewGrid = function(){
	do{
		this.initGrid();
	} while(this.mateCount > 0);
	this.startTiles = this.tiles.slice(0); // for retrying current level

	location.reload(); // fixes tile mated glitch
};

Grid.prototype.getAdjacentTileNumbers = function(tileIndex){
	var adjacent = [];
	if(tileIndex - 1 >= 0){
		if((tileIndex - 1) % this.size < (this.size-1)){
			adjacent.push(tileIndex-1);
		}
	}
	if(tileIndex + 1 <= this.size*this.size-1){
		if((tileIndex + 1) % this.size > 0){
			adjacent.push(tileIndex+1);
		}
	}
	if(tileIndex - this.size >= 0){
		adjacent.push(tileIndex - this.size);
	}
	if(tileIndex + this.size <= this.size*this.size-1){
		adjacent.push(tileIndex + this.size);
	}
	return adjacent;
}
Grid.prototype.serialize = function(){	
	return {
		size: this.size,
		tiles: this.tiles,
		startTiles: this.startTiles
	};
};