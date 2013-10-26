var mongoose = require('mongoose/'),
    us = require('underscore'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var UsuarioSchema = new Schema({
    username:  String,
    password:   String,
    first_name:   String,
    last_name:   String,
    email:   String,
    location:   String,
    facebook_id:   String,
    twitter_id:   String,
    authenticate_with: String,
    birthdate: Date,
    about: String,
    cantidad_iniciativas:  {type: Number, default: 0},
    iniciativas:    [{
        title: String,
        description: String,
        owner: { type: Boolean, default: false}
    }],
    cantidad_actividades:  {type: Number, default: 0},
    activities: [{
        date: { type: Date, default: Date.now },
        description: { type: Date, default: Date.now },
        refers_to: String
    }],
    verified: { type: Boolean, default: false},
    last_time_access: { type: Date, default: Date.now },
    creation_date: { type: Date, default: Date.now },
    modification_date: { type: Date, default: Date.now },
    networks: {
        facebook: {
            has: {type: Boolean, default: false},
            user_id: String
        },
        twitter: {
            has: {type: Boolean, default: false},
            user_id: String
        },
        vimeo: {
            has: {type: Boolean, default: false},
            user_id: String
        },
        youtube: {
            has: {type: Boolean, default: false},
            user_id: String
        },
        flickr: {
            has: {type: Boolean, default: false},
            user_id: String
        }
    }

});

var limit = 20;

UsuarioSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });


});

UsuarioSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

var Usuario = mongoose.model('Usuario', UsuarioSchema);

exports.Model = Usuario;

exports.list = function(success) {
  Usuario.find().limit(limit).select('username first_name last_name email location iniciativas').execFind(function (arr,data) {
    success(data);
  });
};

exports.listOwners = function(success) {
  Usuario.find().limit(limit).select('username first_name last_name email location iniciativas').execFind(function (arr,data) {
    success(data);
  });
};

exports.get = function(id, success) {
  Usuario.findOne({username: id}).exec(success);
};

exports.alreadyExists = function(id, success, wrong) {
  Usuario.find({username: id}).limit(limit).execFind(function (arr,data) {
    console.dir(data);
    if(typeof data[0] !== 'undefined') {
        console.log('Username already exists');
        wrong({error: 'username_already_exists'});
    } else {
        success(data);
    }
  });
};


exports.findOne = function(query, callback) {
    Usuario.findOne(query, callback);
};

exports.insert = function(usuario, success, error) {
    var usuario_model = new Usuario(usuario);
    usuario_model.save(function(err, data) {
        if(err) {
            error(err);
        } else {
            success(data);
        }
    });
};

exports.update = function(usuario, success, error) {
    Usuario.update({username: usuario.username}, usuario, function(err) {
        if(err) {
           error(err);
        } else {
           success();
        }
    });
};

exports.remove = function(id, success, error) {
    Usuario.remove({username: id}, function(err) {
        if(err) {
            error(err);
        } else {
            success();
        }
    });
};


 
