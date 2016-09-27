/**
 * Created by Ashley on 2015-11-10.
 */

/// <reference path="phaser.d.ts"/>
/// <reference path="Component.ts"/>

var timerSelfRef; 

class Timer implements Component {

    game: Phaser.Game;
    localGame: Game;
    timer: any;
    updateLoop;
    time: number;
    onEnd: () => void;
    isPaused: boolean; 

    fontX = 0;
    fontY = 0;
    fontSize = 24;
    fontName = 'desyrel';
    fontPNG = 'assets/fonts/desyrel.png';
    fontXML = 'assets/fonts/desyrel.xml';
    initialText = 'Time Left:\n00:00:';
    textAfterTenSec = 'Time Left:\n00:00:0';

    constructor(game: Phaser.Game, localGame: Game, time: number, onEnd: () => void) {
        timerSelfRef = this; 
        this.game = game;
        this.time = time;
        this.onEnd = onEnd;
        this.isPaused = true; 
    }

    preload() {
        this.game.load.bitmapFont(this.fontName, this.fontPNG, this.fontXML);
    }

    create() {
        this.timer = this.game.add.bitmapText(this.fontX, this.fontY, this.fontName, this.initialText + this.time.toString(), this.fontSize);
    }

    initilize() {
        this.updateLoop = this.game.time.events.loop(Phaser.Timer.SECOND, this.update, this);
    }

    setPaused(set: boolean) {
        timerSelfRef.isPaused = set; 
    }

    setTime (time: number) {
        this.time = time;
    }

    update() {

        if (this.isPaused) return; 

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

    }

    destroy () {
        this.game.time.events.stop(this.updateLoop);
    }

}