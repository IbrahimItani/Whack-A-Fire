var express = require('express');
var csv = require('./CsvParser');
var routes = require('./routes/index');
var stylus = require('stylus');
var path = require('path');
var DatabaseManager = (function () {
    function DatabaseManager() {
        console.log("Creating new DatabaseManager");
        //Set testing boolean
        this.confirmation = true;
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        var ObjectId = require('mongodb').ObjectID;
        //Connect the MongoClient
        this.databaseUrl = 'mongodb://shared:shared@ds051534.mongolab.com:51534/heroku_sk6ds2pm';
    }
    DatabaseManager.prototype.loadData = function (data) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        MongoClient.connect(this.databaseUrl, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to database server");
            db.collection('firedata').remove({});
            db.collection('firedata').insert(data, function (error) {
                if (error) {
                    console.log("error inserting data into firedata collection");
                    return;
                }
                console.log("finished inserting data");
                db.close();
            });
        });
    };
    DatabaseManager.prototype.userLogin = function (user) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        console.log(user);
        MongoClient.connect(this.databaseUrl, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to database server");
            db.collection('users').find({}, { "name": user['name'], "scores": 1 }).toArray(function (error, userArray) {
                for (var i = 0; i < userArray.length; i++) {
                    if (userArray[i].name == user['name']) {
                        db.close();
                        return;
                    }
                    else {
                        user.scores = {};
                        db.collection('users').insert(user, function (error) {
                            if (error) {
                                console.log("error inserting user into user collection");
                                return;
                            }
                            console.log("finished inserting user");
                            db.close();
                        });
                    }
                }
            });
        });
    };
    DatabaseManager.prototype.saveScore = function (user) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        MongoClient.connect(this.databaseUrl, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to database server");
            console.log("user highscores: " + user['highScores']);
            db.collection('users').update({ "name": user['name'] }, { "scores": user['highScores'] });
            db.close();
        });
    };
    DatabaseManager.prototype.retrieveUser = function (user, callback) {
        var MongoClient = require('mongodb').MongoClient;
        console.log('user in retrieve user is' + user);
        var assert = require('assert');
        MongoClient.connect(this.databaseUrl, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to database server (retrieveUser)");
            db.collection('users').find({}, { "name": user, "scores": 1 }).toArray(function (error, userArray) {
                callback(userArray);
                db.close();
            });
        });
    };
    DatabaseManager.prototype.retrieveFireData = function (callback) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        MongoClient.connect(this.databaseUrl, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to database server (retrieveFirstFireData)");
            db.collection('firedata').find({}, { "FireName": 1, "XPosition": 1, "YPosition": 1, _id: 0 }).toArray(function (error, dataArray) {
                callback(dataArray);
                db.close();
            });
        });
    };
    return DatabaseManager;
})();
var Server = (function () {
    function Server() {
        var csvName = "./TruncatedFires.csv";
        var serverSelf = this; //to handle java script's 'this' keyword madness
        serverSelf.parser = new csv.CSVParser();
        var app = express();
        var http = require('http').Server(app);
        var io = require('socket.io')(http);
        // all environments
        app.set('port', process.env.PORT || 3000);
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(app.router);
        app.use(stylus.middleware(path.join(__dirname, 'public')));
        app.use(express.static(path.join(__dirname, 'public')));
        // development only
        if ('development' == app.get('env')) {
            app.use(express.errorHandler());
        }
        app.get('/', routes.index);
        app.get('/admin', routes.admin);
        app.get('/game', routes.game);
        app.get('/videotest', routes.videotest);
        app.get('/testsuite', routes.testsuite);
        io.on('connection', function (client) {
            console.log('a user connected');
            client.on('disconnect', function () {
                console.log('user disconnected');
            });
            //All Server Listen Requests Go HERE
            client.on('testRequest', function () {
                console.log('client is making a request from server');
                client.emit('testServerResponse');
            });
            client.on('userLogin', function (data) {
                console.log('user is attempting to log in');
                serverSelf.dbManager.userLogin(data);
            });
            client.on('ClientRequest_SaveScore', function (data) {
                console.log('user is attempting to save score');
                serverSelf.dbManager.saveScore(data);
            });
            client.on('ClientRequest_UserLogin', function (data) {
                console.log('Client is making ClientRequest_UserLogin');
                console.log("in client function" + data);
                serverSelf.dbManager.retrieveUser(data, function (user) {
                    client.emit('ServerResponse_UserLogin', user);
                });
            });
            client.on('loadData', function () {
                console.log('client is making a request to load data');
                serverSelf.parser.parseCsv(csvName, function (jsonObj) {
                    console.log("Server recieved json data from csv parser");
                    this.dbManager = new DatabaseManager();
                    this.dbManager.loadData(jsonObj);
                });
            });
            client.on('ClientRequest_FetchFireData', function () {
                console.log('Client is making ClientRequest_FetchFireData');
                serverSelf.dbManager.retrieveFireData(function (data) {
                    client.emit('ServerResponse_LoadFireData', data);
                });
            });
        });
        http.listen(app.get('port'), function () {
            console.log('Express server listening on port ' + app.get('port'));
        });
        this.initDatabaseManager();
    }
    Server.prototype.initDatabaseManager = function () {
        console.log("initDatabaseManager triggered");
        this.dbManager = new DatabaseManager();
    };
    return Server;
})();
var serverInstance = new Server();
//# sourceMappingURL=app.js.map