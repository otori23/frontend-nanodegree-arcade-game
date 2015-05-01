// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

	this.speeds = [150, 175, 200, 300, 400, 400, 400];
	this.rows = [1, 2, 3];
	this.speed = this.speeds.randomElement();
	this.xStep = 101;
	this.yStep = 83;
	this.xStart = -1*this.xStep;
	this.yStart = this.rows.randomElement()*this.yStep - 20;
	this.x = this.xStart;
	this.y = this.yStart;
	
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

	// if on left side of canvas
	// wrap around x pos
	// randomly select row (y pos)and speed
	// update x pos using current x and dt and velocity
	//this.x += 200*dt;
	//console.log("here");

	var canvas = document.getElementsByTagName("canvas")[0];
	if(this.x > canvas.width) {
		this.x = this.xStart;
		this.y = this.rows.randomElement()*this.yStep - 20;
		this.speed = this.speeds.randomElement();
	}
	else {
		this.x += this.speed*dt;
	}
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.sprite = 'images/char-boy.png';
	this.xStep = 101;
	this.yStep = 83;
	this.xStart = 2*this.xStep;
	this.yStart = 5*this.yStep - 20;
	this.x = this.xStart;
	this.y = this.yStart;
};

Player.prototype.update = function() {
	// Implement
};

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(dir) {
	var canvas = document.getElementsByTagName("canvas")[0];
	var playerImg = Resources.get(this.sprite);
	switch(dir) {
		case 'left':
			this.x -= this.xStep;
		    if(this.x < 0) this.x += this.xStep
		    break;
		case 'up':
			this.y -= this.yStep;
		    if(this.y < 0) {
				this.x = this.xStart;
				this.y = this.yStart;
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
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();

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