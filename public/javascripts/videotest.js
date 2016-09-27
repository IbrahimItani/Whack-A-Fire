/// <reference path="phaser.d.ts"/>
var vidTestSelfRef;
var VideoTest = (function () {
    function VideoTest() {
        vidTestSelfRef = this;
        this.game = new Phaser.Game(640, 640, Phaser.AUTO, 'content', {
            preload: this.preload, create: this.create,
            update: this.update
        });
    }
    VideoTest.prototype.preload = function () {
        this.game.load.spritesheet('map', 'assets/images/map.jpg', 640, 640);
        //Video overlays
        this.game.load.video('level1', 'assets/videos/Level1.webm');
    };
    VideoTest.prototype.create = function () {
        this.map = this.game.add.tileSprite(0, 0, 640, 640, 'map');
        this.map.visible = !this.map.visible;
        //Testing video overlay
        this.readyGoVid = this.game.add.video('level1');
        this.readyGoVid.onComplete.add(function () { console.log("Ended video"); });
        this.readyGoVid.play();
        this.readyGoVid.addToWorld(640, 640, 1, 1);
    };
    VideoTest.prototype.vidComplete = function () {
        console.log("Vid complete");
    };
    VideoTest.prototype.update = function () {
        // Update input state
        this.game.input.update();
    };
    return VideoTest;
})();
window.onload = function () {
    var game = new VideoTest();
};
//# sourceMappingURL=videotest.js.map