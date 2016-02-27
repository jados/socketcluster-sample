var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.sendFile(__dirname + '/client.html');
});

router.get('/broken', function(req, res) {
  res.send("aargh");
});

module.exports = router;