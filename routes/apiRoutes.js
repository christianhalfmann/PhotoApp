var http = require('http');
var express = require('express');
var router = express.Router();
var serverData = require('../config').dataServer;

// SESSION ROUTES

/* GET request to /api/sessions to retrieve all sessions. */
router.get('/sessions', function getSessions(req, res, next) {
    // create options object for the following request
    var options = {
        host: serverData.host,
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

router.get('/sessions/:id', function getSessionById(req, res, next) {
    var sessionId = req.params.id;
    // create options object for the following request
    var options = {
        host: serverData.host,
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

router.get('/thumbnails/:id', function(req, res, next) {
    var thumbId = req.params.id;
    // create options object for the following request
    var options = {
        host: serverData.host,
        port: serverData.port,
        path: '/api/thumbnails/' + thumbId,
        method: 'GET',
        accept: 'image/*'
    };

    // create and send request
    http.request(options, function(response) {
        //console.log(response.headers);
        var contentLength = parseInt(response.headers['content-length']);
        var contentType = response.headers['content-type'];
        var tmpData = '';
        response.pipe(res);

        // react to the server's response...
        response.on('data', function(data) {
            // ... by passing writing data to the tmpImage variable
            tmpData += data;
        });

        response.on('end', function() {
            res.set('Content-Type', contentType);
            res.end(tmpData, 'binary');
        })
    }).end();
});

/* GET request to /api/images/:id. */
router.get('/images/:id', function(req, res, next) {
    var thumbId = req.params.id;
    // create options object for the following request
    var options = {
        host: serverData.host,
        port: serverData.port,
        path: '/api/images/' + thumbId,
        method: 'GET',
        accept: 'image/*'
    };

    // create and send request
    http.request(options, function(response) {
        console.log(response.headers);
        var contentLength = parseInt(response.headers['content-length']);
        var contentType = response.headers['content-type'];
        var tmpImage = new Buffer(contentLength);
        // react to the server's response...
        response.on('data', function(data) {
            // ... by writing the responded data to the buffer
            tmpImage.write(data);
        });

        response.on('end', function() {
            res.set('Content-Type', contentType);
            res.send(tmpImage);
        })
    }).end();
});

module.exports = router;
