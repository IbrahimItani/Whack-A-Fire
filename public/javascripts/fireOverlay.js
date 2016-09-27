/**
 * Created by Ashley on 2015-11-05.
 */
/// <reference path="phaser.d.ts"/>
/// <reference path="latlong.ts"/>
/// <reference path="fireData.ts"/>
/// <reference path="scoreKeeper.ts"/>
var FireOverlay = (function () {
    function FireOverlay(game, scoreKeeper, localGame, startFiresCount) {
        this.scaleX = 0.1;
        this.scaleY = 0.1;
        this.frameRate = 2;
        this.tooClose = 60;
        this.sheetWidth = 404;
        this.sheetHeight = 804;
        this.spriteName = 'fireSprite';
        this.spriteImage = 'assets/images/fireSpritesheet.png';
        this.animationName = 'flicker';
        this.numClicks = 4;
        this.game = game;
        this.localGame = localGame;
        this.scoreKeeper = scoreKeeper;
        this.firesShown = new Array();
        this.numFiresShown = startFiresCount;
        this.numFiresToShow = startFiresCount;
    }
    FireOverlay.prototype.preload = function () {
        this.game.load.spritesheet(this.spriteName, this.spriteImage, this.sheetWidth, this.sheetHeight);
    };
    FireOverlay.prototype.renderFires = function (fireDataList) {
        var i = 0;
        var a = 0;
        console.log("Render  fires, numFiresToShow: " + this.numFiresToShow);
        while (this.firesShown.length < this.numFiresToShow) {
            console.log("fireDataList length: " + fireDataList.length);
            console.log("Iteration: " + i);
            if (!this.isTooClose(fireDataList[i], this.firesShown)) {
                this.firesShown.push(fireDataList[i]);
                this.addFire(fireDataList, i, a);
                a++;
            }
            else if (i == fireDataList.length - 1) {
                var numFiresNeeded = this.numFiresToShow - this.firesShown.length;
                for (var n = 0; n < numFiresNeeded; n++) {
                    this.firesShown.push(fireDataList[n]);
                    this.addFire(fireDataList, n, a);
                    a++;
                }
            }
            i++;
        }
    };
    FireOverlay.prototype.addFire = function (fireDataList, i, a) {
        var latLong = fireDataList[i].getLatLong();
        var fire = this.game.add.sprite(latLong.getLatitude(), latLong.getLongitude(), this.spriteName);
        fire.inputEnabled = true;
        fire.input.useHandCursor = true;
        fire["counter"] = 0;
        fire.events.onInputDown.add(this.fireOnClick, this);
        fire.scale.setTo(this.scaleX, this.scaleY);
        fire["index"] = a;
        this.animate(fire);
    };
    // method called when fire is clicked
    FireOverlay.prototype.fireOnClick = function (fire) {
        if (fire.counter < this.numClicks) {
            fire.counter++;
        }
        else {
            fire.visible = false;
            this.scoreKeeper.update();
            console.log("hiding fire with index: " + fire["index"]);
            this.localGame.getGameInstance().postName(this.firesShown[fire["index"]].getName());
            this.numFiresShown--;
            if (this.numFiresShown == 0) {
                this.triggerNextLevel();
            }
        }
    };
    FireOverlay.prototype.triggerNextLevel = function () {
        console.log("Trigger next level");
        this.firesShown = [];
        this.localGame.getGameInstance().incrementLevel();
    };
    FireOverlay.prototype.animate = function (fire) {
        var flicker = fire.animations.add(this.animationName);
        fire.animations.play(this.animationName, this.frameRate, true);
    };
    FireOverlay.prototype.isTooClose = function (currentFire, firesShown) {
        var currLatLong = currentFire.getLatLong();
        for (var i = 0; i < firesShown.length; i++) {
            var nextLatLong = firesShown[i].getLatLong();
            var latDiff = Math.abs(currLatLong.getLatitude() - nextLatLong.getLatitude());
            var longDiff = Math.abs(currLatLong.getLongitude() - nextLatLong.getLongitude());
            var toPowerOf = 2;
            var difference = Math.sqrt(Math.pow(latDiff, toPowerOf) + Math.pow(longDiff, toPowerOf));
            if (difference <= this.tooClose) {
                return true;
            }
        }
        return false;
    };
    return FireOverlay;
})();
//# sourceMappingURL=fireOverlay.js.map