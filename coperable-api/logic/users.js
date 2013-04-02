var usuario = require('../models/usuario.js'),
    us = require('underscore');

exports.list = function(req, res, next) {
    iniciativa.list(
        function(data) {
            res.send(data);
        },
        function(err) {
            res.send(err);
        }
    );
};

exports.create = function(req, res, next) {
    console.dir(req.body);
    var body = req.body;
    console.dir(body);
    usuario.insert(
        body,
        function(data) {
            res.send(data);
        },
        function(err) {
            res.send(err);
        }
    );
};

exports.authenticate = function(req, res, next) {
    var body = req.body;
    var login_data = {
        username: body.username,
        password: body.password
    };
    console.dir(login_data);
    usuario.findOne({ username: login_data.username }, function(err, user) {
        if (err) {
            console.log('Error: '+err);
            throw err;
        }
        user.comparePassword(login_data.password, function(err, isMatch) {
            if (err) { 
                throw err;
            }
            console.log('Authenticated: '+ login_data.username);
            console.dir(user);
            res.send(user);
        });
    });

};

