function GameInputManager() {
	this.events = {};
	if (window.navigator.msPointerEnabled) {
    	//Internet Explorer 10 style
    	this.eventTouchstart    = "MSPointerDown";
    	this.eventTouchmove     = "MSPointerMove";
    	this.eventTouchend      = "MSPointerUp";
  	} else {
    	this.eventTouchstart    = "touchstart";
    	this.eventTouchmove     = "touchmove";
    	this.eventTouchend      = "touchend";
	}

	this.listen();
}
GameInputManager.prototype.startButtonClicked = function(){
	this.emit("start");
};

GameInputManager.prototype.nextButtonClicked = function(){
	this.emit("next");
};
GameInputManager.prototype.listen = function() {
	var self = this;
	var gameContainer = document.getElementsByClassName("gamecontainer")[0];
	var nextButton = document.querySelector(".nextbutton");
	var startButton = document.querySelector("#start");
	
	nextButton.onclick = this.nextButtonClicked.bind(this);
	startButton.onclick = this.startButtonClicked.bind(this);
	
	
	var clickStartX;
	var clickStartY;
	var clickEndX;
	var clickEndY;

	var mouseClickedInGame = false;
	var dragging = false;

	if('ontouchstart' in document.documentElement){

		
		gameContainer.addEventListener(this.eventTouchstart, function(e) {
			if((!window.navigator.msPointerEnabled && e.touches.length > 1) || e.targetTouches > 1){
				return; // ignore if touching with more than 1 finger	
			}
			
			if(window.navigator.msPointerEnabled) {
				touchStartClientX = event.pageX;
				touchStartClientY = event.pageY;
			} else {
				touchStartClientX = event.touches[0].clientX;
				touchStartClientY = event.touches[0].clientY;
			}
			mouseClickedInGame = true;
			dragging = true;
			e.preventDefault();
		});
		
		gameContainer.addEventListener(this.eventTouchmove, function(e){
			console.log(e);
			e.preventDefault();
			if(dragging){
				if(e.x){
					var mouseX = e.x - gameContainer.offsetLeft;
					var mouseY = e.y - gameContainer.offsetTop;
				} else {
					var mouseX = e.pageX;
					var mouseY = e.pageY;
				}
				var data = {
							mouse : {x: mouseX, y: mouseY}, 
							start : {x: clickStartX, y: clickStartY},
							offsetLeft : gameContainer.offsetLeft,
							offsetTop : gameContainer.offsetTop
							};
				self.emit("drag", data);
			}
		});
		
		gameContainer.addEventListener(this.eventTouchend, function(e){
			if((!window.navigator.msPointerEnabled && event.touches.length > 0) || event.targetTouches > 0) {
				return; // ignore if still touching
			}
			
			if(mouseClickedInGame){
				mouseClickedInGame = false;
				dragging = false;
				
				var clickEndX = e.x - gameContainer.offsetLeft;
				var clickEndY = e.y - gameContainer.offsetTop;
				
				var data = {
							mouse : {x: e.x - gameContainer.offsetLeft, y: e.y - gameContainer.offsetTop}, 
							start : {x: clickStartX, y: clickStartY},
							offsetLeft : gameContainer.offsetLeft,
							offsetTop : gameContainer.offsetTop
							};
				self.emit("dragEnd", data);

			}
		
		});
	} else {
		
		
		
		
		gameContainer.addEventListener('mousedown', function(e){
			console.log("DRAGGING MUFFA");
			mouseClickedInGame = true;
			dragging = true;
			clickStartX = e.x - gameContainer.offsetLeft;
			clickStartY = e.y - gameContainer.offsetTop;
		});
		
		window.addEventListener('mouseup', function(e){
			if(mouseClickedInGame){
				mouseClickedInGame = false;
				dragging = false;
				
				var clickEndX = e.x - gameContainer.offsetLeft;
				var clickEndY = e.y - gameContainer.offsetTop;
				
				var data = {
							mouse : {x: e.x - gameContainer.offsetLeft, y: e.y - gameContainer.offsetTop}, 
							start : {x: clickStartX, y: clickStartY},
							offsetLeft : gameContainer.offsetLeft,
							offsetTop : gameContainer.offsetTop
							};
				self.emit("dragEnd", data);

			}
		});
		
		gameContainer.addEventListener('mousemove', function(e) {
			if(dragging){
				var mouseX = e.x - gameContainer.offsetLeft;
				var mouseY = e.y - gameContainer.offsetTop;
				var data = {
							mouse : {x: mouseX, y: mouseY}, 
							start : {x: clickStartX, y: clickStartY},
							offsetLeft : gameContainer.offsetLeft,
							offsetTop : gameContainer.offsetTop
							};
				self.emit("drag", data);
			}
		});
		

	}
};


GameInputManager.prototype.on = function(event, callback) {
	if(!this.events[event]){ 
		this.events[event] = [];
	}
	this.events[event].push(callback);
};

GameInputManager.prototype.emit = function (event, data) {
	var callbacks = this.events[event];
	if (callbacks) {
		callbacks.forEach(function (callback) {
			callback(data);
		});
	}
};