var iniciativas = require('../logic/iniciativas'),
  us = require('underscore');

exports.create = function(req, res) {
  us.extend(res.locals, {
    title: 'Organiza'
  });
  return res.render('iniciativa/create',{
    partials: {
      header: 'wrapper/header',
      menu_site: 'wrapper/menu_site',
      footer: 'wrapper/footer',
      widget_address: 'widgets/address'
    }
  });
};

exports.edit = function(req, res) {
  var iniciativa_id = req.params['id'];
  iniciativas.findById(iniciativa_id, function(err, iniciativa) {
    iniciativa.description = JSON.parse(iniciativa.description);
    res.locals = us.extend(res.locals, {
      iniciativa: iniciativa,
      title: 'Organiza'
    });
    return res.render('iniciativa/edit',{
      partials: {
        header: 'wrapper/header',
        menu_site: 'wrapper/menu_site',
        widget_address: 'widgets/address',
        footer: 'wrapper/footer'
      }
    });
  });

};

exports.view = function(req, res) {
  var iniciativa_id = req.params['id'];
  iniciativas.findById(iniciativa_id, function(err, iniciativa) {
    console.dir(iniciativa);
    try {
      iniciativa.description = JSON.parse(iniciativa.description);
    }catch(e) {console.log(e);}

    res.locals = us.extend(res.locals, {
      iniciativa: iniciativa,
      title: iniciativa.name
    });
    return res.render('iniciativa/view',{
      partials: {
        header: 'wrapper/header',
        menu_site: 'wrapper/menu_site',
        map: 'widgets/map',
        footer: 'wrapper/footer'
      }
    });
  });

};

exports.view_slug = function(req, res) {
  var slug = req.params['slug'];
  iniciativas.findByName(slug, function(err, iniciativa) {
    console.dir(iniciativa);
    try {
      iniciativa.description = JSON.parse(iniciativa.description);
    }catch(e) {console.log(e);}

    res.locals = us.extend(res.locals, {
      iniciativa: iniciativa,
      title: iniciativa.name
    });
    return res.render('iniciativa/view',{
      partials: {
        header: 'wrapper/header',
        menu_site: 'wrapper/menu_site',
        map: 'widgets/map',
        footer: 'wrapper/footer'
      }
    });
  });

};



exports.list = function(req, res) {
  iniciativas.list(req, res, function(err, iniciativas) {
    res.locals = us.extend(res.locals, {
      iniciativas: iniciativas
    });
    return res.render('iniciativa/browser',{
      partials: {
        header: 'wrapper/header',
        menu_site: 'wrapper/menu_site',
        footer: 'wrapper/footer'
      }
    });
  });

};


