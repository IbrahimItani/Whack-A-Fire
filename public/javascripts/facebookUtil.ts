/**
 * Created by ibrahimitani on 2015-11-23.
 */

/// <reference path="game.ts"/>

var FB; 
var fbUtilSelfRef; 


class FacebookUtil {

    constructor() {

        username: String;

        fbUtilSelfRef = this;

        window['fbAsyncInit'] = function() {
            //SDK loaded, initialize it
            FB.init({
                appId      : '1692764287609475',
                xfbml      : true,
                version    : 'v2.5'
            });

            ////check user session and refresh it
            //FB.getLoginStatus(function(response) {
            //    if (response.status === 'connected') {
            //        //user is authorized
            //        document.getElementById('loginBtn').style.display = 'none';
            //        getUserData();
            //    } else {
            //        //user is not authorized
            //    }
            //});
        };

    //load the JavaScript SDK
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    indexLogin() {
        //do the initial login at index screen
        var name;
        FB.login(function(response) {
            if (response.authResponse) {
                //user just authorized your app
                document.getElementById('loginBtn').style.display = 'none';
                name = fbUtilSelfRef.getUserData();
            }
        }, {scope: 'public_profile', return_scopes: true});
        return name;
    }

    gameLogin(game: Game) {
        //do the login in the game component
        FB.login(function(response) {
            if (response.authResponse) {
                //user just authorized your app
                //return
                fbUtilSelfRef.getUserName(game);
            }
        }, {scope: 'public_profile', return_scopes: true});
    }

    getUserName(game: Game) {

        var name;
        FB.api('/me?fields=id,name', function(response) {
            name = response.name;
            console.log('name in getUserName() ' + name);
            game.username = name;
            //return name;
        });
        //return name;
    }

    getUserData() {
        FB.api('/me?fields=id,name,first_name,last_name', function(response) {
            document.getElementById('response').innerHTML = response.name;
            console.log(JSON.stringify(response.name));
            var clientSocket = io();
            var name = response.name;
            clientSocket.emit('userLogin', { name: name});
        });
    }

    shareScore(score) {
        FB.ui({
            method: 'feed',
            name: 'WhackAFire',
            description: 'WhackAFire',
            link: 'http://www.facebook.com/l.php?u=http%3A%2F%2Fquiet-retreat-8328.herokuapp.com%2F&h=EAQGGgW-R',
            caption: 'I just scored: ' + score + ' points in WhackAFire, check me out!'
        }, function(response){});
    }



}

var fbUtil = new FacebookUtil();