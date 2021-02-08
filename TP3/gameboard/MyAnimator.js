/**
 * MyAnimator
 * Manages the Game Animations
 */
class MyAnimator extends CGFobject {
    /**
     * MyAnimator
     * @constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {MyGameOrchestrator} gameOrchestrator - game orchestrator
     */
    constructor(scene, gameOrchestrator) {
        super(scene);
        this.gameOrchestrator = gameOrchestrator;
        this.startTime = 0;
        this.finished = false;
    }

    /**
     * Calculate Positions needed for the Animation
     */
    calculatePositions() {}

    /**
     * Resets Animation
     */
    reset() {
        // Reset Timer
        this.startTime = 0;
        this.finished = false;
    }

    /**
     * Starts Animation
     */
    start() {}

    /**
     * Finish Animation
     */
    finish() {
        return this.finished;
    }

    /**
     * Obtains Elapsed Time
     * @param {time} t - current time
     */
    getDeltaTime(t) {
        t = t / 1000;

        /* verify if it's the first call -> if it's the first, change start to current time */
        if (this.startTime == 0) { this.startTime = t; }
        
        /**
         * deltaTime -> animation's elapsed time
         * elapsed time = actual time - start time
         * for example: first call -> deltaTime = 0
         */
        var deltaTime = t - this.startTime;
        return deltaTime;
    }

    /**
     * Updates Animation
     * @param {time} t - current time
     */
    update(t) {}

    /**
     * Display Animation
     * Optionally can look at the orchestrator to stop current animation.
     */
    display() {}
}
