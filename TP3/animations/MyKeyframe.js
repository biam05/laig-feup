/**
 * MyKeyframe class
 * Represents an keyframe from an animation
 */
class MyKeyframe {
    /**
     * @constructor
     * @param {CGFscene} scene   - Reference to MyScene object
     * @param {integer} instant  - keyframe instant
     * @param {vec3} translation - translation associated to this instant
     * @param {vec3} rotation    - rotation associated to this instant
     * @param {vec3} scale       - scale associated to this instant
     */
    constructor(scene, instant, translation, rotation, scale) {
        this.scene = scene;
        this.instant = instant;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
    }
}
