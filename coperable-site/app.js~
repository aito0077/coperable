var config = require('./config'),
  express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  home = require('./routes/home'),
  iniciativa = require('./routes/iniciativa'),
  development = require('./routes/development'),
  iniciativas = require('./logic/iniciativas'),
  users = require('./logic/users'),
  http = require('http'),
  path = require('path'),
  passport = require('passport'),
  pass_autentication = require('./logic/authentication'),
  redis = require('redis'),
  external_files = require('./logic/filehandler'),
  RedisStore = require('connect-redis')(express);

var stylus = require('stylus')
var nib = require('nib')

var rClient = redis.createClient();
var sessionStore = new RedisStore({client:rClient});

var app = express();

app.engine('html', require('hogan-express'));
app.set('layout', 'layout.html')

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('view options', { layout: false });
    //  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.urlencoded());
  app.use(express.multipart());
  app.use(express.session({
    store: sessionStore,
    key: 'jsessionid',
    secret: 'bl33dingumñoño'}
  ));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use('/static', express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

function ensureAuthenticated(req, res, next) {
  if(!req.isAuthenticated()) {
    res.redirect('/user/login');
  }
  next('route');
}

function loadUserInformation(req, res, next) {
  var geo = (req.session ? req.session.geo : false) || (req.cookies ? req.cookies.geo : undefined);
  res.locals = {
    user: req.user,
    geo: geo
  };

  next('route');
}

app.get('*', loadUserInformation);
app.get('/*/create', ensureAuthenticated);

app.get('/', home.index);


app.all( '*', function( req, res, next ) {
  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
  if( 'OPTIONS' == req.method ) {
    res.send( 203, 'OK' );
  }
  next();
});


app.get('/iniciativas', iniciativa.list);
app.get('/iniciativas/create', iniciativa.create);
app.post('/iniciativas/:id', iniciativas.save);
app.post('/iniciativas', iniciativas.create);
//app.put('/iniciativas/:id', iniciativas.save);
app.get('/iniciativas/name/:slug', iniciativa.view_slug);
app.get('/iniciativas/:id', iniciativa.view);

app.get('/api/iniciativas/view/:id', iniciativa.view);
app.get('/api/iniciativas/edit', iniciativa.edit);
app.get('/api/iniciativas/:id', iniciativas.get);
app.post('/api/iniciativas/:id/:userId', iniciativas.participate);
app.post('/api/iniciativas', iniciativas.create);

app.get('/api/iniciativas', function(req, res, next) {
  console.dir(req.query);
  if(req.query.category) {
    iniciativas.browseByCategory(req, res, function(err, iniciativas) {
      res.send(iniciativas);
    });
  } else {
    iniciativas.list(req, res, function(err, iniciativas) {
      res.send(iniciativas);
    });
  }
});



app.get('/user/success_login', function(req, res, next) {
  res.redirect('/');
});

app.get('/user/failure_login', function(req, res, next) {
  res.redirect('/user/user_no_found');
  //res.send(403, 'El usuario no se encuentra.');
});


app.get(['/user/login', '/user/signup'], function(req, res, next){
  if(req.isAuthenticated()) {
    res.send({'result':'Ya estás logueado!'});
  }
  next('route')
});
app.get('/user/login', user.login);
app.post('/user/login',
  passport.authenticate('local', {
    successRedirect: '/user/success_login',
    failureRedirect: '/user/failure_login',
    failureFlash: false
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
app.get('/user/signup', user.signup);
app.post('/user/signup', users.do_signup, function(req, res){
  req.logout();
  res.redirect('/');
});
app.get('/user/geolocalization/:latitud/:longitud', user.set_localization);
app.get('/user/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.get('/users', users.list);

app.get('/user/:id', user.profile);


app.post('/uploads', external_files.upload);
app.post('/gets3credentials', external_files.createS3Policy);
app.get('/uploadsuccess', function(req, resp) {
  console.dir(req);
  console.log('Exito en subir la imagen');
  res.send('OK');
});



app.get('/development/', development.index);
app.get('/development/doc', development.doc);
app.get('/development/control', development.control);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
