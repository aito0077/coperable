var mongoose = require('mongoose/');
var config = require('../config'); // Local congig file to hide creds
db = mongoose.connect(config.creds.mongoose_auth),
Schema = mongoose.Schema;  

var IniciativaSchema = new Schema({
    title:  String,
    description:   String,
    owner: {
        user: ObjectId,
        name: String
    },
    members: [{ 
        user: ObjectId,
        role: String,
        since_date: { type: Date, default: Date.now }
    }],
    tasks: [{
        tag: String,
        description: String
    }],
    public: { type: Date, default: false},
    stages: [{
        stage: String,
        description: String
        start_date: { type: Date, default: Date.now },
        finish_date: { type: Date, default: Date.now }
    }],
    current_stage: String,
    version: Number,
    location: Number,
    creation_date: { type: Date, default: Date.now },
    modification_date: { type: Date, default: Date.now }
});

mongoose.model('Iniciativa', IniciativaSchema); 
var Iniciativa = mongoose.model('Iniciativa'); 


// This function is responsible for returning all entries for the Message model
function getMessages(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  Message.find().limit(20).sort('date', -1).execFind(function (arr,data) {
    res.send(data);
  });
}



function postMessage(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new message model, fill it up and save it to Mongodb
  var message = new Message(); 
  message.message = req.params.message;
  message.date = new Date() 
  message.save(function () {
    res.send(req.body);
  });
}

// Set up our routes and start the server
server.get('/messages', getMessages);
server.post('/messages', postMessage);

server.listen(8080, function() {
  console.log('%s listening at %s, love & peace', server.name, server.url);
});
