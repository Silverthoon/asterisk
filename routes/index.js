var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.logError) {
    res.render('index', { title: 'Login', error: req.session.logError });
  }else{
    res.render('index', { title: 'Login' });
  }
  
});

module.exports = router;
