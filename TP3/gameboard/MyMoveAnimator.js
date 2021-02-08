/**
 * MyMoveAnimator
 * Defines the Animations for the Moves
 */
class MyMoveAnimator extends MyAnimator {
    /**
     * MyMoveAnimator
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {MyGameOrchestrator} gameOrchestrator - game orchestrator
     * @param {List of Pieces} pieces - pieces involved in the move
     * @param {List of int} ids - ids from the pieces involved in the move
     * @param {int} dimensions - dimensions of the board
     * @param {MyGameMove} move - move associated with the animation
     */
    constructor(scene, gameOrchestrator, pieces, ids, dimensions, move) {
        super(scene, gameOrchestrator);
        this.dimensions = dimensions;
        this.move = move;
        this.gameboardPieces = [null, null, null]; // Needed to make sure there are no duplicates
        this.pieces = [null, null];
        this.pieces[0] = pieces[0]; //  Moving  Piece
        this.pieces[1] = pieces[1]; // Removing Piece
        this.ids = [ids[0], ids[1]];
        this.movingPositions   = []; // Positions of the Pieces involved in the move
        this.removingPositions = []; // Initial and Final Position for the Removed Piece
        this.totalTime = 1;
        this.movingCurrentPosition   = [0, 0];      // Position = [column, line]
        this.removingCurrentPosition = [0, 0, 0];   // Position = [x, y, z]
        this.outsideBoardPos = [8, 0, 0];   // Y = 0
        this.ymax = 5;
    }

    /**
     * Calculate Positions needed for the Animation
     */
    calculatePositions() {
        if (this.ids[0] != this.ids[1]) {
            this.calculateMovingPiecePositions();
        }
        this.calculateRemovingPiecePositions();
    }

    /**
     * Calculate Position of the Involved Pieces (Moving)
     * Based on Id
     * Id Calculation : (line - 1) * dimensions + (column - 1)
     */
    calculateMovingPiecePositions() {
        // Move from Id 0 to Id 1
        //    Origin   to Destination if Move
        // Destination to    Origin   if Undo
        var originId = this.ids[0];
        var destinId = this.ids[1];

        var originPosition   = [originId % this.dimensions + 1, Math.floor(originId / this.dimensions) + 1];
        var destinPosition   = [destinId % this.dimensions + 1, Math.floor(destinId / this.dimensions) + 1];
        
        this.movingPositions       = [[originPosition[0], originPosition[1]],
                                      [destinPosition[0], destinPosition[1]]];
        
        this.movingCurrentPosition[0] = this.movingPositions[0][0];
        this.movingCurrentPosition[1] = this.movingPositions[0][1];
    }

    /**
     * Obtains the initial and final positions for the Piece to be removed
     * Based on Id
     * Id Calculation : (line - 1) * dimensions + (column - 1)
     */
    calculateRemovingPiecePositions() {
        // Move from Destination Id to Outside the Board
        var removingPieceId = this.ids[1];  // Destination Id
        var position = [removingPieceId % this.dimensions + 1, Math.floor(removingPieceId / this.dimensions) + 1];
        var offset = this.dimensions / 2 + 0.5;
        this.removingPositions = [[   offset - position[1],            0           ,    offset - position[0]],
                                  [this.outsideBoardPos[0], this.outsideBoardPos[1], this.outsideBoardPos[2]]]; 
        this.removingCurrentPosition[0] = this.removingPositions[0][0];
        this.removingCurrentPosition[1] = this.removingPositions[0][1];
        this.removingCurrentPosition[2] = this.removingPositions[0][2];
        this.removingPiecePosition = [position[0], position[1]];
    }

    /**
     * Calculate the Equation Values for the Remotion of the Piece
     */
    calculateRemovingMovementEquation() {
        /*
            Travelled Distance = d = sqrt((finalX - initialX)^2 + (finalZ - initialZ)^2)
            Quadratic Function : y = a * d^2 + b * d + c
            (xi, zi) -> distance = 0   and y = 0
            (xh, zh) -> distance = d/2 and y = ymax
            (xf, zf) -> distance = d   and y = 0
        */

        var initialPosition = this.removingPositions[0];
        var  finalPosition  = this.removingPositions[1];

        var initialX = initialPosition[0]; var finalX = finalPosition[0];
        var initialZ = initialPosition[2]; var finalZ = finalPosition[2];

        var d  = Math.sqrt(Math.pow(finalX - initialX, 2) + Math.pow(finalZ - initialZ, 2));
        var dh = d / 2;

        /*
            ----------------------- Equations ----------------------
            | yi = a * di^2 + b * di + c -> yi =   0  ; di =   0   |
            | yh = a * dh^2 + b * dh + c -> yh = ymax ; dh = d / 2 |
            | yf = a * df^2 + b * df + c -> yf =   0  ; df =   d   |
            --------------------------------------------------------

            yi = a * di^2 + b * di + c  ->  c = 0
            yf = a * df^2 + b * df + c  ->  a * df^2 = -b * df              ->  b = -a * df
            yh = a * dh^2 + b * dh + c  ->  yh = a * dh^2 + (-a * df) * dh  ->  a = yh / (dh^2 - df * dh)
        */
        this.a = this.ymax / (dh * (dh - d));
        this.b = - this.a * d;
        this.c = 0;
    }

    /**
     * Starts Animation
     */
    start() {
        this.calculatePositions();
        this.calculateRemovingMovementEquation();

        if (this.ids[0] != this.ids[1]) {
            var initialTile = this.gameOrchestrator.gameboard.getTile(this.movingPositions[0][0],
                                                                      this.movingPositions[0][1]);
            var  finalTile  = this.gameOrchestrator.gameboard.getTile(this.movingPositions[1][0],
                                                                      this.movingPositions[1][1]);
            this.gameboardPieces[0] = initialTile.getPiece();
            this.gameboardPieces[1] =   finalTile.getPiece();
        }
        var tile = this.gameOrchestrator.gameboard.getTile(this.removingPiecePosition[0],
                                                           this.removingPiecePosition[1]);
        this.gameboardPieces[2] = tile.getPiece();
        
        if (this.gameboardPieces[0] != null) { this.gameboardPieces[0].startMovement(); }
        if (this.gameboardPieces[1] != null) { this.gameboardPieces[1].startMovement(); }
        if (this.gameboardPieces[2] != null) { this.gameboardPieces[2].startMovement(); }
        this.pieces[0].startMovement();
        this.pieces[1].startMovement();
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
        if (this.gameboardPieces[0] != null) { this.gameboardPieces[0].finishMovement(); }
        if (this.gameboardPieces[1] != null) { this.gameboardPieces[1].finishMovement(); }
        if (this.gameboardPieces[2] != null) { this.gameboardPieces[2].finishMovement(); }

        this.gameOrchestrator.prolog.moveRequest(this.dimensions, this.gameOrchestrator.gameboard.toProlog(),
                                                 this.move.player, this.move.column, this.move.line,
                                                 this.move.direction);
        var prologBoard = this.gameOrchestrator.moveReply(this.gameOrchestrator.prolog.request)[1];
        this.gameOrchestrator.gameboard.toJS(prologBoard);
        return true;
    }
    
    /**
     * Updates Animation
     * @param {time} t - current time
     */
    update(t) {
        if (this.ids[0] != this.ids[1]) {
            this.updateMovingPiece(t);
        }
        this.updateRemovingPiece(t);
    }

    /**
     * Updates Animation for the Moving Piece
     * @param {time} t - current time
     */
    updateMovingPiece(t) {
        var deltaTime = this.getDeltaTime(t);

        if (deltaTime >= this.totalTime) {
            this.removingCurrentPosition = this.movingPositions[1];
            this.finished = true;
            return;
        }

        // Portion of the Animation that has elapsed
        var elapsedAnimation = deltaTime / this.totalTime;
        
        // Animation Based on elapsedAnimation
        // Update the Value on this.movingCurrentPosition
        var initialPosition = this.movingPositions[0];
        var  finalPosition  = this.movingPositions[1];
        this.movingCurrentPosition[0] = initialPosition[0] + elapsedAnimation * (finalPosition[0] - initialPosition[0]);
        this.movingCurrentPosition[1] = initialPosition[1] + elapsedAnimation * (finalPosition[1] - initialPosition[1]);
    }

    /**
     * Updates Animation for the Moving Piece
     * @param {time} t - current time
     */
    updateRemovingPiece(t) {
        // Piece will jump out of the board
        var deltaTime = this.getDeltaTime(t);

        if (deltaTime >= this.totalTime) {
            this.removingCurrentPosition = this.removingPositions[1];
            this.finished = true;
            return;
        }

        // Portion of the Animation that has elapsed
        var elapsedAnimation = deltaTime / this.totalTime;

        // Animation Based on elapsedAnimation
        // Update the Value on this.movingCurrentPosition
        var initialPosition = this.removingPositions[0];
        var  finalPosition  = this.removingPositions[1];

        // X is Linear
        this.removingCurrentPosition[0] = initialPosition[0] + elapsedAnimation * (finalPosition[0] - initialPosition[0]);
        // Z is Linear
        this.removingCurrentPosition[2] = initialPosition[2] + elapsedAnimation * (finalPosition[2] - initialPosition[2]);
        // Y is Quadratic
        /*
            Travelled Distance = d = sqrt((currentX - initialX)^2 + (currentZ - initialZ)^2)
            Quadratic Function : y = a * d^2 + b * d + c
            (xi, zi) -> distance = 0   and y = 0
            (xh, zh) -> distance = d/2 and y = ymax
            (xf, zf) -> distance = d   and y = 0
        */
        var initialX = initialPosition[0]; var currentX = this.removingCurrentPosition[0];
        var initialZ = initialPosition[2]; var currentZ = this.removingCurrentPosition[2];
        var d = Math.sqrt(Math.pow(currentX - initialX, 2) + Math.pow(currentZ - initialZ, 2));
        this.removingCurrentPosition[1] = this.a * Math.pow(d, 2) + this.b * d + this.c;
    }

    /**
     * Display Animation
     */
    display() {

        // Moving Piece
        if (this.ids[0] != this.ids[1]) {
            this.scene.pushMatrix();

            var column = this.movingCurrentPosition[0];
            var  line  = this.movingCurrentPosition[1];
            var offset = this.dimensions / 2 + 0.5;
            // Translation According to the Current Position on the Board
            this.scene.translate(offset - line, 0, offset - column);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);

            this.pieces[0].display();

            this.scene.popMatrix();
        }

        // Removing Piece
        this.scene.pushMatrix();
        
        // Translation According to the Current Position
        this.scene.translate(this.removingCurrentPosition[0],
                             this.removingCurrentPosition[1],
                             this.removingCurrentPosition[2]);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);

        this.pieces[1].display();

        this.scene.popMatrix();
    }
}
