/**
 * Created by Ashley on 2015-11-17.
 */

/// <reference path="phaser.d.ts"/>
/// <reference path="user.ts"/>

class HighScorePopup {

    game: Phaser.Game;
    popup: any;
    closeButton: any;
    highScoreHeader: any;
    user: User;
    highScores: Array<any>;

    backgroundX = 80;
    backgroundY = 0;

    buttonX = 450;
    buttonY = 0;

    fontX = 240;
    fontY = 0;

    backgroundName = 'highScoreBackground';
    backgroundImg = 'assets/images/skyblue.png';

    closeButtonName = 'closeButton';
    closeButtonImg = 'assets/images/CloseButton.png';
    closeButtonHeight = 80;
    closeButtonWidth = 80;

    fontName = 'desyrel';
    fontSize = 32;
    fontPNG = 'assets/fonts/desyrel.png';
    fontXML = 'assets/fonts/desyrel.xml';

    highScoreHeaderText = "High Scores:";

    alreadyRendered = false;

    constructor (game: Phaser.Game) {
        this.game = game;
        this.highScores = new Array();
    }

    setUser (user: User) {
        this.user = user;
    }

    preload () {
        this.game.load.image(this.backgroundName, this.backgroundImg);
        this.game.load.spritesheet(this.closeButtonName, this.closeButtonImg, this.closeButtonWidth, this.closeButtonHeight);
        this.game.load.bitmapFont(this.fontName, this.fontPNG, this.fontXML);
    }

    create () {
        this.popup = this.game.add.image(this.backgroundX, this.backgroundY, this.backgroundName);
        this.closeButton = this.game.add.sprite(this.buttonX, this.buttonY, this.closeButtonName);
        this.highScoreHeader = this.game.add.bitmapText(this.fontX, this.fontY, this.fontName, this.highScoreHeaderText,
            this.fontSize);

        // close startButton is clickable
        this.closeButton.inputEnabled = true;
        this.closeButton.input.useHandCursor = true;
        this.closeButton.events.onInputDown.add(this.hidePopup, this);

        this.hidePopup();
    }

    renderHighScores () {

        if (!this.alreadyRendered) {

            var allScores = this.user.getHighScores();

            var x = 240;
            var y = 50;
            for (var i = 0; i < allScores.length; i++) {
                this.highScores.push(this.game.add.bitmapText(x, y, this.fontName, allScores[i].toString(),
                    this.fontSize));
                y += 40;
            }

            this.alreadyRendered = true;
        }
    }

    showHighScorePopup () {
        this.popup.visible = true;
        this.closeButton.visible = true;
        this.highScoreHeader.visible = true;

        this.renderHighScores();

        for (var i = 0; i < this.highScores.length; i++) {
            this.highScores[i].visible = true;
        }
    }

    hidePopup() {
        this.popup.visible = false;
        this.closeButton.visible = false;
        this.highScoreHeader.visible = false;

        for (var i = 0; i < this.highScores.length; i++) {
            this.highScores[i].visible = false;
        }
}

}