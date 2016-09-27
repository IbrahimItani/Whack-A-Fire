/// <reference path="latLong.ts"/> 

class FireData {

    latLong: LatLong;
    name: string;

    constructor(name: string, latLong: LatLong) {
        this.latLong = latLong;
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getLatLong() {
        return this.latLong;
    }

}