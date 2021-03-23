var express = require('express');
var router = express.Router();
var User = require('../public/models/user');
var md5 = require('md5');


/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login', {title : 'Login'});
});


/* Login user */
router.post('/connect', function (req, res, next) {
  async function login() {
    var admin = await User.findOne({ where: { username: 'admin' } });
    if (req.body.username == admin.username && md5(req.body.password) == admin.password) {
      req.session.username = admin.username;
      res.redirect('/asterisk/dashboard');
    } else {
      req.session.logError ='Wrong user name or password.';
      res.render('index', {title: 'Login', error : req.session.logError});
    }
  }
  login();
});

module.exports = router;
