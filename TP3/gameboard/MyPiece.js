/**
 * MyPiece
 * Represents the Pieces in the Prolog Game
 */
class MyPiece {
    /**
     * MyPiece
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {String} color - Color of the Piece : may be 'red' or 'blue'
     */
    constructor(scene, color) {
        this.scene = scene;
        this.piece = new MyCylinder(this.scene, 0.5, 0.5, 0.5, 2, 4);
        this.color = color;
        this.selected = false;
        this.moving = false;

        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setShininess(30);
        this.redMaterial.setAmbient (0.2, 0.0, 0.0, 1.0);
        this.redMaterial.setDiffuse (0.6, 0.0, 0.0, 1.0);
        this.redMaterial.setSpecular(0.8, 0.0, 0.0, 1.0);
        this.redMaterial.setEmission(0.0, 0.0, 0.0, 1.0);
        
        this.blueMaterial = new CGFappearance(this.scene);
        this.blueMaterial.setShininess(30);
        this.blueMaterial.setAmbient (0.0, 0.0, 0.2, 1.0);
        this.blueMaterial.setDiffuse (0.0, 0.0, 0.6, 1.0);
        this.blueMaterial.setSpecular(0.0, 0.0, 0.8, 1.0);
        this.blueMaterial.setEmission(0.0, 0.0, 0.0, 1.0);

        this.selectedRedMaterial = new CGFappearance(this.scene);
        this.selectedRedMaterial.setShininess(30);
        this.selectedRedMaterial.setAmbient (0.2, 0.0, 0.0, 1.0);
        this.selectedRedMaterial.setDiffuse (0.6, 0.0, 0.0, 1.0);
        this.selectedRedMaterial.setSpecular(0.8, 0.0, 0.0, 1.0);
        this.selectedRedMaterial.setEmission(0.6, 0.0, 0.0, 1.0);

        this.selectedBlueMaterial = new CGFappearance(this.scene);
        this.selectedBlueMaterial.setShininess(30);
        this.selectedBlueMaterial.setAmbient (0.0, 0.0, 0.2, 1.0);
        this.selectedBlueMaterial.setDiffuse (0.0, 0.0, 0.6, 1.0);
        this.selectedBlueMaterial.setSpecular(0.0, 0.0, 0.8, 1.0);
        this.selectedBlueMaterial.setEmission(0.0, 0.0, 0.6, 1.0);
    }

    /**
     * Select Piece
     */
    select() {
        this.selected = true;
    }

    /**
     * Reset Selection
     */
    resetSelection() {
        this.selected = false;
    }

    /**
     * Start Movement
     */
    startMovement() {
        this.moving = true;
    }

    /**
     * Finish Movement
     */
    finishMovement() {
        this.moving = false;
    }

    /**
     * Determines if the Piece is in Movement
     */
    inMovement() {
        return this.moving;
    }

    /**
     * Get Piece Type / Color
     */
    getColor() {
        return this.color;
    }

    /**
     * Display Piece Primitive
     */
    display() {
        this.scene.pushMatrix();

        // Display Piece Color
        if (this.selected) {
            if      (this.color ==  'red') { this.selectedRedMaterial.apply();  }
            else if (this.color == 'blue') { this.selectedBlueMaterial.apply(); }
        }
        else {
            if      (this.color ==  'red') { this.redMaterial.apply();  }
            else if (this.color == 'blue') { this.blueMaterial.apply(); }
        }

        // Display Piece
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.piece.display();
        
        this.scene.popMatrix();
    }
}
