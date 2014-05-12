var config = require('../config'),
    crypto = require( 'crypto' ),
    mime = require( 'mime-magic' ),
    //DropboxClient = require('dropbox-node').DropboxClient,
    us = require('underscore'),
    fs = require('fs'),
    im = require('imagemagick'),
    AWS = require('aws-sdk');

AWS.config.update(config.system.AMAZON);
var s3 = new AWS.S3();

exports.createS3Policy = function(req, res, callback ) {
  var _date, s3Policy;
  _date = new Date();
  s3Policy = {
    "expiration": "" + (_date.getFullYear()) + "-" + (_date.getMonth() + 1) + "-" + (_date.getDate()) + "T" + (_date.getHours() + 1) + ":" + (_date.getMinutes()) + ":" + (_date.getSeconds()) + "Z",
    "conditions": [
      {"bucket": "coperable-storage" },
      ["starts-with", "$Content-Disposition", ""],
      ["starts-with", "$key", ""],
      {"acl": "public-read" },
      {"success_action_redirect": "http://coperable.net/uploadsuccess" },
      ["content-length-range", 0, 2147483648]
    ]
  };

  console.dir(req.body);
  var secret = config.system.AMAZON.secretAccessKey;
  var s3PolicyBase64 = new Buffer( JSON.stringify( s3Policy ) ).toString( 'base64' );
  var s3Signature = crypto.createHmac( "sha1", secret ).update( JSON.stringify( s3Policy ) ).digest( "base64" );

  var s3Credentials = {
    policy64: s3PolicyBase64,
    signature: s3Signature,
    key: req.body.doc.title,
    aws_key: config.system.AMAZON.accessKeyId,
    redirect: 'http://coperable.net/uploadsuccess',
    policy: s3Policy
  };

  res.type('application/json');
  res.send(s3Credentials);
};



/// Post files
exports.upload= function(req, res, callback ) {
    
    console.dir(req.files);
    var fileUploaded = req.files.files[0];
    fs.readFile(fileUploaded.path, function (err, data) {

        var imageName = fileUploaded.name;

        /// If there's an error
        if(!imageName){

            console.log("There was an error");
            res.redirect("/");
            res.end();

        } else {


            var newPath = __dirname + "/../public/uploads/fullsize/" + imageName;
            var thumbPath = __dirname + "/../public/uploads/thumbs/" + imageName;

            fs.writeFile(newPath, data, function (err) {
                im.resize({
                    srcPath: newPath,
                    dstPath: thumbPath,
                    width:   200
                }, function(err, stdout, stderr){
                    if (err) throw err;
                    console.log('resized image to fit within 200x200px');
                });

                var result = {
                    "files": [{
                        "name": imageName,
                        "size": fileUploaded.size,
                        "url": "/static/uploaded/fullsize/"+imageName,
                        "thumbnailUrl": "/static/uploaded/thumbs/"+imageName,
                        "deleteUrl": "/static/uploaded/fullsize/"+imageName,
                        "deleteType": "DELETE"
                    }]};


                res.send(result);

            });
        }
    });
};


