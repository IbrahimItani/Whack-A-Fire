/**
 * Created by ibrahimitani on 2015-11-22.
 */

class User {

    name: string;
    highScores: Array<number>;

    constructor(name: string, highScores: Array<number>) {
        this.name = name;
        this.highScores = highScores;
    }

    getName() {
        return this.name;
    }

    getHighScores() {
        return this.highScores;
    }

}