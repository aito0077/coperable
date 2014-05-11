var mongoose = require('mongoose/'),
    util = require('util'),
    us = require('underscore'),
    Schema = mongoose.Schema;


var IniciativaSchema = new Schema({
    name:  String,
    slug:  String,
    code:  String,
    goal:  String,
    duration:  String,
    description:   String,
    address:   String,
    profile_picture:   String,
    pariticipants_amount:   String,
    phone:   String,
    email:   String,
    main_category: String,
    categories: {
        medio_ambiente: {type: Boolean, default: false},
        educacion: {type: Boolean, default: false},
        desarrollo: {type: Boolean, default: false},
        arte_cultura: {type: Boolean, default: false},
    },
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
    networks: {
        facebook: {
            text: String
        },
        twitter: {
            text: String
        },
        vimeo: {
            text: String
        },
        youtube: {
            text: String
        },
        flickr: {
            text: String
        }
    },
    creation_date: { type: Date, default: Date.now },
    modification_date: { type: Date, default: Date.now }
});

var Iniciativa = mongoose.model('Iniciativa', IniciativaSchema);

exports.Model = Iniciativa;

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
            latitude: iniciativa.latitude,
            longitude: iniciativa.longitude
        },
        stages: [{
            stage: 'PREPARACION',
            description: 'PREPARACION',
            start_date: new Date(),
        }]
    },
    persist = {};
    us.extend(persist, default_values, iniciativa);
    console.dir(persist);
    persist.main_category = us.first(us.filter(us.keys(persist.categories), function(categ) {
        console.dir(categ);
        return persist.categories[categ];
    }));
    console.dir(persist);
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

