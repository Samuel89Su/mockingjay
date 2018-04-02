var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let env = req.app.get('env')
  let title = 'Express on ' + env
  res.render('index', { title: title });
});

module.exports = router;
