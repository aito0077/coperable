var config = require('../config'),
    cop_api = require('../api_client/api'),
    us = require('underscore'),
    external_files = require('../logic/filehandler');

exports.do_signup = function(req, res, done) {
	var user_data = us.extend({}, req.body);
	console.log(user_data);
		
	cop_api.client.put('/api/usuario', user_data, function(err, req, res, obj) {
        console.log('%d -> %j', res.statusCode, res.headers);
	    console.log('%j', obj);
		done();
	});
};

exports.authenticate = function(email, password, done) {
    var user_data = {
        email: email,
        password: password
    };
	console.log(user_data);
		
	cop_api.client.post('/api/user/authenticate', user_data, function(err, req, res, user) {
	    console.log('%j', user);
		done(err, user);
	});
};

exports.oauthenticate = function(provider, user_id, done) {
	cop_api.client.get('/api/user/oauth/'+provider+'/'+user_id, function(err, req, res, user) {
		done(err, user);
	});
};

exports.findById = function(id, done) {
	cop_api.client.get('/api/user/'+id, function(err, req, res, user) {
	    console.log('%j', user);
		done(err, user);
	});
};

exports.profile= function(user_id, done) {
	cop_api.client.get('/api/user/'+user_id, function(err, req, res, user) {
	    console.log('%j', user);
        console.dir(user); 
		done(err, user);
	});
};

exports.list = function(req, res){

//'http://localhost:8090/save?TYPE=USER' -d '{ "email" : "maxi", "password":"nabo" }'

    var http = require('http');
    var options = {
        hostname: 'localhost',
        port: 8090,
        path: '/save?TYPE=USER',
        method: 'POST'
    };

    var rest_req = http.request(options, function(rest_res) {
        console.log('STATUS: ' + rest_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(rest_res.headers));
        rest_res.setEncoding('utf8');
        rest_res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            res.send('BODY: ' + chunk);
        });
    });

    rest_req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        res.send('problem with request: ' + e.message);
    });

    var data = {
        email: "maxi",
        password: "nabo"
    };
    rest_req.write(JSON.stringify(data));
    rest_req.end();

};
