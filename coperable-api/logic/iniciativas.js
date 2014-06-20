var Iniciativa = require('../models/iniciativa.js'),
    usuario = require('../models/usuario.js'),
    us = require('underscore');

exports.list = function(req, res, next) {
    Iniciativa.list(
        function(data) {
            res.send(data);
        },
        function(err) {
            res.send(err);
        }
    );
};

exports.browseByUser = function(req, res, next) {
    var user_id = req.params.user_id; 

    console.log('Buscando por usuario: '+user_id);
    Iniciativa.Model.find('{owner.user:user_id}').exec(
        function (err, iniciativas) {
            if (err) return handleError(err);
            res.send(iniciativas);
        }
    );

};

exports.browseByCategory = function(req, res, next) {
    var category = req.params.category; 

    console.log('Buscando por categoria: '+category);
    Iniciativa.Model.find().where('categories.'+category).where('profile_picture').exists(true).equals(true).exec(
        function (err, iniciativas) {
            if (err) return handleError(err);
            res.send(iniciativas);
        }
    );

};

exports.create = function(req, res, next) {
    var body = req.body;
    Iniciativa.insert(
        body,
        function(data) {
            usuario.Model.findById(body.owner.user).exec(function (err, user) {
                if(user) {
                    user.update({ 
                            $inc: {
                                'cantidad_iniciativas':1
                            },
                            $push: {
                                'iniciativas': {
                                    id: data._id,
                                    title: body.title,
                                    description: body.description,
                                    picture: body.profile_picture,
                                    owner: true
                                }
                            }   
                        },
                        function() {
                            res.send(data);
                        } 
                    );
                }
            });

        },
        function(err) {
            res.send({error: err});
        }
    );
};


exports.save = function(req, res, next) {
    console.log('Guardando iniciativa');
    var iniciativa_id = req.params.id;
    var body = req.body;
    Iniciativa.Model.findById(iniciativa_id, function (err, iniciativa) {
        if (err) return handleError(err);
        us.extend(iniciativa, body);
        iniciativa.save(function (err) {
        if (err) return handleError(err);
            res.send(iniciativa);
        });
    });
}

exports.participate = function(req, res, next) {
    var body = req.body;
    Iniciativa.participate(
        body,
        function(data) {
            usuario.Model.findById(body.owner.user).exec(function (err, user) {
                user.update({ 
                        $inc: {
                            'cantidad_iniciativas':1
                        },
                        $push: {
                            'iniciativas': {
                                id: data._id,
                                title: body.title,
                                description: body.description,
                                owner: true
                            }
                        }   
                    },
                    function() {
                        res.send(data);
                    } 
                );
            });

        },
        function(err) {
            res.send({error: err});
        }
    );
};

/*
exports.participate = function(req, res, next) {
    console.log('Guardando iniciativa');
    var iniciativa_id = req.params.id;
    var user_id = req.params.userId;
    var body = req.body;
    var user = 
    Iniciativa.Model.findById(iniciativa_id, function (err, iniciativa) {
        if (err) return handleError(err);
        us.extend(iniciativa, body);
        iniciativa.save(function (err) {
        if (err) return handleError(err);
            res.send(iniciativa);
        });
    });
}
*/

exports.findById = function(req, res, next) {
    var iniciativa_id = req.params.id;
    console.log('Iniciativa id: '+iniciativa_id);
    Iniciativa.Model.findById(iniciativa_id).exec(function(err, result) {
        console.dir(result);
        console.log(err);
        if(result) {
            res.send(result);
        } else {
            res.send(404, {});
        }
    });
};

exports.findByName = function(req, res, next) {
    var slug = req.params.name;
    console.log('Iniciativa Slug: '+slug);
    Iniciativa.Model.find({'slug':slug}).limit(1).exec(function(err, result) {
        console.dir(result);
        console.log(err);
        if(result) {
            res.send(result);
        } else {
            res.send(404, {});
        }
    });
};


exports.findLast = function(req, res, next) {
    console.dir(req.params);
    var lat = req.params.lat,
        lng = req.params.lng;
        console.log('lat: '+lat);
        console.log('long: '+lng);

    Iniciativa.Model.find({ end_date: { $gt: new Date()}, coords: { $near : [lng, lat], $maxDistance : 500/111.2}}).where('profile_picture').exists(true).sort('-start_date').exec(function(err, result) {
        console.dir(result);
        if(result) {
            res.send(result);
        } else {
            res.send(404, {});
        }
    });
};
