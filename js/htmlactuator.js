function HTMLActuator() {
	this.tileContainer = document.querySelector(".tilecontainer");
	this.scoreContainerNumber = document.querySelector(".scorecontainer_number");
	this.bestContainerNumber = document.querySelector(".bestcontainer_number");
	this.messageContainer = document.querySelector(".gamemessage");
	this.gameContainer = document.querySelector(".gamecontainer");
	this.gameMetaBar = document.querySelector(".gamemetabar");
	this.timerDiv = document.querySelector(".timer");
	

	this.gameContainer.style.width = "500px";
	this.gameContainer.style.height = "500px";
}
HTMLActuator.prototype.start = function(inGame){
	if(inGame){
		this.gameMetaBar.style.WebkitTransition = "margin-top .5s";
		this.gameMetaBar.style.Transition = "margin-top .5s";
		this.gameMetaBar.style.MozTransition = "margin-top .5s";
		this.gameMetaBar.style.marginTop = "20px";
		
		this.messageContainer.style.display = "none";
	} else {
		this.gameMetaBar.style.marginTop = "-60px";
		this.messageContainer.style.display = "block";
	}
}

HTMLActuator.prototype.actuate = function(grid,metadata){
	var self = this;
	window.requestAnimationFrame(function () {
		self.clearContainer(self.tileContainer);
		for(var i = 0; i < grid.size*grid.size; i++){
			/*if(grid.tiles[i].mated){
				console.log("ADDTILE: " + grid.tiles[i].number + " at " + i + " is mated: " + grid.tiles[i].mated);
			}*/
			self.addTile(grid.tiles[i],{x: i%grid.size, y: Math.floor(i/grid.size)},grid.size);
		}
		
		self.updateScore(metadata.score);
		self.updateBest(metadata.bestScore);
		
	});
};
HTMLActuator.prototype.updateTime = function(time){
	this.timerDiv.innerHTML = time;
};
HTMLActuator.prototype.updateScore = function(score){
	this.clearContainer(this.scoreContainerNumber);
	this.scoreContainerNumber.textContent = score;
};

HTMLActuator.prototype.updateBest = function(score){
	this.clearContainer(this.bestContainerNumber);
	this.bestContainerNumber.textContent = score;
};

HTMLActuator.prototype.clearContainer = function(container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};


HTMLActuator.prototype.addTile = function(tile, pos, size){
	var self = this;
	var wrapper = document.createElement("div");
	var inner = document.createElement("div");
	
	var classes = ["tile"];
	if(tile.mated){
		classes.push("tile-mated");
	}
	
	this.applyClasses(wrapper,classes);
	inner.classList.add("tile-inner");
	
	if(tile.mated){
		inner.innerHTML = '&#9829;';
	} else {
		inner.textContent = tile.number;
	}
	
	//if(tile.previousPosition
	
	//inner.style.display = "table-cell";
	inner.style.width = (parseInt(this.gameContainer.style.width)/(1.1*size)) + "px";
	inner.style.height = parseInt(this.gameContainer.style.height)/(1.1*size) + "px";
	inner.style.lineHeight = inner.style.height;
	inner.style.fontSize = (parseInt(this.gameContainer.style.width)/(1.1*size))/2 + "px";
	inner.style.margin = "auto";
	inner.style.position = "absolute";
	inner.style.top = "0";
	inner.style.left = "0";
	inner.style.bottom = "0";
	inner.style.right = "0";
	inner.style.borderRadius = "6px";
	
	wrapper.appendChild(inner);
	//wrapper.style.display = "table";
	wrapper.style.width = (parseInt(this.gameContainer.style.width)/(size)) + "px";
	wrapper.style.height = parseInt(this.gameContainer.style.height)/(size) + "px";
	wrapper.style.top = ((parseInt(this.gameContainer.style.height)/size)*pos.y) + "px";
	wrapper.style.left = ((parseInt(this.gameContainer.style.width)/size)*pos.x) + "px";
	switch(tile.number){
	case 1:
		inner.style.backgroundColor = "#FF0000";
		break;
	case 2:
		inner.style.backgroundColor = "#00FF00";
		break;
	case 3:
		inner.style.backgroundColor = "#0000FF";
		break;
	case 4:
		inner.style.backgroundColor = "#FFFF00";
		break;
	case 5:
		inner.style.backgroundColor = "#FF00FF";
		break;
	case 6:
		inner.style.backgroundColor = "#00FFFF";
		break;
	case 7:
		inner.style.backgroundColor = "#F0F0F0";
		break;
	case 8:
		inner.style.backgroundColor = "#553300";
		break;
	case 9:
		inner.style.backgroundColor = "#928594";
		break;
	case 10:
		inner.style.backgroundColor = "#029485";
		break;
	case 11:
		inner.style.backgroundColor = "#293860";
		break;
	case 12:
		inner.style.backgroundColor = "#F99289";
		break;
	case 13:
		inner.style.backgroundColor = "#9934F4";
		break;
	case 14:
		inner.style.backgroundColor = "#749394";
		break;
	case 15:
		inner.style.backgroundColor = "#006633";
		break;
	case 16:
		inner.style.backgroundColor = "#830F4F";
		break;
	case 17:
		inner.style.backgroundColor = "#4F0F83";
		break;
	case 18:
		inner.style.backgroundColor = "#FF0099";
		break;
	}
	
		
	this.tileContainer.appendChild(wrapper);
}

HTMLActuator.prototype.applyClasses = function(element, classes){
	element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.lose = function(){
	this.gameMetaBar.style.marginTop = "-60px";
	this.messageContainer.style.display = "block";
	this.clearContainer(this.tileContainer);
};

