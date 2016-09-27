/**
 * Created by Ashley on 2015-11-11.
 */
/// <reference path="phaser.d.ts"/>
/// <reference path="Component.ts"/>
var ScoreKeeper = (function () {
    function ScoreKeeper(game, localGame, scoreMul) {
        this.fontX = 570;
        this.fontY = 0;
        this.fontSize = 24;
        this.fontName = 'desyrel';
        this.fontPNG = 'assets/fonts/desyrel.png';
        this.fontXML = 'assets/fonts/desyrel.xml';
        this.currentScore = 0;
        this.initialText = 'Score:\n';
        this.game = game;
        this.localGame = localGame;
        this.scoreMul = scoreMul;
    }
    ScoreKeeper.prototype.preload = function () {
        this.game.load.bitmapFont(this.fontName, this.fontPNG, this.fontXML);
    };
    ScoreKeeper.prototype.create = function () {
        this.score = this.game.add.bitmapText(this.fontX, this.fontY, this.fontName, this.initialText + this.currentScore.toString(), this.fontSize);
        this.score.bringToTop;
    };
    ScoreKeeper.prototype.resetScore = function () {
        this.currentScore = 0;
    };
    ScoreKeeper.prototype.setScoreMul = function (scoreMul) {
        this.scoreMul = scoreMul;
    };
    ScoreKeeper.prototype.getCurrentScore = function () {
        return this.currentScore;
    };
    ScoreKeeper.prototype.update = function () {
        this.currentScore += this.scoreMul;
        this.score.setText(this.initialText + this.currentScore);
        //this.localGame.getGameInstance().postScore(this.currentScore); 
    };
    return ScoreKeeper;
})();
//# sourceMappingURL=scoreKeeper.js.map