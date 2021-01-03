/**
 * MyUndoAnimator
 * @description Class that defines the animations for the undo moves
 */
class MyUndoAnimator extends MyMoveAnimator {
    constructor(scene, gameOrchestrator, move, pieces, dimensions) {
        super(scene, gameOrchestrator, pieces, [], dimensions);
        this.move = move;
        this.ids = [this.move.destinId, this.move.originId];
    }

    /**
     * Obtains the initial and final positions for the Piece to be removed
     * Based on Id
     * Id Calculation : (line - 1) * dimensions + (column - 1)
     */
    calculateRemovingPiecePositions() {
        // Move from Outside the Board to Destination Id
        var removingPieceId = this.ids[0];  // Destination Id
        var position = [removingPieceId % this.dimensions + 1, Math.floor(removingPieceId / this.dimensions) + 1];
        var offset = this.dimensions / 2 + 0.5;
        this.removingPositions = [[this.outsideBoardPos[0], this.outsideBoardPos[1], this.outsideBoardPos[2]],
                                  [   offset - position[1],            0           ,    offset - position[0]]]; 
        this.removingCurrentPosition[0] = this.removingPositions[0][0];
        this.removingCurrentPosition[1] = this.removingPositions[0][1];
        this.removingCurrentPosition[2] = this.removingPositions[0][2];
    }

    /**
     * Finish Animation
     */
    finish() {
        if (!this.finished) {
            return false;
        }
        this.pieces[0].finishMovement();
        this.pieces[1].finishMovement();
        this.gameOrchestrator.gameboard.tiles = [];
        this.gameOrchestrator.gameboard.toJS(this.move.getInitialBoard());
        this.gameOrchestrator.player = this.move.player;
        return true;
    }
}