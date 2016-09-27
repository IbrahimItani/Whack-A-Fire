/**
 * Created by Ashley on 2015-11-10.
 */
/// <reference path="phaser.d.ts"/>
/// <reference path="Component.ts"/>
var timerSelfRef;
var Timer = (function () {
    function Timer(game, localGame, time, onEnd) {
        this.fontX = 0;
        this.fontY = 0;
        this.fontSize = 24;
        this.fontName = 'desyrel';
        this.fontPNG = 'assets/fonts/desyrel.png';
        this.fontXML = 'assets/fonts/desyrel.xml';
        this.initialText = 'Time Left:\n00:00:';
        this.textAfterTenSec = 'Time Left:\n00:00:0';
        timerSelfRef = this;
        this.game = game;
        this.time = time;
        this.onEnd = onEnd;
        this.isPaused = true;
    }
    Timer.prototype.preload = function () {
        this.game.load.bitmapFont(this.fontName, this.fontPNG, this.fontXML);
    };
    Timer.prototype.create = function () {
        this.timer = this.game.add.bitmapText(this.fontX, this.fontY, this.fontName, this.initialText + this.time.toString(), this.fontSize);
    };
    Timer.prototype.initilize = function () {
        this.updateLoop = this.game.time.events.loop(Phaser.Timer.SECOND, this.update, this);
    };
    Timer.prototype.setPaused = function (set) {
        timerSelfRef.isPaused = set;
    };
    Timer.prototype.setTime = function (time) {
        this.time = time;
    };
    Timer.prototype.update = function () {
        if (this.isPaused)
            return;
        this.time--;
        if (this.time < 0) {
            this.destroy();
            this.onEnd();
        }
        else if (this.time < 10) {
            this.timer.setText(this.textAfterTenSec + this.time);
        }
        else {
            this.timer.setText(this.initialText + this.time);
        }
    };
    Timer.prototype.destroy = function () {
        this.game.time.events.stop(this.updateLoop);
    };
    return Timer;
})();
//# sourceMappingURL=timer.js.map