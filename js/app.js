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

// The abstract update method needs to be overridden in the derived classes
Entity.prototype.update = function(dt) {
	throw new ApplicationException("Entity update method needs an implementation.");
};

// Default implementation of how to render an Entity
Entity.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Entity.prototype.resetPosition = function() {
	this.x = this.xStart;
	this.y = this.yStart;
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

// a list of rows from which an Enemy instance will randomly select from
Enemy.prototype.rows = [1, 2, 3];

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
Player.prototype.handleInput = function(dir) {
	this.moveEvent = dir;
};

// compare bounding rectangles of player and specified entity to check for a collision.
Player.prototype.collidesWith = function(entity) {
	return !( 
		(entity.x + this.xStep < player.x + 50)   ||
		(entity.x > player.x + 50)  ||
		(entity.y > player.y + 40) ||
		(entity.y + this.yStep < player.y + 40)
	);
};

// getter for player's score
Player.prototype.getScore = function() {
	return this.score;
}

// setter for player's score
Player.prototype.setScore = function(score) {
	this.score = score;
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
PlayerStats.prototype = Object.create(Entity.prototype); // Player.prototype obj delegates to Entity.prototype

// The default prototype which we overwrote in previous line came with a .constructor property
// We need to add this back to our version of the protptype object
PlayerStats.prototype.constructor = Entity;

PlayerStats.prototype.update = function(dt) {
	this.score = this.player.getScore();
};

PlayerStats.prototype.render = function() {
	ctx.save();
	
	// Score
	ctx.font = "36pt serif";
	ctx.textAlign = "left";
	ctx.fillStyle = "black";
	ctx.fillText(this.score, this.x, this.y);
	
	ctx.restore();
};

//--------------------------------------------------------------------------------------------------------- 

// a handleInput() method.
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
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
var player = new Player();
var playerStats = new PlayerStats(player);