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
    }

    /**
     * Get the Tile in this Column and Line of the GameBoard
     * @param {int} column - tile's column
     * @param {int} line - tile's line
     */
    getTile(column, line) {
        var x = parseInt(this.scene.selectedDimension) - line;
        var y = column - 1;
        var tile = this.tiles[x * parseInt(this.scene.selectedDimension) + y];
        return tile;
    }

    /**
     * Display GameBoard
     */
    display() {        
        for (var i = 0; i < this.tiles.length; ++ i) {
            this.tiles[i].display();
        }
    }
    
    /**
     * Transform the Prolog Board into the Game Board in JS
     * @param {List of chars} prologBoard - prolog version, in list, of the gameboard
     */
    toJS(prologBoard) {
        this.tiles = [];
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
                    console.log("Error getting tile:", line, column, prologBoard[line][column]);
                }
                this.tiles.push(tile);
            }
        }
    }

    /**
     * Turn the GameBoard in JS into a Prolog Board (in String)
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
                symbol = "'E'";
            }
            else if (piece.getColor() ==  'red') {
                symbol = "'X'";
            }
            else if (piece.getColor() == 'blue') {
                symbol = "'O'";
            }
            else {
                console.log("Error in Piece Color.\n");
            }
            board += symbol;
            if (count == parseInt(this.scene.selectedDimension)) {
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
