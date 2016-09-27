/**
 * Created by Ashley on 2015-11-17.
 */
/// <reference path="phaser.d.ts"/>
/// <reference path="user.ts"/>
var HighScorePopup = (function () {
    function HighScorePopup(game) {
        this.backgroundX = 80;
        this.backgroundY = 0;
        this.buttonX = 450;
        this.buttonY = 0;
        this.fontX = 240;
        this.fontY = 0;
        this.backgroundName = 'highScoreBackground';
        this.backgroundImg = 'assets/images/skyblue.png';
        this.closeButtonName = 'closeButton';
        this.closeButtonImg = 'assets/images/CloseButton.png';
        this.closeButtonHeight = 80;
        this.closeButtonWidth = 80;
        this.fontName = 'desyrel';
        this.fontSize = 32;
        this.fontPNG = 'assets/fonts/desyrel.png';
        this.fontXML = 'assets/fonts/desyrel.xml';
        this.highScoreHeaderText = "High Scores:";
        this.alreadyRendered = false;
        this.game = game;
        this.highScores = new Array();
    }
    HighScorePopup.prototype.setUser = function (user) {
        this.user = user;
    };
    HighScorePopup.prototype.preload = function () {
        this.game.load.image(this.backgroundName, this.backgroundImg);
        this.game.load.spritesheet(this.closeButtonName, this.closeButtonImg, this.closeButtonWidth, this.closeButtonHeight);
        this.game.load.bitmapFont(this.fontName, this.fontPNG, this.fontXML);
    };
    HighScorePopup.prototype.create = function () {
        this.popup = this.game.add.image(this.backgroundX, this.backgroundY, this.backgroundName);
        this.closeButton = this.game.add.sprite(this.buttonX, this.buttonY, this.closeButtonName);
        this.highScoreHeader = this.game.add.bitmapText(this.fontX, this.fontY, this.fontName, this.highScoreHeaderText, this.fontSize);
        // close startButton is clickable
        this.closeButton.inputEnabled = true;
        this.closeButton.input.useHandCursor = true;
        this.closeButton.events.onInputDown.add(this.hidePopup, this);
        this.hidePopup();
    };
    HighScorePopup.prototype.renderHighScores = function () {
        if (!this.alreadyRendered) {
            var allScores = this.user.getHighScores();
            var x = 240;
            var y = 50;
            for (var i = 0; i < allScores.length; i++) {
                this.highScores.push(this.game.add.bitmapText(x, y, this.fontName, allScores[i].toString(), this.fontSize));
                y += 40;
            }
            this.alreadyRendered = true;
        }
    };
    HighScorePopup.prototype.showHighScorePopup = function () {
        this.popup.visible = true;
        this.closeButton.visible = true;
        this.highScoreHeader.visible = true;
        this.renderHighScores();
        for (var i = 0; i < this.highScores.length; i++) {
            this.highScores[i].visible = true;
        }
    };
    HighScorePopup.prototype.hidePopup = function () {
        this.popup.visible = false;
        this.closeButton.visible = false;
        this.highScoreHeader.visible = false;
        for (var i = 0; i < this.highScores.length; i++) {
            this.highScores[i].visible = false;
        }
    };
    return HighScorePopup;
})();
//# sourceMappingURL=HighScorePopup.js.map