/**
 * Created by Ashley on 2015-11-11.
 */

/// <reference path="phaser.d.ts"/>
/// <reference path="Component.ts"/>

class ScoreKeeper implements Component {

    game: Phaser.Game;
    localGame: Game; 
    scoreMul: number;
    score: any;

    fontX = 570;
    fontY = 0;
    fontSize = 24;
    fontName = 'desyrel';
    fontPNG = 'assets/fonts/desyrel.png';
    fontXML = 'assets/fonts/desyrel.xml';
    currentScore = 0;

    initialText = 'Score:\n';

    constructor (game: Phaser.Game, localGame: Game, scoreMul: number) {
        this.game = game;
        this.localGame = localGame;
        this.scoreMul = scoreMul;
    }

    preload () {
        this.game.load.bitmapFont(this.fontName, this.fontPNG, this.fontXML);
    }

    create () {
        this.score = this.game.add.bitmapText(this.fontX, this.fontY, this.fontName, this.initialText + this.currentScore.toString(),
            this.fontSize);
        this.score.bringToTop;
    }

    resetScore() {
        this.currentScore = 0; 
    }


    setScoreMul (scoreMul : number) {
        this.scoreMul = scoreMul;
    }

    getCurrentScore () {
        return this.currentScore;
    }

    update () {
        this.currentScore += this.scoreMul;
        this.score.setText(this.initialText + this.currentScore);
        //this.localGame.getGameInstance().postScore(this.currentScore); 
        
    }
}