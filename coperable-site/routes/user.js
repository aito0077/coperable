
/*
 * GET users listing.
 */

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
