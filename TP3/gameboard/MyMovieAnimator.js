/**
 * MyMovieAnimator
 * Defines the Animations for the Sequence of Moves
 */
class MyMovieAnimator extends MyAnimator {
    constructor(scene, gameOrchestrator, sequence) {
        super(scene, gameOrchestrator);
        this.sequence = sequence; // List of MyAnimator
        this.active = null;
        this.index = -1;
    }

    /**
     * Starts Animation
     */
    start() {
        this.gameOrchestrator.prolog.startRequest(this.gameOrchestrator.dimensions);
        this.gameOrchestrator.gameboard.toJS(this.gameOrchestrator.startReply(this.gameOrchestrator.prolog.request)[1]);
    }

    /**
     * Starts New Animator
     */
    startNewAnimator() {
        ++ this.index;
        if (this.index < this.sequence.length) {
            this.active = this.sequence[this.index];
            this.active.reset();
            this.active.start();
        }
        else {
            this.finished = true;
        }
    }

    /**
     * Updates Animation
     * @param {time} t - current time
     */
    update(t) {
        if (this.active == null) {
            this.startNewAnimator();
        }

        if (this.finish()) {
            return;
        }
        else {
            this.active.update(t);
            if (this.active.finish()) {
                this.active = null;
            }
        }
    }

    /**
     * Display Animation
     */
    display() {
        if (this.active != null) {
            this.active.display();
        }
    }
}
