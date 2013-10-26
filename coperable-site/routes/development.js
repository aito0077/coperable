var _ = require('underscore');

exports.index = function(req, res) {

  var geo = (req.session ? req.session.geo : false) ||
            (req.cookies ? req.cookies.geo : undefined)

  return res.render('development/index.html', {
    layout: 'layout-dev',
    layoutTitle: 'Desarrollo',
    layoutId: 'dev-index',
    user: req.user,
    geo: geo
  })
};

exports.doc = function(req, res) {

  var geo = (req.session ? req.session.geo : false) ||
            (req.cookies ? req.cookies.geo : undefined)

  return res.render('development/documentation.html', {
    layout: 'layout-dev',
    layoutTitle: 'Desarrollo',
    layoutId: 'dev-index',
    user: req.user,
    geo: geo
  })
};

exports.control = function(req, res) {

  var geo = (req.session ? req.session.geo : false) ||
            (req.cookies ? req.cookies.geo : undefined)

  return res.render('development/control.html', {
    layout: 'layout-dev',
    layoutTitle: 'Desarrollo',
    layoutId: 'dev-index',
    user: req.user,
    geo: geo
  })
};
