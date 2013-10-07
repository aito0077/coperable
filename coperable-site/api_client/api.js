var restify = require('restify'),
    config = require('../config-dev');

exports.client = restify.createJsonClient({
    url: config.system.API_URL
});

