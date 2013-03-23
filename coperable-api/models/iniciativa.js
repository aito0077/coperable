var mongoose = require('mongoose/'),
    util = require('util'),
    us = require('underscore'),
    Schema = mongoose.Schema;  


var IniciativaSchema = new Schema({
    title:  String,
    code:  String,
    description:   String,
    owner: {
        user: String,
        name: String
    },
    members: [{ 
        user: String,
        role: String,
        since_date: { type: Date, default: Date.now }
    }],
    tasks: [{
        tag: String,
        description: String
    }],
    public: { type: Boolean, default: false},
    stages: [{
        stage: String,
        description: String,
        start_date: { type: Date, default: Date.now },
        finish_date: { type: Date, default: Date.now }
    }],
    current_stage: String,
    version: Number,
    location: {
        latitude: {type: Number, default: 0},
        longitude: {type: Number, default: 0}
    },
    creation_date: { type: Date, default: Date.now },
    modification_date: { type: Date, default: Date.now }
});

var Iniciativa = mongoose.model('Iniciativa', IniciativaSchema);
var limit = 20;

exports.list = function(success) {
  Iniciativa.find().limit(limit).execFind(function (arr,data) {
    success(data);
  });
};

exports.get = function(id, success) {
  Iniciativa.findOne({code: id}).exec(success);
};

exports.insert = function(iniciativa, success, error) {
    var default_values = {
        creation_date: new Date(),
        modification_date: new Date(),
        current_stage: 'PREPARACION',
        location: {
            latitud: 0,
            longitud: 0
        },
        stages: [{
            stage: 'PREPARACION',
            description: 'PREPARACION',
            start_date: new Date(),
        }]
    },
    persist = {};
    us.extend(persist, default_values, iniciativa);
    var iniciativa_model = new Iniciativa(persist);
    iniciativa_model.save(function(err, data) {
        if(err) {
            error(err);
        } else {
            success(data);
        }
    });
};

exports.update = function(iniciativa, success, error) {
    Iniciativa.update({code: iniciativa.code}, iniciativa, function(err) {
        if(err) {
           error(err); 
        } else {
           success(); 
        }  
    });
};

exports.remove = function(id, success, error) {

    Iniciativa.remove({code: id}, function(err) {
        if(err) {
            error(err);
        } else {
            success();
        }
    });
};

