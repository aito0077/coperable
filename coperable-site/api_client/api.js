var restify = require('restify'),
  config = require('../config');

exports.client = restify.createJsonClient({
  url: config.system.API_URL
});

