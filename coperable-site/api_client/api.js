var restify = require('restify');

exports.client = restify.createJsonClient({
    url: 'http://localhost:3001'
});

/*
client.get('/foo/bar', function(err, req, res, obj) {
    //assert.ifError(err);
    console.log('%j', obj);
});

client.post('/foo', { hello: 'world' }, function(err, req, res, obj) {
    //assert.ifError(err);
    console.log('%d -> %j', res.statusCode, res.headers);
    console.log('%j', obj);
});

client.put('/foo', { hello: 'world' }, function(err, req, res, obj) {
    //assert.ifError(err);
    console.log('%d -> %j', res.statusCode, res.headers);
    console.log('%j', obj);
});

client.del('/foo/bar', function(err, req, res) {
    //assert.ifError(err);
    console.log('%d -> %j', res.statusCode, res.headers);
});
*/
