function Tile(num){
	this.number = num;
	
	this.mated = false;
}

Tile.prototype.serialize = function(){
	return {
		number: this.number,
		mated: this.mated
	};
};