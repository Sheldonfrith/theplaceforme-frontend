var express = require('express');
var router = express.Router();

/* test restricted access. */
router.get('/', function(req, res, next) {
  console.log('get request to /restricted');
  res.type('text');
  res.send('SUCCESSFULLY ACCESSED RESTRICTED CONTENT');
});

module.exports = router;
