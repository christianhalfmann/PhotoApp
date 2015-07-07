/**
 * Controllers for requests to /api/...
 *
 * @author Andreas Willems
 * @version 07 JUL 2015
 */

var http = require('http');
var express = require('express');
var router = express.Router();
var serverData = require('../config').dataServer;
//var serverData = require('../config').lyraServer;

// SESSION ROUTES
/* GET request to /api/sessions/:id */
router.get('/sessions/:id', function getSessionById(req, res) {
    reactToRequest(req, res);
});

// IMAGE ROUTES
/* GET request to /api/thumbnails/:id */
router.get('/thumbnails/:id', function getThumnailById(req, res) {
    reactToRequest(req, res);
});

/* GET request to /api/images/:id. */
router.get('/images/:id', function getImageById(req, res) {
    reactToRequest(req, res);
});

/**
 * Handles requests to the web server by sending HTTP requests to
 * the data server and processing the subsequent HTTP responses.
 *
 * @param req - the request that was directed at the web server
 * @param res - the web server's response object
 */
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
        handleResponse(response, path, res);
    }).end();
};

/**
 * Processes the responses from the data server and the web server.
 *
 * @param dataResponse - the response object from the data server
 * @param path - the path the client chose, i.e. 'sessions', 'images'
 * @param webResponse - the web server's response object
 */
var handleResponse = function(dataResponse, path, webResponse) {
    // check response for error
    if (dataResponse.statusCode == '404') {
        return webResponse.status(404).send();
    } else {
        var contentType = dataResponse.headers['content-type'];
        webResponse.setHeader('Content-Type', contentType);
    }

    if (path != 'sessions') {
        // pipe incoming response to outgoing response object,
        // for both are streams
        dataResponse.pipe(webResponse);
    }

    // variable to store data servers response into
    var resData = '';

    // react to the server's response...
    dataResponse.on('data', function(data) {
        // ... by passing writing data to the tmpImage variable
        resData += data;
    });

    dataResponse.on('end', function() {
        if (path == 'sessions') {
            webResponse.json(JSON.parse(resData));
        } else {
            webResponse.end(resData, 'binary');
        }
    });
};

module.exports = router;
