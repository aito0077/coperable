var mongoose = require('mongoose/'),
    us = require('underscore'),
    Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
    username:  String,
    password:   String,
    first_name:   String,
    last_name:   String,
    email:   String,
    location:   String,
    facebook_id:   String,
    twitter_id:   String,
    authenticate_with: String,
    iniciativas:    [{
        title: String,
        description: String,
        owner: { type: Boolean, default: false}
    }],
    activities: [{
        date: { type: Date, default: Date.now },
        description: { type: Date, default: Date.now },
        refers_to: String
    }],
    verified: { type: Boolean, default: false},
    last_time_access: { type: Date, default: Date.now },
    creation_date: { type: Date, default: Date.now },
    modification_date: { type: Date, default: Date.now }

});

var limit = 20;

var Usuario = mongoose.model('Usuario', UsuarioSchema);

exports.list = function(success) {
  Usuario.find().limit(limit).sort('creation_date', -1).execFind(function (arr,data) {
    success(data);
  });
};

exports.get = function(id, success) {
  Usuario.findOne({username: id}).exec(success);
};

exports.insert = function(usuario, success, error) {
    var usuario_model = new Usuario(usuario);
    usuario_model.save(function(err, data) {
        if(err) {
            error(err);
        } else {
            success(data);
        }
    });
};

exports.update = function(usuario, success, error) {
    Usuario.update({username: usuario.username}, usuario, function(err) {
        if(err) {
           error(err);
        } else {
           success();
        }
    });
};

exports.remove = function(id, success, error) {
    Usuario.remove({username: id}, function(err) {
        if(err) {
            error(err);
        } else {
            success();
        }
    });
};

