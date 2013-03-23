exports.index = function(req, res) {
    res.locals = {
        title: 'Home'
    };
    return res.render('home/index',{
        partials: {
            header: 'wrapper/header',
            menu_site: 'wrapper/menu_site',
            footer: 'wrapper/footer',
            iniciativas_browser_command: 'wrapper/iniciativas_browser_commands',
            map: 'widgets/map'
        }
    });
};
