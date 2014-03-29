function Timer(t, inputManager){
	this.time = t;
	this.inputManager = inputManager;
}
Timer.prototype.start = function(){
	this.inputManager.emit("tick",this.time);
	this.counter = setInterval(this.actOnTime.bind(this),1000);
};
Timer.prototype.actOnTime = function(){
	this.time = this.time - 1;
	this.inputManager.emit("tick",this.time);
	if(this.time <= 0){
		this.inputManager.emit("lose");
		clearInterval(this.counter);
		return;
	}
};
Timer.prototype.serialize = function(){
	return{
		time: this.time
	};
};