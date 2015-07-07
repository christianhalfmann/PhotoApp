/**
 * Controllers for requests to /...
 *
 * @author Andreas Willems
 * @version 06 JUL 2015
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('index.html');
});

module.exports = router;
