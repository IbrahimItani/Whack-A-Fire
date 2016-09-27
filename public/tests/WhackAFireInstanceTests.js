/// <reference path="../javascripts/phaser.d.ts"/>
/// <reference path="../javascripts/latlong.ts"/>
/// <reference path="../javascripts/fireData.ts"/> 
/// <reference path="../javascripts/fireData.ts"/>
/// <reference path="../javascripts/fireOverlay.ts"/>
/// <reference path="../javascripts/timer.ts"/>
/// <reference path="../javascripts/user.ts"/> 
/// <reference path="../javascripts/scoreKeeper.ts"/>
/// <reference path="../javascripts/HighScorePopup.ts"/>
console.log("Running WhackAFireInstanceTests script");
var testGame;
var selfRef;
var io;
var Test = (function () {
    function Test(name, res) {
        this.testName = name;
        this.result = res;
    }
    return Test;
})();
var WhackAFireInstanceTestSuite = (function () {
    function WhackAFireInstanceTestSuite() {
        selfRef = this;
        selfRef.game = testGame;
        selfRef.hasRunStage1 = false;
        //Results 
        selfRef.results_InitNewGame = new Array();
    }
    ;
    WhackAFireInstanceTestSuite.prototype.runTests = function () {
        console.log("RUNNING TESTS");
        selfRef.test_startGame(function () {
            console.log("PRINTING RESULTS STAGE ONE..");
            var a;
            var passed = true;
            for (a = 0; a < selfRef.results_InitNewGame.length; a++) {
                if (!selfRef.results_InitNewGame[a].result) {
                    passed = false;
                }
                console.log(selfRef.results_InitNewGame[a].testName + ": " + selfRef.results_InitNewGame[a].result);
            }
            if (passed) {
                console.log("All Stage 1 Tests Passed!");
                selfRef.hasRunStageOne = true;
            }
            else {
                console.log("Stage 1 Tests Failed");
            }
        });
    };
    WhackAFireInstanceTestSuite.prototype.stageTwoTests = function () {
        if (selfRef.hasRunStageOne) {
            console.log("Running stage two tests");
            selfRef.test_clearFireOverlay(function () {
            });
        }
        else {
            console.log("Either stage one has not completed yet or has failed");
        }
    };
    WhackAFireInstanceTestSuite.prototype.test_startGame = function (callback) {
        selfRef.game.startGame(function (visible, state, instance) {
            console.log("Getting results of Game.startGame()");
            selfRef.results_InitNewGame.push(new Test("Map Visibility Test", visible));
            selfRef.results_InitNewGame.push(new Test("Game State Test", state == gameStates.ingame));
            selfRef.results_InitNewGame.push(new Test("Game Instance Instantiation Test", instance != null));
            selfRef.test_initGame(instance, callback);
        });
    };
    WhackAFireInstanceTestSuite.prototype.test_initGame = function (instance, callback) {
        selfRef.results_InitNewGame.push(new Test("Level Equality Test", instance.level == 1));
        selfRef.results_InitNewGame.push(new Test("Max Fire Count Test", instance.maxCount == 5));
        selfRef.results_InitNewGame.push(new Test("Timer Instantiation Test", instance.timer != null));
        if (instance.timer != null) {
            selfRef.results_InitNewGame.push(new Test("Timer Equality Test", instance.timer.time == 20));
        }
        else {
            selfRef.results_InitNewGame.push(new Test("Timer Equality Test", false));
        }
        selfRef.results_InitNewGame.push(new Test("Fire Overlay Instantiation Test", instance.fireOverlay != null));
        if (instance.fireOverlay != null) {
            selfRef.results_InitNewGame.push(new Test("Number of Fires Show Test", instance.fireOverlay.numFiresShown == 5));
            selfRef.results_InitNewGame.push(new Test("Number of Fires To Show Test", instance.fireOverlay.numFiresToShow == 5));
        }
        else {
            selfRef.results_InitNewGame.push(new Test("Number of Fires Show Test", false));
            selfRef.results_InitNewGame.push(new Test("Number of Fires To Show Test", false));
        }
        selfRef.results_InitNewGame.push(new Test("Score Keeper Instantiation Test", instance.scoreKeeper != null));
        if (instance.scoreKeeper != null) {
            selfRef.results_InitNewGame.push(new Test("Score Keeper Multiplier Equality Test", instance.scoreKeeper.scoreMul == 10));
        }
        else {
            selfRef.results_InitNewGame.push(new Test("Score Keeper Multiplier Equality Test", false));
        }
        callback();
    };
    WhackAFireInstanceTestSuite.prototype.test_clearFireOverlay = function (callback) {
        //clear a single fire overlay 
    };
    return WhackAFireInstanceTestSuite;
})();
//# sourceMappingURL=WhackAFireInstanceTests.js.map