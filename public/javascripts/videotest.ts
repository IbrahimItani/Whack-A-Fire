/// <reference path="phaser.d.ts"/>



var vidTestSelfRef; 

class VideoTest {

    game: Phaser.Game;
    map: any;
   
    //Testing video overlay
    readyGoVid: any; 


    constructor() {

        vidTestSelfRef = this;
      
        this.game = new Phaser.Game(640, 640, Phaser.AUTO, 'content', {
            preload: this.preload,create: this.create,
            update: this.update
        });

        
    }

    preload() {

        this.game.load.spritesheet('map', 'assets/images/map.jpg', 640, 640);

        //Video overlays
        this.game.load.video('level1', 'assets/videos/Level1.webm'); 


    }

    create() {

        this.map = this.game.add.tileSprite(0,0,640,640,'map');
        this.map.visible = !this.map.visible;


        //Testing video overlay
        this.readyGoVid = this.game.add.video('level1');
        this.readyGoVid.onComplete.add(function () { console.log("Ended video");});
        this.readyGoVid.play();
        this.readyGoVid.addToWorld(640, 640, 1, 1); 

        

 
    }

    vidComplete() {
        console.log("Vid complete"); 
    }


    update() {
        // Update input state
        this.game.input.update();

    }

   
}



window.onload = () => {

    var game = new VideoTest();


};
