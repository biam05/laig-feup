/**
 * MySpriteSheet
 * Stores SpriteSheet Texture and Controls Shader
 */
class MySpriteSheet {
    /**
     * MySpriteSheet
     * @constructor
     * @param {CGFscene} scene - Reference to Scene object
     * @param {CGFtexture} texture - Reference to the spritesheet texture
     * @param {int} sizeM - Number of Columns
     * @param {int} sizeN - Number of Lines
     */
    constructor(scene, texture, sizeM, sizeN) {
        this.scene = scene;
        this.texture = texture;
        this.columns = sizeM;
        this.lines   = sizeN;
        this.shader  = new CGFshader(this.scene.gl, "shaders/spritesheet.vert", "shaders/spritesheet.frag");
        this.shader.setUniformsValues({ dimensions: [this.columns, this.lines] });
    }

    /**
     * Activates Shader
     * Applies the Desired Texture
     */
    activateShader() {
        this.scene.setActiveShader(this.shader);
        this.texture.bind(0);
    }

    /**
     * Activates the Cell P
     * @param {cell} p - cell to be activated
     */
    activateCellP(p) {
        var column = p % this.columns;
        var line   = (p - column) / this.columns;
        this.activateCellMN(column, line);
    }

    /**
     * Activates the Cell in the select Line and Column
     * @param {int} column - column of the selected cell
     * @param {int} line - line of the selected cell
     */
    activateCellMN(column, line) {
        this.shader.setUniformsValues({ charCoords: [column, line] });
    }

    /**
     * Deactivates Shader
     */
    deactivateShader() {
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
