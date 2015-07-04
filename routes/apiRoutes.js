var http = require('http');
var express = require('express');
var router = express.Router();
//var serverData = require('../config').dataServer;
var serverData = require('../config').lyraServer;

// SESSION ROUTES

router.get('/sessions/:id', function getSessionById(req, res) {
    reactToRequest(req, res);
});

// IMAGE ROUTES

router.get('/thumbnails/:id', function getThumnailById(req, res) {
    reactToRequest(req, res);
});

/* GET request to /api/images/:id. */
router.get('/images/:id', function getImageById(req, res) {
    reactToRequest(req, res);
});

var reactToRequest = function(req, res) {
    var id = req.params.id;
    var path = req.url.split('/')[1];
    var acceptType = (path == 'sessions') ? 'application/json' : 'image/*';
    var options = {
        host: serverData.host,
        port: serverData.port,
        path: '/api/'+ path + '/' + id,
        method: 'GET',
        accept: acceptType
    };

    http.request(options, function(response) {
        // check response for error
        if (response.statusCode == '404') {
            return res.status(404).send();
        }

        var contentType = response.headers['content-type'];
        var resData = '';

        if (path != 'sessions') {
            // pipe incoming response to outgoing response object
            response.pipe(res);
        }

        // react to the server's response...
        response.on('data', function(data) {
            // ... by passing writing data to the tmpImage variable
            resData += data;
        });

        response.on('end', function() {
            res.set('Content-Type', contentType);
            if (path == 'sessions') {
                res.json(JSON.parse(resData));
            } else {
                res.end(resData, 'binary');
            }
        });
    }).end();
};

module.exports = router;
