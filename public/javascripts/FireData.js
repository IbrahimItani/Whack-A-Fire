/// <reference path="latLong.ts"/> 
var FireData = (function () {
    function FireData(name, latLong) {
        this.latLong = latLong;
        this.name = name;
    }
    FireData.prototype.getName = function () {
        return this.name;
    };
    FireData.prototype.getLatLong = function () {
        return this.latLong;
    };
    return FireData;
})();
//# sourceMappingURL=FireData.js.map