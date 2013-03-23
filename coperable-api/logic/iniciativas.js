var iniciativa = require('../models/iniciativa.js'),
    usuario = require('../models/usuario.js'),
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
    var body = JSON.parse(req.body)
    console.dir(body);
    iniciativa.insert(
        body,
        function(data) {
            res.send(data);
        },
        function(err) {
            res.send(err);
        }
    );
};

