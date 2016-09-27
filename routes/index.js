function index(req, res) {
    res.render('index', { title: 'Express' });
}
exports.index = index;
;
function admin(req, res) {
    res.render('admin', { title: 'Admin UI' });
}
exports.admin = admin;
;
function game(req, res) {
    res.render('game', { title: 'Game' });
}
exports.game = game;
;
function videotest(req, res) {
    res.render('videotest', { title: 'Video Test' });
}
exports.videotest = videotest;
;
function testsuite(req, res) {
    res.render('testsuite', { title: 'Test Suite' });
}
exports.testsuite = testsuite;
;
//# sourceMappingURL=index.js.map