/// <reference path="phaser.d.ts"/>
/// <reference path="latlong.ts"/>
/// <reference path="fireData.ts"/> 
/// <reference path="FireData.ts"/>
/// <reference path="fireOverlay.ts"/>
/// <reference path="timer.ts"/>
/// <reference path="user.ts"/> 
/// <reference path="scoreKeeper.ts"/>
/// <reference path="HighScorePopup.ts"/>
/// <reference path="facebookUtil.ts"/>

//Global values used for initiation
var startingTime = 20;
var startingMul = 10;
var startingMaxFires = 5;

var globalTestGame; 

var video; 

//This is forward declaring the name io
//the server.io script is loaded before this and io takes on correct reference
var io;
enum gameStates {
    menu,
    ingame,
    endgame
}

var gameSelfRef;


class Game{

    game: Phaser.Game;
    gameInstance: GameInstanceInterface;
    cursors: Phaser.CursorKeys;
    doneLoading: boolean;
    doneUserLoading: boolean;
    startButton: any;
    loadingButton: any;
    creditsButton: any;
    highScoreButton: any;
    shareButton: any;
    restartButton: any;
    gameState: any;
    splashScreen: any;
    presents: any;
    whackAFireTitle: any;
    titlePageFire: any;
    bg: any;
    map: any;
    timer: any;
    timerDisplay: Timer;
    scoreKeeper: ScoreKeeper;
    highScoreBoard: HighScorePopup;
    fireDataList: Array<FireData>;
    fireOverlay: FireOverlay;
    instructionsStyle = { font: "15px Arial", fill: "#ffffff", align: "center" };
    instructionsText = "As more and more forest fires continue to burn, we need your help to put some out! click on a fire 5 times to extinguish it! GOOD LUCK!";
    instructions: any;
    user: User;
    facebookUtil: FacebookUtil;
    username: string;

    // Names for all visual components loaded
    startButtonName = 'startButton';
    loadingButtonName = 'loadButton'; 
    highScoreButtonName = 'highScoreButton';
    splashScreenName = 'splashScreen';
    mapName = 'map';
    endTableBackgroundName = 'bg';
    presentsName = 'presents';
    titleName = 'whack-a-fire';
    shareButtonName = 'shareButton';
    restartButtonName = 'restartButton';
    creditsButtonName = 'creditsButton';
    closeButtonName = 'closeButton';


    // All asset locations
    startButtonSpritesheet = 'assets/images/startButtonSpritesheet.jpg';
    startButtonJSON = 'assets/JSON/startButtonSpritesheet.json';

    loadingButtonImg = 'assets/images/loadingButton.jpg'; 

    highScoreButtonSpritesheet = 'assets/images/highScoreButtonSpriteSheet.png';
    highScoreButtonJSON = 'assets/JSON/highScoreButtonSpriteSheet.json';

    splashScreenImg = 'assets/images/splashScreen.png';
    mapImg = 'assets/images/map.jpg';
    endTableBackgroundImg = 'assets/images/skyblue.png';
    presentsImg = 'assets/images/presents.png';
    titleImg = 'assets/images/whack-a-fire.png';

    shareButtonImg = 'assets/images/ShareScore.png';
    restartButtonImg = 'assets/images/RestartGame.png';

    creditsButtonImg = 'assets/images/creditsButton.png';
    closeButtonImg = 'assets/images/CloseButton.png';

    ashleyImg = 'assets/images/ashley.png';
    ibsImg = 'assets/images/ibs.png';
    kyleImg = 'assets/images/kyle.png';
    zachImg = 'assets/images/zach.png';

    //Components x, y, width, height, and scales (if needed)
    splashScreenX = 50;
    splashScreenY = 0;
    splashScreenWidth = 539;
    splashScreenHeight = 132;

    presentsX = 180;
    presentsY= 150;
    presentsWidth = 250;
    presentsHeight = 50;

    titlePageFireX = 260;
    titlePageFireY = 200;
    titlePageFireScaleX = 0.2;
    titlePageFireScaleY = 0.2;

    whackAFireTitleX = 160;
    whackAFireTitleY = 340;
    whackAFireTitleWidth = 250;
    whackAFireTitleHeight = 50;

    instructionsX = 60;
    instructionsY = 440;
    instructionsLength = 520;

    startButtonX = 375;
    startButtonY = 550;

    creditsButtonX = 585;
    creditsButtonY = 610;

    closeButtonX = 0;
    closeButtonY = 0;

    highScoreButtonX = 155;
    highScoreButtonY = 550;

    shareButtonX = 110;
    shareButtonY = 535;

    restartButtonX = 350;
    restartButtonY = 535;

    mapX = 0;
    mapY = 0;
    mapWidth = 640;
    mapHeight = 640;

    musicTrack: any;
    themeTrack: any; 
    splashVideoLength = 4184;

    latPerPixel = .0071875;
    latOfOrigin = 54.1;

    longPerPixel = .0109375;
    longOfOrigin = -127.5;

    numFiresToStart = 5;

    constructor() {
        globalTestGame = this; 
        gameSelfRef = this;
        gameSelfRef.fireDataList = new Array<FireData>();
        gameSelfRef.fires = new Array<any>();

        
        var width = 640;
        var height = 640;
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', {
            preload: this.preload, create: this.create,
            update: this.update
        });

        gameSelfRef.timerDisplay = new Timer(this.game, this, startingTime, gameSelfRef.endGame);
        gameSelfRef.scoreKeeper = new ScoreKeeper(this.game, this, startingMul);
        gameSelfRef.fireOverlay = new FireOverlay(this.game, gameSelfRef.scoreKeeper, this, gameSelfRef.numFiresToStart);
        gameSelfRef.highScoreBoard = new HighScorePopup(this.game);
        gameSelfRef.facebookUtil = new FacebookUtil();
    }

    preload() {
        


        //Load splash screen video first 
        this.game.load.video('splashVideo', 'assets/videos/SplashLogo.webm');

        this.game.load.audio('music', ['assets/audio/track1.ogg']);
        this.game.load.audio('theme', ['assets/audio/theme.ogg']);

        this.game.load.atlas(gameSelfRef.startButtonName, gameSelfRef.startButtonSpritesheet, gameSelfRef.startButtonJSON);
        this.game.load.atlas(gameSelfRef.highScoreButtonName, gameSelfRef.highScoreButtonSpritesheet,
            gameSelfRef.highScoreButtonJSON);
        this.game.load.image(gameSelfRef.splashScreenName, gameSelfRef.splashScreenImg);
        var width = 640;
        var height = 640;
        this.game.load.spritesheet(gameSelfRef.mapName, gameSelfRef.mapImg, width, height);
        this.game.load.image(gameSelfRef.endTableBackgroundName, gameSelfRef.endTableBackgroundImg);
        this.game.load.image(gameSelfRef.presentsName, gameSelfRef.presentsImg);
        this.game.load.image(gameSelfRef.titleName, gameSelfRef.titleImg);
        this.game.load.image(gameSelfRef.loadingButtonName, gameSelfRef.loadingButtonImg);
        this.game.load.image(gameSelfRef.shareButtonName, gameSelfRef.shareButtonImg);
        this.game.load.image(gameSelfRef.restartButtonName, gameSelfRef.restartButtonImg);
        this.game.load.image(gameSelfRef.creditsButtonName, gameSelfRef.creditsButtonImg);
        this.game.load.image(gameSelfRef.closeButtonName, gameSelfRef.closeButtonImg);

        this.game.load.image('ashleySprite', gameSelfRef.ashleyImg);
        this.game.load.image('ibsSprite', gameSelfRef.ibsImg);
        this.game.load.image('kyleSprite', gameSelfRef.kyleImg);
        this.game.load.image('zachSprite', gameSelfRef.zachImg);

        gameSelfRef.preloadVideos();

        gameSelfRef.fireOverlay.preload();
        gameSelfRef.timerDisplay.preload();
        gameSelfRef.scoreKeeper.preload();
        gameSelfRef.highScoreBoard.preload();
    }

    preloadVideos() {

        this.game.load.video('level1Video', 'assets/videos/Level1.webm');
        this.game.load.video('level2Video', 'assets/videos/Level2.webm');
        this.game.load.video('level3Video', 'assets/videos/Level3.webm');
        this.game.load.video('level4Video', 'assets/videos/Level4.webm');
        this.game.load.video('level5Video', 'assets/videos/Level5.webm');
    }



    create() {

        gameSelfRef.doneLoading = false;
        gameSelfRef.doneUserLoading = false;

        gameSelfRef.loadMusic();

        gameSelfRef.loadUsername();

        gameSelfRef.checkUserLoading();

        // create the cursor key object
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.gameState = gameStates.menu;

        //create logo aka Splash Screen object
        this.splashScreen = this.game.add.tileSprite(gameSelfRef.splashScreenX, gameSelfRef.splashScreenY,
            gameSelfRef.splashScreenWidth, gameSelfRef.splashScreenHeight, gameSelfRef.splashScreenName);

        // create "presents" object
        this.presents = this.game.add.tileSprite(gameSelfRef.presentsX, gameSelfRef.presentsY,
            gameSelfRef.presentsWidth, gameSelfRef.presentsHeight, gameSelfRef.presentsName);

        // create fire object for title page
        this.titlePageFire = this.game.add.sprite(gameSelfRef.titlePageFireX,
            gameSelfRef.titlePageFireY, gameSelfRef.fireOverlay.spriteName);
        this.titlePageFire.scale.setTo(gameSelfRef.titlePageFireScaleX, gameSelfRef.titlePageFireScaleY);
        gameSelfRef.fireOverlay.animate(this.titlePageFire);

        // create game title object
        this.whackAFireTitle = this.game.add.tileSprite(gameSelfRef.whackAFireTitleX,
            gameSelfRef.whackAFireTitleY, gameSelfRef.whackAFireTitleWidth, gameSelfRef.whackAFireTitleHeight,
            gameSelfRef.titleName);

        // create instructions object
        this.instructions = this.game.add.text(gameSelfRef.instructionsX,
            gameSelfRef.instructionsY, gameSelfRef.instructionsText, gameSelfRef.instructionsStyle);
        this.instructions.wordWrap = true;
        this.instructions.wordWrapWidth = gameSelfRef.instructionsLength;

        // create start button object
        var onStartButtonDownImg = 'startButtonPressed.jpg';
        var onStartButtonUpImg = 'startButton.jpg';
        gameSelfRef.startButton = gameSelfRef.game.add.button(gameSelfRef.startButtonX,
            gameSelfRef.startButtonY, gameSelfRef.startButtonName, startStandard, this,
            onStartButtonDownImg, onStartButtonUpImg);

        //create loading button last so that it automatically renders on top of the Start Game button
        gameSelfRef.loadingButton = gameSelfRef.game.add.sprite(gameSelfRef.startButtonX, gameSelfRef.startButtonY, gameSelfRef.loadingButtonName);

        // create high score popup
        var onHighScoreButtonDownImg = 'highScoreButtonPressed.png';
        var onHighScoreButtonUpImg = 'highScoreButton.png';
        gameSelfRef.highScoreButton = gameSelfRef.game.add.button(gameSelfRef.highScoreButtonX,
            gameSelfRef.highScoreButtonY, gameSelfRef.highScoreButtonName,
            displayScores, gameSelfRef.highScoreBoard,
            onHighScoreButtonDownImg, onHighScoreButtonUpImg);
        gameSelfRef.highScoreBoard.create();

        //create credits button
        gameSelfRef.creditsButton = this.game.add.button(gameSelfRef.creditsButtonX, gameSelfRef.creditsButtonY, gameSelfRef.creditsButtonName, gameSelfRef.showCredits);

        // create map object
        gameSelfRef.map = this.game.add.tileSprite(gameSelfRef.mapX, gameSelfRef.mapY,
            gameSelfRef.mapWidth, gameSelfRef.mapHeight, gameSelfRef.mapName);
        gameSelfRef.map.visible = false;

        function startStandard() {
            gameSelfRef.startGame(null); 
        }

        function displayScores () {
            gameSelfRef.highScoresClicked(null);
        }

        gameSelfRef.serverQuery_LoadFireData();
        gameSelfRef.randomizeFires(gameSelfRef.fireDataList);
        gameSelfRef.playSplashVideo();

        gameSelfRef.checkLoading();

    }

    startGame(callback) {
        if (!gameSelfRef.doneLoading) {
            console.log("Not finished loading");
            return;
        }

        gameSelfRef.startButton.destroy();
        gameSelfRef.highScoreButton.destroy(); 

        gameSelfRef.themeTrack.stop();
        gameSelfRef.musicTrack.play();
        gameSelfRef.musicTrack.volume = 0.4; 
        gameSelfRef.map.visible = true;
        gameSelfRef.gameState = gameStates.ingame;
        gameSelfRef.gameInstance = new WhackAFireInstance(gameSelfRef, gameSelfRef.scoreKeeper, gameSelfRef.timerDisplay, gameSelfRef.fireOverlay);
        

        if (callback != null) {
            callback(gameSelfRef.map.visible, this.gameState, gameSelfRef.gameInstance);
        } 
    }

    highScoresClicked (callback) {

        if (!gameSelfRef.doneUserLoading) {
            console.log("Not finished loading user.");
            return;
        }
        gameSelfRef.highScoreBoard.setUser(gameSelfRef.user);
        gameSelfRef.highScoreBoard.showHighScorePopup();

        if (callback != null) {
            callback(gameSelfRef.highScoreBoard);
        }
    }

    showCredits() {
        var creditStyle = { font: "20px Impact", fill: "#fff"};
        var creditsBG = this.game.add.image(80, 0, gameSelfRef.endTableBackgroundName);
        var creditsCloseButton = this.game.add.button(gameSelfRef.closeButtonX, gameSelfRef.closeButtonY, gameSelfRef.closeButtonName, destroyCredits);
        var ashleySprite = this.game.add.image(285, 25, 'ashleySprite');
        var ibsSprite = this.game.add.image(285, 175, 'ibsSprite');
        var kyleSprite = this.game.add.image(285, 325, 'kyleSprite');
        var zachSprite = this.game.add.image(285, 425, 'zachSprite');
        var ashleyText = this.game.add.text(285, 125, 'Slagathor', creditStyle);
        var ibsText = this.game.add.text(235, 275, 'BIG BOSS MAN BRAHIM', creditStyle);
        var kyleText = this.game.add.text(295, 425, 'K-Dizzle', creditStyle);
        var zachText = this.game.add.text(225, 525, 'Zach "SNUGGLES" MacKay', creditStyle);
        var musicStyle = { font: "15px Courier", fill: "#fff"};
        var musicText = this.game.add.text(105, 575, 'Special thanks to Miami Night 1984 for the music', musicStyle);

        function destroyCredits(){
            creditsBG.destroy();
            creditsCloseButton.destroy();
            ashleySprite.destroy();
            ibsSprite.destroy();
            kyleSprite.destroy();
            zachSprite.destroy();
            ashleyText.destroy();
            ibsText.destroy();
            kyleText.destroy();
            zachText.destroy();
            musicText.destroy();

        }

    }


    playSplashVideo() {

        var playVid = this.game.add.video('splashVideo');

        var sprite = this.game.add.sprite(0, 0, playVid);
        sprite.scale.set(1);

        playVid.play();

        this.game.time.events.add(this.splashVideoLength, function () {
            sprite.destroy();
            playVid.destroy();
            gameSelfRef.triggerThemeMusic(); 
        });
    }

    triggerThemeMusic() {
        this.themeTrack.play();
        this.themeTrack.volume = 0.6;
    }

    checkLoading() {

        if (gameSelfRef.fireDataList.length > 0 && gameSelfRef.musicTrack != null) {
            gameSelfRef.doneLoading = true;
            gameSelfRef.loadingButton.destroy(); 
            return;
        }

        var timeToWait = 100;
        this.game.time.events.add(timeToWait, function () {
            gameSelfRef.checkLoading();
        });
    }

    checkUserLoading() {
        if (gameSelfRef.username != null) {
            console.log("inside user loading success");
            gameSelfRef.serverQuery_UserLogin();
            gameSelfRef.doneUserLoading = true;
            return;
        }

        var timeToWait = 100;
        this.game.time.events.add(timeToWait, function () {
            gameSelfRef.checkUserLoading();
        });

    }

    loadMusic() {
        this.musicTrack = this.game.add.audio('music');
        this.themeTrack = this.game.add.audio('theme');
        
    }

    loadUsername() {
        console.log('In Load Username');
        gameSelfRef.username = gameSelfRef.facebookUtil.gameLogin(gameSelfRef);
    }


    getFireDataList() {
        return this.fireDataList;
    }

    getGameInstance() {
        return this.gameInstance;
    }

    update() {

        // Update input state
        this.game.input.update();

        if (this.gameState == gameStates.ingame) {
            this.startButton.visible = false;
            this.instructions.visible = false;
        } else if (this.gameState == gameStates.endgame) {
            this.showFireData();
            this.saveUserScore();

        }


    }

    //Developer note: we're using static declaration to these methods to
    //avoid 'this' keyword dereference issues
    serverQuery_LoadFireData() {
        var clientSocket = io();
        clientSocket.emit('ClientRequest_FetchFireData');
        clientSocket.on('ServerResponse_LoadFireData', function (data) {
            gameSelfRef.loadFireData(data);
        });

    }

    serverQuery_UserLogin() {
        console.log('name in game.ts is ' + gameSelfRef.username);
        var clientSocket = io();
        clientSocket.emit('ClientRequest_UserLogin', gameSelfRef.username);
        clientSocket.on('ServerResponse_UserLogin', function (user) {
            gameSelfRef.setUser(user);
        });

    }

    loadFireData(data: Array<any>) {
        for (var a = 0; a < data.length; a++) {
            gameSelfRef.fireDataList[a] = new FireData(data[a].FireName, new LatLong(data[a].XPosition, data[a].YPosition));
        }
    }

    setUser(data) {
        console.log(data[0].name);
        console.log(data[0].scores);

        var scoreObject = data[0].scores;

        var scoreArray = Object.keys(scoreObject).map(function(k) { return scoreObject[k] });

        console.log(scoreArray);
        gameSelfRef.user = new User(data[0].name,scoreArray);
    }

    sendTestRequest() {

        var clientSocket = io();

        clientSocket.emit('testRequest');

        clientSocket.on('testServerResponse', function () {
            console.log("The server says hi");
        });

    }

    randomizeFires(fires: Array<FireData>) {

        for (var i = 0; i < fires.length; i++) {
            var randomIndex: number = Math.floor(Math.random() * (i + 1));
            var toSwap = fires[i];

            fires[i] = fires[randomIndex];
            fires[randomIndex] = toSwap;
        }

        return fires;
    }

    endGame() {
        gameSelfRef.gameState = gameStates.endgame;
        gameSelfRef.update();
        this.game.paused = true;


        // Developer note: buttons and the update() loop no longer works since the game is paused
        // Hence, inputs will need to be based on x and y coordinates. This is what the unpause method does
        this.game.input.onDown.add(gameSelfRef.unpause, self);
    }

    //TODO: Implement button graphics and facebook share logic
    unpause(event) {
        if(gameSelfRef.gameState == gameStates.endgame) {

            //set edges of facebook sharing button
            var fbx1 = 110, fbx2 = 290,
                fby1 = 535, fby2 = 615;

            // set edges of restart button
            var restartx1 = 350, restartx2 = 530,
                restarty1 = 535, restarty2 = 615;

            if(event.x > fbx1 && event.x < fbx2 && event.y > fby1 && event.y < fby2){
                gameSelfRef.facebookUtil.shareScore(gameSelfRef.scoreKeeper.currentScore);
            }
            if(event.x > restartx1 && event.x < restartx2 && event.y > restarty1 && event.y < restarty2){
                gameSelfRef.restartGame();
            }
        }
    }

    restartGame() {
        //destroy old game instance
        this.game.destroy();

        //instantiate new game instance
        this.game = new Phaser.Game(640, 640, Phaser.AUTO, 'content', {
            preload: this.preload, create: this.create,
            update: this.update
        });

        // instantiate classes for new game instance
        gameSelfRef.timerDisplay = new Timer(this.game, this, startingTime, gameSelfRef.endGame);
        gameSelfRef.scoreKeeper = new ScoreKeeper(this.game, this, startingMul);
        gameSelfRef.fireOverlay = new FireOverlay(this.game, gameSelfRef.scoreKeeper, this, gameSelfRef.numFiresToStart);
        gameSelfRef.highScoreBoard = new HighScorePopup(this.game);
        gameSelfRef.facebookUtil = new FacebookUtil();
    }

    showFireData() {
        // create background for table
        this.bg = this.game.add.image(80, 0, gameSelfRef.endTableBackgroundName);

        gameSelfRef.restartButton = this.game.add.sprite(gameSelfRef.restartButtonX, gameSelfRef.restartButtonY, gameSelfRef.restartButtonName);
        gameSelfRef.shareButton = this.game.add.sprite(gameSelfRef.shareButtonX, gameSelfRef.shareButtonY, gameSelfRef.shareButtonName);

        // displays heading for clicked fire data table
        var headingstyle = { font: "12px Courier", fill: "#fff", tabs: 160 };
        var headings = ['Name', 'Latitude', 'Longtitude'];
        var displayHeadings = this.game.add.text(90, 10, '', headingstyle);
        displayHeadings.parseList(headings);

        //display body for clicked fire data table
        var bodystyle = { font: "8px Courier", fill: "#fff", tabs: 160 };
        var clickedFires = [];
        var maxTableLength = 35;

        // parse through names of clicked fires and get latlong
        for (var i = 0; i < maxTableLength; i++) {
            var clickedFireName = gameSelfRef.gameInstance.extinguishedFireNames[i];

            clickedFires[i] = [clickedFireName,
                gameSelfRef.findLat(clickedFireName),
                gameSelfRef.findLong(clickedFireName)];
        }
        var displayfireData = this.game.add.text(90, 25, '', bodystyle);
        displayfireData.parseList(clickedFires);
    }

    saveUserScore() {
        var clientSocket = io();

        gameSelfRef.user.highScores.push(gameSelfRef.scoreKeeper.currentScore);
        clientSocket.emit('ClientRequest_SaveScore', gameSelfRef.user);

    }

    // returns latitude based on fire name and it's X coordinate
    findLat(clickedFireName: any) {
        for (var i = 0; i < this.fireDataList.length; i++) {
            if (clickedFireName == this.fireDataList[i].name) {
                var fireLat = (this.latOfOrigin - (this.fireDataList[i].latLong.lat * this.latPerPixel)).toFixed(2);
                return fireLat;
            }
        }
    }

    // returns longitude based on fire name and it's Y coordinate
    findLong(clickedFireName: any) {
        for (var a = 0; a < this.fireDataList.length; a++) {
            if (clickedFireName == this.fireDataList[a].name) {
                var fireLong = ((this.fireDataList[a].latLong.long * this.longPerPixel) + this.longOfOrigin).toFixed(2);
                return fireLong;
            }
        }
    }




}

//Dev note: this seems like the most reliable way to retain a reference to 'this'
//          when 'this' is a singleton  
var gameInstanceSelfRef;

interface GameInstanceInterface {
    level: number;
    game: Game;
    scoreKeeper: ScoreKeeper;
    timer: Timer;
    maxCount: number;


    initNewGame();
    postScore(score: number);
    postGameOver();
    postName(name: string);
    getMaxCount();
    incrementLevel();

}

var whackAFireSelfRef;

class WhackAFireInstance implements GameInstanceInterface {


    //Interface fields 
    level: number;
    game: Game;
    scoreKeeper: ScoreKeeper;
    timer: Timer;
    maxCount: number;
    extinguishedFireNames: Array<string>;  //list of names of fires extinguished so far this game instance 
    //Unique fields 
    maximumLevel: number;
    minimumTime: number;
    timerLevelDecrement: number;
    fireLevelFactor: number;
    scoreLevelFactor: number;
    levelVideoLength: number;
    levelVideosArray: Array<any>;
    maxTime: number;
    fireOverlay: FireOverlay; 



    constructor(game: Game, sk: ScoreKeeper, timer: Timer, overlay: FireOverlay) {

        whackAFireSelfRef = this;

        whackAFireSelfRef.level = 1;
        whackAFireSelfRef.game = game;
        whackAFireSelfRef.scoreKeeper = sk;
        whackAFireSelfRef.timer = timer;
        whackAFireSelfRef.fireOverlay = overlay; 
        whackAFireSelfRef.maxTime = startingTime;
        whackAFireSelfRef.maxCount = startingMaxFires;

        whackAFireSelfRef.maximumLevel = 5;
        whackAFireSelfRef.minimumTime = 8;
        whackAFireSelfRef.timerLevelDecrement = 4;
        whackAFireSelfRef.fireLevelFactor = 5;
        whackAFireSelfRef.scoreLevelFactor = 10;

        whackAFireSelfRef.extinguishedFireNames = new Array();
        whackAFireSelfRef.levelVideosArray = new Array();
        whackAFireSelfRef.levelVideoLength = 4380;

        whackAFireSelfRef.initLevelVideos();


        whackAFireSelfRef.timer.create();
        whackAFireSelfRef.timer.initilize();
        whackAFireSelfRef.scoreKeeper.create();

        whackAFireSelfRef.initNewGame();

    }

    initLevelVideos() {

        if (whackAFireSelfRef.game.game == null) return; //developer note: this line is for unit test support 
        whackAFireSelfRef.levelVideosArray[0] = whackAFireSelfRef.game.game.add.video('level1Video');
        whackAFireSelfRef.levelVideosArray[1] = whackAFireSelfRef.game.game.add.video('level2Video');
        whackAFireSelfRef.levelVideosArray[2] = whackAFireSelfRef.game.game.add.video('level3Video');
        whackAFireSelfRef.levelVideosArray[3] = whackAFireSelfRef.game.game.add.video('level4Video');
        whackAFireSelfRef.levelVideosArray[4] = whackAFireSelfRef.game.game.add.video('level5Video');

    }

    initNewGame() {
        whackAFireSelfRef.level = 0;
        whackAFireSelfRef.incrementLevel();

    }

    postName(name: string) {
        whackAFireSelfRef.extinguishedFireNames.push(name);
    }

    //Note: this method is not implemented by our game, but exists to support greater modularity 
    postScore(score: number) {

    }

    incrementLevel() {
        if (whackAFireSelfRef.level == whackAFireSelfRef.maximumLevel) {
            if (whackAFireSelfRef.maxTime != whackAFireSelfRef.minimumTime) {
                whackAFireSelfRef.maxTime -= whackAFireSelfRef.timerLevelDecrement;
            }
            whackAFireSelfRef.timer.setTime(whackAFireSelfRef.maxTime);
            whackAFireSelfRef.maxCount = whackAFireSelfRef.maximumLevel * whackAFireSelfRef.fireLevelFactor;
            return;
        }

        whackAFireSelfRef.level++;
        
        whackAFireSelfRef.game.randomizeFires(whackAFireSelfRef.game.fireDataList);

        whackAFireSelfRef.maxCount = whackAFireSelfRef.level * whackAFireSelfRef.fireLevelFactor;
        whackAFireSelfRef.fireOverlay.numFiresToShow = whackAFireSelfRef.maxCount; 
        whackAFireSelfRef.fireOverlay.numFiresShown = whackAFireSelfRef.maxCount; 
        whackAFireSelfRef.timer.setTime(whackAFireSelfRef.maxTime);
        whackAFireSelfRef.scoreKeeper.setScoreMul(whackAFireSelfRef.scoreLevelFactor * whackAFireSelfRef.level);

        whackAFireSelfRef.timer.setPaused(true);

        whackAFireSelfRef.playLevelVideo();
    }

    

    playLevelVideo() {

        console.log("Play level vid"); 
        var playVid = whackAFireSelfRef.levelVideosArray[whackAFireSelfRef.level - 1];

        var x = 0;
        var y = 0;
        var sprite = whackAFireSelfRef.game.game.add.sprite(x, y, playVid);
        var scale = 1;
        sprite.scale.set(scale);

        playVid.play();

        whackAFireSelfRef.game.game.time.events.add(whackAFireSelfRef.levelVideoLength, function () {
            sprite.destroy();
            playVid.destroy();
            whackAFireSelfRef.game.fireOverlay.renderFires(whackAFireSelfRef.game.fireDataList);
            whackAFireSelfRef.beginGameplay();
        });
    }

    beginGameplay() {
        whackAFireSelfRef.timer.setPaused(false);
    }

    postGameOver() {

    }

    getMaxCount() {
        return whackAFireSelfRef.maxCount;
    }
}

var testGame; 
window.onload = () => {
    var game = new Game();
    testGame = game; 
};