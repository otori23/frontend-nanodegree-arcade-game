## Frogger game

The objective of the game is to move the player character from the grass region at the bottom 
of the game board, to the water region at the top of the game board.

Open index.html, in a web browser, to begin game play

Use the arrow keys on your keyboard to move the player on the game board

The game board displays the player's score and health statistics. The player's score is displayed 
on the top left, and the player's health is displayed on the top right

The player can collect items on the game board. The collectable items are randomly selected and 
placed on the game board. These items are:
i)   Heart: adds +1 to player's health status
ii)  Blue Gem: adds +1 to player's score
iii) Green Gem: adds +3 to player's score
iv)  Orange Gem: adds +5 to player's score

The placement of collectables happens at the beginning of the game, and on successfully reaching 
the water region

When the player's health status reaches 0, then game play ends. Press the "Esc" key to start a new
game session

The relevant files in the project are:

* **index.html**: The main HTML document. Contains links to all of the CSS and JS resources needed to implement the game.
* **js/app.js**: Contains the object models for the game entities
* **js/engine.js**: Contains the game loop (i.e. the 'main' function)
* **js/resources.js**: Implements a simple image loading utility which supports caching previously loaded images  
* **css/style.css**: Contains all of the CSS needed to style the page.
* **README.md**: The GitHub readme file.
* and some images in the images directory.