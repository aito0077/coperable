var mongoose = require('mongoose/'),
    restify = require('restify'),
    config = require('./config'),
    iniciativas = require('./logic/iniciativas.js'),
    usuarios = require('./logic/users.js');

if( process.env.VCAP_SERVICES ){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
} else {
    var mongo = {
        "hostname":"127.0.0.1",
        "port":27017,
        "username":"",
        "password":"",
        "name":"",
        "db":"test"
    };
}

var generate_mongo_url = function(obj) {
    obj.hostname = (obj.hostname || '127.0.0.1');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');

    if(obj.username && obj.password) {
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    } else {
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}

var mongourl = generate_mongo_url(mongo);

mongoose.connect(mongourl);

var server = restify.createServer({
    name: 'Coperable API'
});
server.use(restify.bodyParser({ mapParams: false }));


server.use(restify.CORS());
server.use(restify.fullResponse());

server.get('/api/iniciativa', iniciativas.list);
server.get('/api/iniciativa/user/:user_id', iniciativas.browseByUser);
server.get('/api/iniciativa/category/:category', iniciativas.browseByCategory);
server.get('/api/iniciativa/s_name/:name', iniciativas.findByName);
server.get('/api/iniciativa/:id', iniciativas.findById);
server.post('/api/iniciativa', iniciativas.create);
server.put('/api/iniciativa/:id', iniciativas.save);
server.post('/api/iniciativa/:id/:userId', iniciativas.participate);

server.get('/api/organizadores', usuarios.listOwners);
server.get('/api/participantes', usuarios.list);

server.post('/api/user/authenticate', usuarios.authenticate);
server.get('/api/user/:id', usuarios.findById);
server.get('/api/user/oauth/:provider/:id', usuarios.findByProvider);

server.put('/api/usuario', usuarios.create);

server.listen(config.server.port, config.server.host, function() {
      console.log('%s listening at %s', server.name, server.url);
});
