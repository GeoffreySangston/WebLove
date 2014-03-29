function Tile(num){
	this.number = num;
	
	this.mated;
}

Tile.prototype.serialize = function(){
	return {
		number: this.number,
		mated: this.mated
	};
};