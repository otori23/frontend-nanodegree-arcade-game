// Entity class is an abstract base class that all game entities will inherit from
var Entity = function() {
	this.sprite = '';
	this.xStart = 0;
	this.yStart = 0;
	this.x = this.xStart;
	this.y = this.yStart;
};

// # of pixels that translates to one step in the x direction
Entity.prototype.xStep = 101;

// # of pixels that translates to one step in the y direction
Entity.prototype.yStep = 83;

// a list of rows from which an Enemy instance will randomly select from
Entity.prototype.rows = [1, 2, 3];

// a list of rows from which an Enemy instance will randomly select from
Entity.prototype.columns = [0, 1, 2, 3, 4];

// The abstract update method needs to be overridden in the derived classes
Entity.prototype.update = function(dt) {
	throw new ApplicationException("Entity update method needs an implementation.");
};

Entity.prototype.updatePlayerStats = function(aPlayer) {
	throw new ApplicationException("Entity updatePlayerStats method needs an implementation.");
};

// Default implementation of how to render an Entity
Entity.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Entity.prototype.resetPosition = function() {
	this.x = this.xStart;
	this.y = this.yStart;
};

Entity.prototype.getX = function() {
	return this.x;
};

Entity.prototype.getY = function() {
	return this.y;
};

Entity.prototype.getXstep = function() {
	return this.xStep;
};

Entity.prototype.getYstep = function() {
	return this.yStep;
};

// Enemy Class
//---------------------------------------------------------------------------------------------------------

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Entity.call(this);
	this.sprite = 'images/enemy-bug.png';
	this.speed = this.speeds.randomElement();
	this.xStart = -1*this.xStep;
	this.yStart = this.rows.randomElement()*this.yStep - 20;
	this.x = this.xStart;
	this.y = this.yStart;
};

// link parts of Enemy and Entity that are same for instances
Enemy.prototype = Object.create(Entity.prototype); // Enemy.prototype obj delegates to Entity.prototype

// The default prototype which we overwrote in previous line came with a .constructor property
// We need to add this back to our version of the protptype object
Enemy.prototype.constructor = Entity;

// a list of speeds from which an Enemy instance will randomly select from
Enemy.prototype.speeds = [150, 175, 200, 300, 400, 400, 400];

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// ----------------------------------------------------------
// If enemy has moved off the right boundry of the game board, reset the enemy's position and speed
// else update the enemy's postion to move it in the positive x-dir
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	var canvas = document.getElementsByTagName("canvas")[0];
	if(this.x > canvas.width) {
		this.x = this.xStart;
		this.y = this.rows.randomElement()*this.yStep - 20;
		this.speed = this.speeds.randomElement();
	}
	else {
		this.x += this.speed*dt;
	}
};

Enemy.prototype.updatePlayerStats = function(aPlayer) {
	aPlayer.lives--;
	if(aPlayer.lives < 0) aPlayer.lives = 0;
	player.resetPosition();
};

// Player Class
//---------------------------------------------------------------------------------------------------------

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	Entity.call(this);
	this.sprite = 'images/char-boy.png';
	this.xStart = 2*this.xStep;
	this.yStart = 5*this.yStep - 20;
	this.x = this.xStart;
	this.y = this.yStart;
	this.moveEvent = '';
	this.score = 0;
	this.lives = 3;
};

// link parts of Player and Entity that are same for instances
Player.prototype = Object.create(Entity.prototype); // Player.prototype obj delegates to Entity.prototype

// The default prototype which we overwrote in previous line came with a .constructor property
// We need to add this back to our version of the protptype object
Player.prototype.constructor = Entity;

// Update the player's position based on the movement direction logged in keyup event-handler.
// As the player position is updated, make sure that player stays within the bounds of the game.
// If the player falls into the water, reset the position to start position
Player.prototype.update = function() {
	if(this.lives === 0){
		this.x = -this.xStep;
		return;
	}

	var canvas = document.getElementsByTagName("canvas")[0];
	var playerImg = Resources.get(this.sprite);
	switch(this.moveEvent) {
		case 'left':
			this.x -= this.xStep;
		    if(this.x < 0) this.x += this.xStep
		    break;
		case 'up':
			this.y -= this.yStep;
		    if(this.y < 0) {
				this.resetPosition();
				this.score++;
				Collectable.place();
			}
		    break;
		case 'right':
			this.x += this.xStep;
		    if(this.x > canvas.width - playerImg.width) this.x -= this.xStep
		    break;
		case 'down':
			this.y += this.yStep;
			if(this.y > canvas.height - playerImg.height) this.y -= this.yStep
			break;
		default:
			break;
	}
	this.moveEvent = '';
};

// Store the move direction from the keyup event-handler in a state variable of the Player instance 
Player.prototype.handleInput = function(cmd) {
	if(this.lives === 0 && cmd === 'esc') {
		this.reset();
		return;
	}
	this.moveEvent = cmd;
};

// compare bounding rectangles of player and specified entity to check for a collision.
Player.prototype.collidesWith = function(entity) {
	var collision = !( 
		(entity.getX() + this.getXstep() < player.getX() + 50)   ||
		(entity.getX() > player.getX() + 50)  ||
		(entity.getY() > player.getY() + 40) ||
		(entity.getY() + this.getYstep() < player.getY() + 40)
	);

	if(collision) {
		entity.updatePlayerStats(this);
	}
	return collision;
};

// getter for player's score
Player.prototype.getScore = function() {
	return this.score;
}

// setter for player's score
Player.prototype.setScore = function(score) {
	this.score = score;
}

// getter for player's score
Player.prototype.getLives = function() {
	return this.lives;
}

// setter for player's score
Player.prototype.setLives = function(lives) {
	this.lives = lives;
}

Player.prototype.reset = function() {
	this.x = this.xStart;
	this.y = this.yStart;
	this.score = 0;
	this.lives = 3;
	Collectable.place();
}

// PlayerStat Class
//---------------------------------------------------------------------------------------------------------

var PlayerStats = function(player) {
	Entity.call(this);
	this.x = 0;
	this.y = 40;
	this.player = player;
	this.score = player.getScore();
};

// link parts of PlayerStat and Entity that are same for instances
PlayerStats.prototype = Object.create(Entity.prototype); // PlayerStat.prototype obj delegates to Entity.prototype

// The default prototype which we overwrote in previous line came with a .constructor property
// We need to add this back to our version of the protptype object
PlayerStats.prototype.constructor = Entity;

PlayerStats.prototype.update = function(dt) {
	this.score = this.player.getScore();
	this.lives = this.player.getLives();
};

PlayerStats.prototype.render = function() {
	ctx.save();
	
	var canvas = document.getElementsByTagName("canvas")[0];

	// Score
	ctx.font = "36pt serif";
	ctx.textAlign = "left";
	ctx.fillStyle = "blue";
	ctx.fillText(this.score.toLocaleString(), this.x, this.y);
	
	// Lives
	ctx.textAlign = "right";
	ctx.fillStyle = "red";
	ctx.fillText(this.lives.toLocaleString(), this.x + canvas.width - 50, this.y);

	// Heart
	var heartScale = 1/3;
	ctx.scale(heartScale, heartScale);
	ctx.drawImage(Resources.get('images/Heart.png'), this.x + (canvas.width/heartScale) - 125, this.y - 60);

	ctx.restore();
};

// gameEndBanner Class
//---------------------------------------------------------------------------------------------------------
var GameEndBanner = function() {
	Entity.call(this);
};

// link parts of GameEndBanner and Entity that are same for instances
GameEndBanner.prototype = Object.create(Entity.prototype); // GameEndBanner.prototype obj delegates to Entity.prototype

// The default prototype which we overwrote in previous line came with a .constructor property
// We need to add this back to our version of the protptype object
GameEndBanner.prototype.constructor = Entity;

GameEndBanner.prototype.update = function(dt) {
	// do nothing
};

GameEndBanner.prototype.render = function() {
	if(player.getLives() === 0){
		ctx.save();

		var canvas = document.getElementsByTagName("canvas")[0];
		this.x = 0.25*canvas.width;
		this.y = 0.25*canvas.height;
		this.width = 0.5*canvas.width;
		this.height = 0.5*canvas.height;

		// Background
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		
		// Message
		ctx.translate(this.x, this.y);
		ctx.font = "36pt serif";
		ctx.textAlign = "center";
		ctx.fillStyle = "blue";
		ctx.fillText("Press Esc", this.width/2, this.height/2);

		ctx.restore();
	}
};
//--------------------------------------------------------------------------------------------------------- 

// Collectable Class
//---------------------------------------------------------------------------------------------------------
var Collectable = function() {
	Entity.call(this);
	this.score = 0;
	this.xStart = -this.xStep;
	this.yStart = 0;
	this.resetPosition();
	this.moveEvent = '';
	this.moveCoord = [];
	Collectable.generateCoordList();
};

Collectable.generateCoordList = function() {
	Collectable.coordList = [];
	var cols = Entity.prototype.columns;
	var rows = Entity.prototype.rows;
	for(var i = 0; i < cols.length; i++) {
		for(var j = 0; j < rows.length; j++) {
			Collectable.coordList.push([cols[i], rows[j]]);
		}
	}
};

Collectable.getNextCoord = function() {
	var len = Collectable.coordList.length;
	if(len === 0) {
		throw new ApplicationException("Collectable Coord List is Empty.");
	}

	var i = Math.floor(Math.random() * len);
	return Collectable.coordList.splice(i, 1)[0];
};

Collectable.place = function() {
	indices = [];
	for(var i = 0; i < allCollectables.length; i++) {
		allCollectables[i].resetPosition();
		indices.push(i);
	}
	Collectable.generateCoordList();
	numUsedCollectables = [0, 1, 2, 3].randomElement();

	for(var i = 0; i < numUsedCollectables; i++) {
		index = Math.floor(Math.random() * indices.length);
		index = indices.splice(index, 1)[0];
		allCollectables[index].moveEvent = 'place';
		allCollectables[index].moveCoord = Collectable.getNextCoord();
	}
};

// link parts of Collectable and Entity that are same for instances
Collectable.prototype = Object.create(Entity.prototype); // Collectable.prototype obj delegates to Entity.prototype

// The default prototype which we overwrote in previous line came with a .constructor property
// We need to add this back to our version of the protptype object
Collectable.prototype.constructor = Entity;

// # of pixels that translates to one step in the y direction
Collectable.prototype.scale = 0.50;

// # of pixels that translates to one step in the x direction
Collectable.prototype.xStep = Entity.prototype.xStep / Collectable.prototype.scale;

// # of pixels that translates to one step in the y direction
Collectable.prototype.yStep = Entity.prototype.yStep / Collectable.prototype.scale;

Collectable.prototype.update = function(dt) {
	switch(this.moveEvent) {
		case 'place':
			this.x = this.moveCoord[0] * this.xStep;
			this.y = this.moveCoord[1] * this.yStep;
			break;
		case 'collision':
			this.resetPosition();
			break;
	}
	this.moveEvent = '';
};

Collectable.prototype.render = function() {
	ctx.save();

    ctx.scale(this.scale, this.scale);
	ctx.translate((this.xStep*this.scale)/2, (this.yStep*this.scale) - 10);
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

	ctx.restore();
};

Collectable.prototype.updatePlayerStats = function(aPlayer) {
	var newScore = aPlayer.getScore() + this.score;
	aPlayer.setScore(newScore);
	this.resetPosition();
};

Collectable.prototype.getX = function() {
	return this.x * this.scale;
};

Collectable.prototype.getY = function() {
	return this.y * this.scale;
};

Collectable.prototype.getXstep = function() {
	return this.xStep * this.scale;
};

Collectable.prototype.getYstep = function() {
	return this.yStep * this.scale;
};
//--------------------------------------------------------------------------------------------------------- 


// Heart Class
//---------------------------------------------------------------------------------------------------------
var Heart = function() {
	Collectable.call(this);
	this.score = 1;
	this.sprite = 'images/Heart.png';
};

// link parts of Heart and Collectable that are same for instances
Heart.prototype = Object.create(Collectable.prototype); // Heart.prototype obj delegates to Collectable.prototype

// The default prototype which we overwrote in previous line came with a .constructor property
// We need to add this back to our version of the protptype object
Heart.prototype.constructor = Collectable;

Heart.prototype.updatePlayerStats = function(aPlayer) {
	var numLives = aPlayer.getLives() + this.score;
	aPlayer.setLives(numLives);
	this.resetPosition();
};
//--------------------------------------------------------------------------------------------------------- 

// Gem Class
//---------------------------------------------------------------------------------------------------------
var Gem = function() {
	Collectable.call(this);
};

// link parts of Gem and Collectable that are same for instances
Gem.prototype = Object.create(Collectable.prototype); // Gem.prototype obj delegates to Collectable.prototype

// The default prototype which we overwrote in previous line came with a .constructor property
// We need to add this back to our version of the protptype object
Gem.prototype.constructor = Collectable;
//--------------------------------------------------------------------------------------------------------- 

// BlueGem Class
//---------------------------------------------------------------------------------------------------------
var BlueGem = function() {
	Gem.call(this);
	this.score = 1;
	this.sprite= 'images/Gem Blue.png';
};

// link parts of BlueGem and Gem that are same for instances
BlueGem.prototype = Object.create(Gem.prototype); // BlueGem.prototype obj delegates to Gem.prototype

// The default prototype which we overwrote in previous line came with a .constructor property
// We need to add this back to our version of the protptype object
BlueGem.prototype.constructor = Gem;
//--------------------------------------------------------------------------------------------------------- 

// GreenGem Class
//---------------------------------------------------------------------------------------------------------
var GreenGem = function() {
	Gem.call(this);
	this.score = 3;
	this.sprite= 'images/Gem Green.png';
};

// link parts of BlueGem and Gem that are same for instances
GreenGem.prototype = Object.create(Gem.prototype); // GreenGem.prototype obj delegates to Gem.prototype

// The default prototype which we overwrote in previous line came with a .constructor property
// We need to add this back to our version of the protptype object
GreenGem.prototype.constructor = Gem;
//--------------------------------------------------------------------------------------------------------- 

// OrangeGem Class
//---------------------------------------------------------------------------------------------------------
var OrangeGem = function() {
	Gem.call(this);
	this.score = 5;
	this.sprite= 'images/Gem Orange.png';
};

// link parts of BlueGem and Gem that are same for instances
OrangeGem.prototype = Object.create(Gem.prototype); // OrangeGem.prototype obj delegates to Gem.prototype

// The default prototype which we overwrote in previous line came with a .constructor property
// We need to add this back to our version of the protptype object
OrangeGem.prototype.constructor = Gem;
//--------------------------------------------------------------------------------------------------------- 

// a handleInput() method.
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
		27: 'esc',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Add a method to the Array class, the returns a randomly selected element from the array
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
};

// A utility class used for throwing application exceptions
function ApplicationException(message) {
   this.message = message;
   this.name = "ApplicationException";
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var allCollectables = [new Heart(), new BlueGem(), new GreenGem(), new OrangeGem()];
var player = new Player();
var playerStats = new PlayerStats(player);
var gameEndBanner = new GameEndBanner();