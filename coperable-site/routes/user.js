var users = require('../logic/users'),
  us = require('underscore');

exports.profile = function(req, res) {
  var user_id = req.params['id'];
  users.profile(user_id, function(err, user) {

    res.locals = us.extend(res.locals, {
      profile: user,
      title: 'Perfil'
    });
    return res.render('user/profile.html',{
		layoutTitle: 'Perfil',
		layoutId: 'user-login'
	});

  });

};

exports.login = function(req, res) {
  return res.render('user/login.html', {
    layoutTitle: 'Login',
    layoutId: 'user-login'
  })
};

exports.signup = function(req, res) {
  var s3Credentials = {};
  return res.render('user/signup.html', {
    layoutTitle: 'Registrate',
    layoutId: 'user-signup'
  })
};

exports.set_localization = function(req, res, done) {
  console.dir(req.params);
  var geo = {
    latitud: req.params['latitud'],
    longitud: req.params['longitud']
  };

  console.dir(geo);
  res.cookie('geo', {
    latitud: geo.latitud,
    longitud: geo.longitud
  },{ expires: new Date(Date.now() + 900000)});

  if(res.session) {
    res.session.geo = {
      latitud: geo.latitud,
      longitud: geo.longitud
    };
  }
  res.send('ok');
};

