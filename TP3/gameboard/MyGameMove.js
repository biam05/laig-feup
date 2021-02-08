/**
 * Class MyGameMove
 * Represents a Valid or Invalid Move in the Game
 */
class MyGameMove {
    /**
     * MyGameMove
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {int} dimensions - dimensions of the board
     * @param {String} initialBoard - prolog board before the movement
     * @param {int} player - player on the move
     */
    constructor(scene, dimensions, initialBoard, player) {
        this.scene = scene;
        this.dimensions = dimensions;
        this.initialBoard = initialBoard;
        this.player = player;
    }

    /**
     * Transform the Prolog Board from String to List
     */
    getInitialBoard() {
        var boardStr = this.initialBoard.substring(2, this.initialBoard.length - 2);
        var auxList = boardStr.split("],[");
        
        var board = [];
        for (let i = 0; i < auxList.length; ++ i) {
            var line = auxList[i].split(",");
            for (let j = 0; j < line.length; ++j) {
                line[j] = line[j][1];
            }
            board.push(line);
        }
        return board;
    }
}