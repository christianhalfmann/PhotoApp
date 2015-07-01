var http = require('http');
var express = require('express');
var router = express.Router();
var serverData = require('../config').dataServer;

// SESSION ROUTES

/* GET request to /api/sessions to retrieve all sessions. */
router.get('/sessions', function(req, res, next) {
    var options = {
        hostname: serverData.url,
        port: serverData.port,
        path: '/api/sessions',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var request = http.request(options, function(res) {
        console.log(res);
        res.json(res);
    }).on('error', function(err) {
        console.log('problem with request: ' + err.message);
    }).end();
});

// IMAGE ROUTES

/* GET request to /api/images/:id. */
router.get('/images/:id', function(req, res, next) {
    //
});

module.exports = router;
