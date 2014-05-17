var iniciativas = require('../logic/iniciativas'),
    users = require('../logic/users'),
    us = require('underscore');

exports.create = function(req, res) {
  /*
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
  */
  return res.render('iniciativa/create.html', {
    layoutTitle: 'Empezar Iniciativa',
    partials: {
        widget_address: 'widgets/address',
        head_resources: 'iniciativa/iniciativa_script_resources',
        bottom_resources: 'iniciativa/iniciativa_css_resources'
    }
  })
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
  console.log('route view')
  var iniciativa_id = req.params['id'];
  console.log('Jose debug: iniciativa_id: ' + iniciativa_id);
  iniciativas.findById(iniciativa_id, function(err, iniciativa) {
    console.dir(iniciativa);
    try {
      iniciativa.description = JSON.parse(iniciativa.description);
    }catch(e) {console.log(e);}

    console.dir(iniciativa.owner);
    if(iniciativa.owner) {
        iniciativa.creation_date = iniciativa.creation_date ? new Date(iniciativa.creation_date).toDateString() : '';
    users.profile(iniciativa.owner.user, function(err, user) {

        res.locals = us.extend(res.locals, {
          profile: user,
          iniciativa: iniciativa,
          layoutTitle: iniciativa.name,
          layoutId: 'iniciativas-view',
        });
        return res.render('iniciativa/view.html',{
          partials: {
            map: 'widgets/map',
          }
        });
    });
    } else {
        res.send("");
    }
  });

};

exports.view_slug = function(req, res) {
  console.log('route view_slug')
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
    return res.render('iniciativa/view.html',{
      partials: {
        map: 'widgets/map'
      }
    });
  });

};



exports.list = function(req, res) {
  iniciativas.list(req, res, function(err, iniciativas){
    /*
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
    */
    // iniciativas = [
    //   {
    //     name: 'Sembrando sonrisas en Boedo',
    //     slug: 'sembrando-semillas-en-boedo',
    //     category: {
    //       slug: 'environment',
    //       name: 'Medio Ambiente',
    //     },
    //     thumb: '/static/img/iniciativas/initiativepic-1-mq.jpg',
    //     address: 'Palermo, Buenos Aires',
    //     start_date: 'Martes 28/06/13 16:40hs',
    //     current_stage: 'convocatoria',
    //     pariticipants_amount: 28,
    //   }
    // ]
    if( req.xhr ) {
      return res.send(iniciativas)
    } else {
      return res.render('iniciativa/index.html', {
        layoutTitle: 'Iniciativas',
        layoutId: 'iniciativas-index',
        iniciativas: iniciativas,
        partials: {
          list: 'iniciativa/_list'
        }
      })
    }
  });
};


