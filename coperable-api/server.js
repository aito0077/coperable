var mongoose = require('mongoose/'),
    restify = require('restify'),
    config = require('./config'),
    iniciativas = require('./logic/iniciativas.js'),
    usuarios = require('./logic/users.js');


mongoose.connect(config.server.mongoose_auth);


function list(req, res, next) {
      res.send('list' + req.params.entity);
}

function fetch(req, res, next) {
      res.send('fetch: ' + req.params.entity +' - id: '+req.params.id);
}

function update(req, res, next) {
      res.send('update: ' + req.params.entity +' - id: '+req.params.id);
}

function remove(req, res, next) {
      res.send('remove: ' + req.params.entity +' - id: '+req.params.id);
}

function respond(req, res, next) {
      res.send('hello ' + req.params.entity);
}

var server = restify.createServer({
    name: 'Coperable API'
});
server.use(restify.bodyParser({ mapParams: false }));



server.get('/api/iniciativa', iniciativas.list);
server.get('/api/iniciativa/:id', fetch);
server.put('/api/iniciativa', iniciativas.create);
server.put('/api/iniciativa/:id', update);
server.del('/api/iniciativa/:id', remove);

server.post('/api/user/authenticate', usuarios.authenticate);
server.put('/api/usuario', usuarios.create);



server.listen(config.server.port, function() {
      console.log('%s listening at %s', server.name, server.url);
});
