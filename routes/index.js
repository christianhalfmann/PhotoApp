var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('index.html');
});

/* GET start page. */
router.get('/start', function(req, res, next) {
    res.sendFile('./start.html', {
        root: 'public'
    });
});

module.exports = router;
