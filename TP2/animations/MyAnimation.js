/**
 * MyAnimation class
 * Represents an animation
 */
class MyAnimation {
    /**
     * MyAnimation
     * @constructor
     * @abstract
     * @param {CGFscene} scene - Reference to MyScene object
     */
    constructor(scene) {
        this.scene = scene;
        this.initTime = 0;
    }

    /**
     * Obtains Elapsed Time
     * @param {time} t - current time
     */
    getDeltaTime(t) {
        t = t / 1000;

        /* verify if it's the first call -> if it's the first, change init to current time */
        if (this.initTime == 0) { this.initTime = t; }
        
        /**
         * delta_time -> animation's elapsed time
         * elapsed time = actual time - init time
         * for example: first call -> deltaTime = 0
         */
        var deltaTime = t - this.initTime;
        return deltaTime;
    }

    /**
     * Update Animation
     * @param {time} t - current time
     */
    update(t) { }
}

    