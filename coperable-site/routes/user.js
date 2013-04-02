var cop_api = require('../api_client/api'),
    us = require('underscore');

exports.login = function(req, res) {
    res.locals = {
        title: 'Login'
    };
    return res.render('user/login',{
        partials: {
            header: 'wrapper/header',
            menu_site: 'wrapper/menu_site',
            footer: 'wrapper/footer'
        }
    });
};

exports.signup = function(req, res) {
    res.locals = {
        title: 'Registrate'
    };
    return res.render('user/signup',{
        partials: {
            header: 'wrapper/header',
            menu_site: 'wrapper/menu_site',
            footer: 'wrapper/footer'
        }
    });
};

exports.do_signup = function(req, res, done) {
	var user_data = us.extend({}, req.body);
	console.log(user_data);
		
	cop_api.client.put('/api/usuario', user_data, function(err, req, res, obj) {
	    //assert.ifError(err);
            console.log('%d -> %j', res.statusCode, res.headers);
	    console.log('%j', obj);
		done();
	});
};

exports.authenticate = function(username, password, done) {
    var user_data = {
        username: username,
        password: password
    };
	console.log(user_data);
		
	cop_api.client.post('/api/user/authenticate', user_data, function(err, req, res, user) {
	    console.log('%j', user);
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
