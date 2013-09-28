var config = require('../config-dev'),
    cop_api = require('../api_client/api'),
    users = require('../logic/users'),
    passport = require('passport'),
    us = require('underscore'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy;

passport.serializeUser(function(user, done) {
    var session_user = {
        id: user._id,
        username: user.first_name
    };
    done(null, session_user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        console.log('Email: '+email+' - password: '+password);
        users.authenticate(email, password, function(err, user) {
            if (err) { return done(err); }
            if (us.isEmpty(user)) {
                return done(null, false, { message: 'Usuario/Password incorrecto.' });
            }
            return done(null, user);
        });
    }
));


var oauthenticate_create = function(accessToken, refreshToken, given_profile, done) {
    var profile = given_profile._json;
    users.oauthenticate(given_profile.provider, given_profile.id, function(err, user) {
        if (err) { return done(err); }
        if (us.isEmpty(user)) {
            var user_data = {};
            switch(given_profile.provider) {
                case 'facebook':
                    user_data = {
                        first_name: profile.first_name,
                        last_name: profile.last_name,
                        verified: profile.verified
                    };
                    break;
                case 'twitter':
                    user_data = {
                        first_name: profile.name,
                        verified: true
                    };
                    break;

                default:

                    break;
            }
            user_data['authenticate_with'] = given_profile.provider;
            user_data[given_profile.provider+'_id'] = given_profile.id;

            cop_api.client.put('/api/usuario', user_data, function(err, req, res, user) {
                done(null, user);
            });
        } else {
            return done(null, user);
        }
    });
};


passport.use(new FacebookStrategy({
        clientID: config.system.FACEBOOK.id,
        clientSecret: config.system.FACEBOOK.secret,
        callbackURL: "http://coperable.cloudfoundry.com/auth/facebook/callback"
        //callbackURL: "http://coperable.net/auth/facebook/callback"
    },
    oauthenticate_create
));

passport.use(new TwitterStrategy({
        consumerKey: config.system.TWITTER.key,
        consumerSecret: config.system.TWITTER.secret,
        callbackURL: "http://coperable.cloudfoundry.com/auth/twitter/callback"
        //callbackURL: "http://coperable.net/auth/twitter/callback"
    },
    oauthenticate_create
));

