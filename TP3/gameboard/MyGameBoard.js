/**
 * MyGameBoard
 * Represents the Game Board in the Prolog Game
 */

class MyGameBoard {
    /**
     * MyGameBoard
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     */
    constructor(scene) {
        this.scene = scene;
        this.tiletexture = new CGFtexture(this.scene, "./scenes/images/tile.png");
        this.tiles = [];
        this.gameboard = [];
        /*for (var line = 8; line >= 1; -- line) {
            for (var column = 1; column <= 8; ++ column) {
                this.tiles.push(new MyTile(this.scene, [column, line]));
            }
        }*/
        this.removedPieces = [];
    }

    /**
     * Add Piece to the Removed Pieces List
     * @param {MyPiece} piece - Piece that got removed from the board 
     */
    addRemovedPiece(piece) {
        this.removedPieces.push(piece);
    }

    /**
     * Remove the Piece Standing on this Tile
     * @param {MyTile} tile - Tile where the Piece is Standing
     */
    removePiece(tile) {
        tile.unsetPiece(this);
    }

    /**
     * Remove the Piece Standing on this Position
     * @param {int} column
     * @param {int} line
     */
    removePieceByPosition(column, line) {
        var tile = this.getTile(column, line);
        this.removePiece(tile);
    }

    /**
     * Get the Piece Standing on this Tile
     * @param {MyTile} tile - Tile where the Piece is Standing
     */
    getPiece(tile) {
        return tile.getPiece();
    }

    /**
     * Get the Tile in this Column and Line of the GameBoard
     * @param {int} column
     * @param {int} line
     */
    getTile(column, line) {
        var x = 8 - line;
        var y = column - 1;
        var tile = this.tiles[x * 8 + y];
        return tile;
    }

    /**
     * Move the Piece from Starting Tile to Destination Tile
     * @param {MyTile} startingTile - Starting Tile
     * @param {MyTile} destinationTile - Destination Tile
     */
    movePiece(startingTile, destinationTile) {
        var piece = this.getPiece(startingTile);
        startingTile.unsetPiece();
        destinationTile.setPiece(this, piece);
    }

    /**
     * Move the Piece from Starting Position to Destination Position
     * @param {int} startingColumn 
     * @param {int} startingLine 
     * @param {int} destinationColumn 
     * @param {int} destinationLine 
     */
    movePieceByPosition(startingColumn, startingLine, destinationColumn, destinationLine) {
        var startingTile    = this.getTile(startingColumn, startingLine);
        var destinationTile = this.getTile(destinationColumn, destinationLine);
        this.movePiece(startingTile, destinationTile);
    }

    /**
     * Display GameBoard
     */
    display() {
        for (var i = 0; i < this.tiles.length; ++ i) {
            this.tiles[i].display();
        }
    }
    
    toJS(prologBoard) {
        for (let line = 0; line < prologBoard.length; ++ line) {
            for (let column = 0; column < prologBoard[line].length; ++ column) {  
                let tile = new MyTile(this.scene, [column + 1, line + 1], this.tiletexture);
                if (prologBoard[line][column] == "O") {       // blue
                    tile.piece = new MyPiece(this.scene, 'blue');
                }
                else if (prologBoard[line][column] == "X") {  // red
                    tile.piece = new MyPiece(this.scene, 'red');
                }
                else if (prologBoard[line][column] == "E") {  // red
                    // nothing
                }
                else {
                    console.log("Error getting tiles");
                }
                this.tiles.push(tile);
            }
        }
    }
    /**
     * Turn the GameBoard into a Prolog Board
     */
    toProlog() {
        var board = "[";
        var piece;
        var symbol;
        let count = 1;
        for (var tile = 0; tile < this.tiles.length; ++ tile) {
            if (count == 1) board += "[";
            piece = this.tiles[tile].getPiece();
            if      (      piece      ==  null ) {
                symbol = "E";
            }
            else if (piece.getColor() ==  'red') {
                symbol = 'X';
            }
            else if (piece.getColor() == 'blue') {
                symbol = 'O';
            }
            else {
                console.log("Error in Piece Color.\n");
            }
            board += symbol;
            if (count == 8) {
                board += "],";
                count = 0;
            }
            else{
                board += ",";
            }
            ++ count;
        }
        let final = board.substring(0, board.length - 1);
        final += "]";
        return final;
    }
}
