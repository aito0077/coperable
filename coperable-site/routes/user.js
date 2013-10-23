var users = require('../logic/users'),
  us = require('underscore');

exports.profile = function(req, res) {
  var user_id = req.params['id'];
  users.profile(user_id, function(err, user) {

    res.locals = us.extend(res.locals, {
      profile: user,
      title: 'Perfil'
    });
    /*
    res.locals = {
      user: req.user,
      profile: user,
      title: 'Perfil'
    };
    */
    return res.render('user/profile',{
      partials: {
        header: 'wrapper/header',
        menu_site: 'wrapper/menu_site',
        footer: 'wrapper/footer'
      }
    });
  });

};

exports.login = function(req, res) {

  /*
  res.locals = us.extend(res.locals, {
    title: 'Login'
  });
  res.locals = {
    user: req.user,
    title: 'Login'
  };
  return res.render('user/login',{
    partials: {
      header: 'wrapper/header',
      menu_site: 'wrapper/menu_site',
      footer: 'wrapper/footer'
    }
  });
  */
  return res.render('user/login.html', {
    layoutTitle: 'Login',
    layoutId: 'user-login'
  })
};

exports.signup = function(req, res) {
  var s3Credentials = {};
  /*
  res.locals = {
    user: req.user,
    title: 'Registrate',
  };
  */

  /*
  res.locals = us.extend(res.locals, {
    title: 'Registrate'
  });
  return res.render('user/edit_profile',{
    partials: {
      header: 'wrapper/header',
      menu_site: 'wrapper/menu_site',
      footer: 'wrapper/footer',
      widget_address: 'widgets/address'
    }
  });
  */

  return res.render('user/signup.html', {
    layoutTitle: 'Login',
    layoutId: 'user-login'
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

