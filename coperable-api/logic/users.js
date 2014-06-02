var usuario = require('../models/usuario.js'),
    us = require('underscore');

exports.list = function(req, res, next) {
    usuario.list(
        function(data) {
            res.send(data);
        },
        function(err) {
            res.send(err);
        }
    );
};

exports.listOwners = function(req, res, next) {
    usuario.listOwners(
        function(data) {
            res.send(data);
        },
        function(err) {
            res.send(err);
        }
    );
};



exports.create = function(req, res, next) {
    var body = req.body;
    console.dir(body);
    usuario.alreadyExists(body.username, function(results) {
        usuario.insert(
            body,
            function(data) {
                res.send(data);
            },
            function(err) {
                res.send(err);
            }
        );
     },
     function(message) {
        res.send(message);
    } );

};

exports.authenticate = function(req, res, next) {
    var body = req.body;
    var login_data = {
        password: body.password,
        username: body.username
    };
    console.dir(login_data);
    usuario.findOne({ username: login_data.username}, function(err, user) {
        if (err) {
            console.log('Error: '+err);
            throw err;
        }
        if(user) {
            user.comparePassword(login_data.password, function(err, isMatch) {
                if (err) { 
		    console.log('error de password');
                    throw err;
                }
                res.send(isMatch ? user : {});
            });
        } else {
            res.send({});
        }
    });
};


exports.findById = function(req, res, next) {
    var user_id = req.params.id;
    console.log("Find by Id: "+user_id);
    usuario.Model.findById(user_id, '-password').exec(function (err, user) {
        console.dir(user);
        if(user) {
            res.send(user);
        } else {
            res.send(404, 'usuario_password_erroneo');
        }
    });
};

exports.findByProvider = function(req, res, next) {
    var provider = req.params.provider;
        user_id = req.params.id,
        user_filter = {};
    user_filter[provider+'_id'] = user_id;
    console.dir(user_filter);
    usuario.Model.findOne(user_filter,  '-password').exec(function (err, user) {
        console.dir(user);
        if(user) {
            res.send(user);
        } else {
            res.send({});
        }
    });
};

