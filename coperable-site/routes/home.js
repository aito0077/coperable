var us = require('underscore');

exports.index = function(req, res) {

    /*
    console.dir(req.cookies);

    var geo = (req.session ? req.session.geo : false) || (req.cookies ? req.cookies.geo : undefined);
    res.locals = {
        user: req.user,
        geo: geo,
        title: 'Home'
    };
    */

    res.locals = us.extend(res.locals, {
        title: 'Home'
    });
    return res.render('home/index',{
        partials: {
            header: 'wrapper/header',
            menu_site: 'wrapper/menu_site',
            footer: 'wrapper/footer',
            iniciativas_browser_command: 'wrapper/iniciativas_browser_commands',
            map: 'widgets/map',
            login_modal: 'user/login_widget'
        }
    });
};
