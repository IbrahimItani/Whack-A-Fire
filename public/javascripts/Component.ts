/**
 * Created by Ashley on 2015-11-18.
 */

/// <reference path="phaser.d.ts"/>
/// <reference path="game.ts"/>

interface Component {

    //variables
    game: Phaser.Game;
    localGame?: Game;
    fontX: number;
    fontY: number;
    fontSize: number;
    fontName: String;
    fontPNG: String;
    fontXML: String;
    initialText: String;

    //functions
    preload: () => void;
    create: () => void;
    update: () => void;
}