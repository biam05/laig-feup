/**
 * MyTile
 * Represents the Tiles in the Prolog Game
 */
class MyTile {
    /**
     * MyTile
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {Position} position - Position of the Tile in the Game Board
     */
    constructor(scene, position, texture) {
        this.scene = scene;
        this.tile = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.position = position; // Position = [column, line]
        this.piece = null;
        
        this.tileMaterial = new CGFappearance(this.scene);
        this.tileMaterial.setShininess(30);
        this.tileMaterial.setAmbient (0.5, 0.5, 0.5, 1.0);
        this.tileMaterial.setDiffuse (0.8, 0.8, 0.8, 1.0);
        this.tileMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.tileMaterial.setEmission(0.0, 0.0, 0.0, 1.0);

        this.tileTexture = texture;
        
        this.tileMaterial.setTexture(this.tileTexture);
        this.tileMaterial.setTextureWrap('REPEAT', 'REPEAT');
        this.tileMaterial.apply();
    }
    
    /**
     * Get Piece
     */
    getPiece() {
        return this.piece;
    }

    /**
     * Display Tile Primitive and the Piece Standing on that Tile
     */
    display() {
        // Obtain Position in the Board
        var column, line;
        column =     this.position[0];
        line   = parseInt(this.scene.selectedDimension) + 1 - this.position[1];       
        
        // Register for Picking
        if (this.piece != null) {
            this.scene.registerForPick((line - 1) * parseInt(this.scene.selectedDimension) + (column - 1), this.piece);
        }
        this.scene.pushMatrix();

        // Translation According to the Position on the Board
        this.scene.translate(parseInt(this.scene.selectedDimension)/2 + 0.5 - line, 0, parseInt(this.scene.selectedDimension)/2 + 0.5 - column);

        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.tileMaterial.apply();
        this.tile.display();
        if ((this.piece != null) && (!this.piece.inMovement())) {
            this.piece.display();
        }
        this.scene.popMatrix();

        // Clear from Picking
        if (this.piece != null) {
            this.scene.clearPickRegistration();
        }
    }
}
