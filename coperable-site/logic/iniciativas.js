var config = require('../config'),
    cop_api = require('../api_client/api'),
    us = require('underscore');


function prepare_to_persist(req, done) {
    console.dir(req.body);
    var body = req.body,
        activities = body.activities,
        task = new Array();

    if(activities) {
        us.each(activities.split(/,/), function(tag) {
            task.push({
                tag: tag,
                description: tag
            });
        });
    }

	var iniciativa_data = {};
    us.extend(iniciativa_data, body, {
        owner: {
            user: req.user.id,
            name: req.user.username
        },
        tasks: task
    });

    done(iniciativa_data);

};

exports.create = function(req, res, done) {
    prepare_to_persist(req, function(iniciativa_data) { 
        console.log(iniciativa_data);
        cop_api.client.post('/api/iniciativa', iniciativa_data, function(err, request, response, obj) {
            res.send(obj);
        });
    });
};


exports.save = function(req, res, done) {
    console.log('Guardando iniciativa');
    prepare_to_persist(req, function(iniciativa_data) { 
        console.log(iniciativa_data);
        cop_api.client.put('/api/iniciativa/'+iniciativa_data._id, iniciativa_data, function(err, request, response, obj) {
            console.log('Error? '+err);
            res.send(obj);
        });
    });
};


exports.get = function(req, res) {
    var id = req.params['id'];
	cop_api.client.get('/api/iniciativa/'+id, function(err, req, res, iniciativa) {
		res.send(iniciativa);
	});
};

exports.findById = function(id, done) {
	cop_api.client.get('/api/iniciativa/'+id, function(err, req, res, iniciativa) {
		done(err, iniciativa);
	});
};

exports.findByName = function(name, done) {
	cop_api.client.get('/api/iniciativa/s_name/'+name, function(err, req, res, iniciativas) {
		done(err, iniciativas[0]);
	});
};



exports.list = function(req, res, done) {
	cop_api.client.get('/api/iniciativa', function(err, request, response, iniciativas) {
       done(err, iniciativas);
	});
};

exports.browseByCategory = function(req, res, done) {

    var category= req.query['category'];
    console.log('Buscando por categoria: '+category);
	cop_api.client.get('/api/iniciativa/category/'+category, function(err, request, response, iniciativas) {
       done(err, iniciativas);
	});
};
