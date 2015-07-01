var http = require('http');
var express = require('express');
var router = express.Router();
var serverData = require('../config').dataServer;

// SESSION ROUTES

/* GET request to /api/sessions to retrieve all sessions. */
router.get('/sessions', function(req, res, next) {
    // create options object for the following request
    var options = {
        host: serverData.url,
        port: serverData.port,
        path: '/api/sessions',
        method: 'GET',
        accept: 'application/json'
    };

    // create and send request
    http.request(options, function(response) {
        // react to the server's response...
        response.on('data', function(data) {
            // ... by passing the responded data as
            // json to the client
            res.json(JSON.parse(data));
        });
    }).end();
});

router.get('/sessions/:id', function(req, res, next) {
    var sessionId = req.params.id;
    // create options object for the following request
    var options = {
        host: serverData.url,
        port: serverData.port,
        path: '/api/sessions/' + sessionId,
        method: 'GET',
        accept: 'application/json'
    };

    // create and send request
    http.request(options, function(response) {
        // react to the server's response...
        response.on('data', function(data) {
            // ... by passing the responded data as
            // json to the client
            res.json(JSON.parse(data));
        });
    }).end();
});

// IMAGE ROUTES

/* GET request to /api/images/:id. */
router.get('/images/:id', function(req, res, next) {
    //
});

module.exports = router;
