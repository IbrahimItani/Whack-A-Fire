/**
 * Created by Ashley on 2015-11-02.
 */

class LatLong {
    latitude: number;
    longitude: number;

    constructor(public lat, public long) {
        this.latitude = lat;
        this.longitude = long;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }

    setLatitude(lat: number) {
        this.latitude = lat;
    }

    setLongitude(long: number) {
        this.longitude = long;
    }

}