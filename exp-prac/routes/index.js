var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let env = req.app.get('env')
  let title = 'Express on ' + env
  let cdn = env === 'development' ? 'http://ewt360.com' : 'http://233.mistong.com'
  res.render('index', { title: title, cdnHost: cdn });
});

module.exports = router;
