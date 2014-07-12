var mongoose = require('mongoose/'),
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

iniciativas.update_status(function(success, error) {
    console.log(error);
    console.log("FINALIZADO");
    process.exit(code=0);
});
