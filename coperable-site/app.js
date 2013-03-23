var config = require('./config'),
    express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    home = require('./routes/home'),
    api_client = require('./api_client/api'),
    iniciativa = require('./routes/iniciativa'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy;



var app = express();

app.engine('html', require('hogan-express'));
app.enable('view cache');

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'bl33dingumñoño' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use('/static', express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    /*
    User.findById(id, function(err, user) {
        done(err, user);
    });
    */
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        /*
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
        */
    }
));


passport.use(new FacebookStrategy({
        clientID: config.system.FACEBOOK_APP_ID,
        clientSecret: config.system.FACEBOOK_APP_SECRET,
        callbackURL: "http://coperable.cloudfoundry.com/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.dir(profile);
        /*
        User.findOrCreate(..., function(err, user) {
        if (err) { return done(err); }
            done(null, user);
        });
        */
    }
));

passport.use(new TwitterStrategy({
        consumerKey: config.system.TWITTER_CONSUMER_KEY,
        consumerSecret: config.system.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://coperable.cloudfoundry.com/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
        /*
        User.findOrCreate(..., function(err, user) {
            if (err) { 
                return done(err); 
            }
            done(null, user);
        });
        */
    }
));



app.get('/', home.index);
app.get('/iniciativa', iniciativa.view);
app.get('/iniciativa/owner', iniciativa.owner);
app.get('/iniciativa/create', iniciativa.create);
app.get('/users', user.list);
app.get('/user/login', user.login);

app.post('/user/login', 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true 
    })
);

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { 
        successRedirect: '/',
        failureRedirect: '/user/login' 
    })
);

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { 
        successRedirect: '/',
        failureRedirect: '/user/login'
    })
);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
