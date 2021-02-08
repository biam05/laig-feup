/**
 * MyTimer
 * Uses MySpriteText to Represent Time
 */
class MyTimer {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Obtain Current Time
     * @param {time} time 
     */
    getTime(time) {
        var minutesInt = Math.floor(time / 60);
        var secondsInt = Math.floor(time) % 60;

        var minutesStr = "00" + minutesInt.toString();
        var secondsStr = "00" + secondsInt.toString();

        var minutes = minutesStr.substring(minutesStr.length - 2, minutesStr.length);
        var seconds = secondsStr.substring(secondsStr.length - 2, secondsStr.length)

        var timeStr = minutes + ":" + seconds;
        return timeStr;
    }
}
