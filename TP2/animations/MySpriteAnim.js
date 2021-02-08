/**
 * MySpriteAnim
 * Uses MySpriteSheet to Represent Animation
 */
class MySpriteAnim extends MyAnimation {
    /**
     * MySpriteAnim
     * @constructor
     * @param {CGFscene} scene - Reference to Scene object
     * @param {MySpriteSheet} spriteSheet - Reference to MySpriteSheet object
     * @param {float} duration - duraction of the animation, in seconds
     * @param {int} startCell - index of the first sprite
     * @param {int} endCell   - index of the last sprite
     */
    constructor(scene, spriteSheet, duration, startCell, endCell) {
        super(scene);
        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;
        this.currentCell = startCell;
        this.plane = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
    }

    /**
     * Update Animation
     * @param {time} t 
     */
    update(t) {
        var delta_time = this.getDeltaTime(t);
        var instant = delta_time % this.duration;
        var timePerCell = this.duration / (this.endCell - this.startCell + 1);
        var cellOffset = instant / timePerCell;
        var cell = this.startCell + Math.floor(cellOffset);
        this.currentCell = cell;
    }

    /**
     * Display Sprite Anim Primitive
     */
    display() {
        this.spriteSheet.activateShader();
        this.spriteSheet.activateCellP(this.currentCell);
        this.plane.display();
        this.spriteSheet.deactivateShader();
    }

    /**
     * Updates the Texture Coordinates based on the Amplification
     * Only here because of inheritance
     */
    updateTexCoords() { }
}
