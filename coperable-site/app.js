var config = require('./config'),
  express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  home = require('./routes/home'),
  iniciativa = require('./routes/iniciativa'),
  iniciativas = require('./logic/iniciativas'),
  users = require('./logic/users'),
  http = require('http'),
  path = require('path'),
  passport = require('passport'),
  pass_autentication = require('./logic/authentication'),
  redis = require('redis'),
  external_files = require('./logic/filehandler'),
  RedisStore = require('connect-redis')(express);
/*
function _cb() {
  console.log(arguments)
}
var repl = require("repl");
var context = repl.start("$ ").context;
context.cb = _cb;
*/

var stylus = require('stylus')
var nib = require('nib')

var rClient = redis.createClient();
var sessionStore = new RedisStore({client:rClient});

var app = express();

app.set('layout', 'layout')
app.engine('html', require('hogan-express'));
//app.engine('jade', require('jade').__express);
//app.enable('view cache');


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('view options', { layout: false });
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'html');

  function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      .set('compress', false)
      .set('warn', true)
      .use(nib())
      .import('nib');
  }

  app.use(stylus.middleware({
    debug: true,
    src: __dirname + '/assets/css',
    dest: __dirname + '/public/css/',
    compile: compile
  }));

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
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

  console.dir(res.locals);
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

app.get('/iniciativas/edit', iniciativa.edit);
app.get('/iniciativas/create', iniciativa.create);
app.get('/iniciativas/view/:id', iniciativa.view);
app.get('/iniciativas/list', iniciativa.list);

app.post('/iniciativas', iniciativas.create);
app.put('/iniciativas/:id', iniciativas.save);
app.get('/iniciativas/:id', iniciativas.get);
app.get('/iniciativa/:slug', iniciativa.view_slug);

app.get('/iniciativas', function(req, res, next) {
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
  res.send({'result':'Bienvenido.'});
});

app.get('/user/failure_login', function(req, res, next) {
  res.send(403, 'El usuario no se encuentra.');
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


app.post('/gets3credentials', external_files.createS3Policy);
app.get('/uploadsuccess', function(req, resp) {
  console.dir(req);
  console.log('Exito en subir la imagen');
  res.send('OK');
});




http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
