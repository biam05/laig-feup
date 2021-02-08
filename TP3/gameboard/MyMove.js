/**
 * Class MyAIMove
 * Represents a Player Movement (Human)
 * It doesn't need to be valid
 */
class MyMove extends MyGameMove {
    /**
     * MyMove
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {MyGameOrchestrator} gameOrchestrator - game orchestrator
     * @param {int} dimensions - dimensions of the board
     * @param {String} initialBoard - prolog board before the movement
     * @param {int} player - player on the move
     * @param {int} originId - id da peça a ser movida
     * @param {int} destinId - id da peça a ser removida
     */
    constructor(scene, gameOrchestrator, dimensions, initialBoard, player, originId, destinId) {
        super(scene, dimensions, initialBoard, player);
        this.gameOrchestrator = gameOrchestrator;
        this.prolog = this.gameOrchestrator.prolog;
        this.originId = originId;
        this.destinId = destinId;
        this.column = 0;
        this.line   = 0;
        this.direction = 'e';
        this.getMove();
    }

    /**
     * Calculate Position of the Piece
     * Based on Id
     * Id Calculation : (line - 1) * dimensions + (column - 1)
     * @param {*} id 
     */
    calculatePosition(id) {
        return [id % this.dimensions + 1, Math.floor(id / this.dimensions) + 1];
    }

    /**
     * Obtain the Move in Column, Line and Direction
     */
    getMove() {
        var originPos = this.calculatePosition(this.originId);
        var destinPos = this.calculatePosition(this.destinId);

        this.column = originPos[0];
        this.line   = originPos[1];

        if (originPos[0] == destinPos[0]) {
            // Same Column
            if (originPos[1] == destinPos[1]) {
                // Same Line
                this.direction = 'x';
            }
            else if ((originPos[1] + 1) == destinPos[1]) {
                // Next Line
                this.direction = 'u';
            }
            else if ((originPos[1] - 1) == destinPos[1]) {
                // Line Before
                this.direction = 'd';
            }
            else {
                // Line too far away
                this.direction = 'e';
            }
        }
        else if (originPos[1] == destinPos[1]) {
            // Same Line
            if ((originPos[0] + 1) == destinPos[0]) {
                // Next Column
                this.direction = 'r';
            }
            else if ((originPos[0] - 1) == destinPos[0]) {
                // Column Before
                this.direction = 'l';
            }
            else {
                // Column too far away
                this.direction = 'e';
            }
        }
        else {
            // Diagonal
            this.direction = 'e';
        }
    }

    /**
     * Verify on Prolog if the Move is Valid
     */
    isValid() {
        // Prolog Verification
        this.prolog.playerMoveRequest(this.dimensions, this.initialBoard, this.player, this.column, this.line, this.direction);
        return this.gameOrchestrator.playerMoveReply(this.prolog.request);
    }
}
