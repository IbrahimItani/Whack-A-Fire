import express = require('express');
import csv = require('./CsvParser'); 
import routes = require('./routes/index');
import admin = require('./routes/admin');
import game = require('./routes/game');
import stylus = require('stylus');
import path = require('path');
class DatabaseManager {
    // this field is currently only being used for testing purposes
    confirmation: boolean;
    databaseUrl: string;
    constructor() {
        console.log("Creating new DatabaseManager");
        //Set testing boolean
        this.confirmation = true;
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        var ObjectId = require('mongodb').ObjectID;
        //Connect the MongoClient
        this.databaseUrl = 'mongodb://shared:shared@ds051534.mongolab.com:51534/heroku_sk6ds2pm';
    }

    loadData(data) {
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
    }

    userLogin(user) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        console.log(user);
        MongoClient.connect(this.databaseUrl, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to database server");
            db.collection('users').find({}, {"name": user['name'], "scores":1}).toArray(function (error, userArray) {
                for(var i =0; i<userArray.length; i++){
                    if(userArray[i].name == user['name']){
                        db.close();
                        return;
                    } else {
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
    }

    saveScore(user) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        MongoClient.connect(this.databaseUrl, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to database server");
            console.log("user highscores: " + user['highScores']);
            db.collection('users').update({"name": user['name']}, {"scores": user['highScores']});
            db.close();
        });
    }

    retrieveUser(user, callback) {
        var MongoClient = require('mongodb').MongoClient;
        console.log('user in retrieve user is' + user);
        var assert = require('assert');
        MongoClient.connect(this.databaseUrl, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to database server (retrieveUser)");
            db.collection('users').find({}, {"name": user, "scores": 1}).toArray(function (error, userArray) {
                callback(userArray);
                db.close();
            });
        });
    }

    retrieveFireData(callback) {
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
    }
}
class Server {

    parser: csv.CSVParser;

    constructor() {
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
                serverSelf.parser.parseCsv(csvName, function (jsonObj: any) {
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
    dbManager: DatabaseManager;
    initDatabaseManager() {
        console.log("initDatabaseManager triggered");
        this.dbManager = new DatabaseManager();
    }

}



var serverInstance = new Server();