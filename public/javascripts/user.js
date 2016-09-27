/**
 * Created by ibrahimitani on 2015-11-22.
 */
var User = (function () {
    function User(name, highScores) {
        this.name = name;
        this.highScores = highScores;
    }
    User.prototype.getName = function () {
        return this.name;
    };
    User.prototype.getHighScores = function () {
        return this.highScores;
    };
    return User;
})();
//# sourceMappingURL=user.js.map