/**
 * Created by Ashley on 2015-11-02.
 */
var LatLong = (function () {
    function LatLong(lat, long) {
        this.lat = lat;
        this.long = long;
        this.latitude = lat;
        this.longitude = long;
    }
    LatLong.prototype.getLatitude = function () {
        return this.latitude;
    };
    LatLong.prototype.getLongitude = function () {
        return this.longitude;
    };
    LatLong.prototype.setLatitude = function (lat) {
        this.latitude = lat;
    };
    LatLong.prototype.setLongitude = function (long) {
        this.longitude = long;
    };
    return LatLong;
})();
//# sourceMappingURL=latlong.js.map