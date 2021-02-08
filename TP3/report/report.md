# User's Manual
## Starting the Program
1. Initialize SICStus Prolog.
2. Consult the file ```server.pl``` inside the folder ```plog```.
3. Execute the command ```server.```
4. Start a HTML server in the project folder and select the folder TP3.
5. Open the browser in the desired URL (the URL from the HTML server just started).

## The TALPA Game

### Objective

The goal of our game is to open a path of empty spaces between opposite sides with the same color
    without opening a similar route between the sides with the enemy color.

### Game Board

The gameboard is an 8x8 board.
It can also be in 6x6 for beginners and faster games or 10x10 for experienced players and longer games.

The red player owns the top and bottom edges while the blue player owns the left and right ones.

The corner between edges is part of both sides.

### Game Start

At the start of the game, all the pieces are inside the gameboard.
Their position is in such a pattern that there are no orthogonally adjacent pieces from the same player.

The starting player is red. 

### Rules

The turns alter, and the players move alternately.

When it is their turn, the player should move one of his pieces, capturing an enemy one,
    either horizontally adjacent or vertically adjacent, and leaving his in that spot.

If possible, the player must capture enemy pieces.
However, when that is no longer possible, the player removes one of his own.

### Win Conditions

The only way to win is to connect orthogonally (horizontally or vertically, but not diagonally)
    adjacent empty squares to form a path between the player's sides 
    without creating a similar route between the enemy's sides.

If a player opens a path between his sides in the same move/turn as a path between the enemy's sides, he loses.

There are no draws.

## User Instructions
### Piece Movement
- To move a piece, click on your piece and then the opponent's piece that you wish to capture.
- To remove a piece, click twice on the piece you want to remove.
If the selected move is valid, it will execute. Otherwise, you will have to choose another movement.

### Buttons Functionality
TODO
