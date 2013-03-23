exports.create = function(req, res) {
    res.locals = {
        title: 'Title',
    };
    return res.render('iniciativa/create',{
        partials: {
            part: 'part',
        }
    });
};

exports.owner = function(req, res) {
    res.locals = {
        title: 'Title',
    };
    return res.render('iniciativa/owner',{
        partials: {
            part: 'part',
        }
    });
};

exports.view = function(req, res) {
    res.locals = {
        title: 'Title',
    };
    return res.render('iniciativa/view',{
        partials: {
            part: 'part',
        }
    });
};


