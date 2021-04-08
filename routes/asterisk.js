var express = require('express');
var router = express.Router();
var CallList = require('../public/models/callList');
const paginate = require('express-paginate');
const { Op } = require("sequelize");
const moment = require('moment');

/* Calls Management------------------------------------------------------------------------------------------------------------- */
router.get('/dashboard', function (req, res, next) {
  async function loadCalls() {
    var calls = await CallList.findAndCountAll({order: [['accountcode', 'ASC']],},);
    const itemCount = calls.count;
    const pageCount = Math.ceil(calls.count / req.query.limit);
    if (req.session.username){
      res.render('dashboard', {title: 'Dashboard', username : req.session.username, callList: calls.rows,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page) });
    }else{
      res.render('index', { title: 'Log in', notLoggedIn: 'You have to be logged in first.'});
    }
  }
  loadCalls();
});

router.get('/callsReceived', function(req, res, next) {
  if (req.session.username)
    res.render('callsReceived', { title: 'Calls Received'});
  else
    res.render('index', { title: 'Log in', notLoggedIn: 'You have to be logged in first.'});
});

router.get('/outgoingCalls', function(req, res, next) {
  if (req.session.username)
    res.render('outgoingCalls', { title: 'Outgoing Calls'});
  else
    res.render('index', { title: 'Log in', notLoggedIn: 'You have to be logged in first.'});
});

router.get('/callsByUser', function(req, res, next) {
  router.get('/outgoingCalls', function(req, res, next) {
    if (req.session.username)
      res.render('callsByUser', { title: 'Calls by User'});
    else
      res.render('index', { title: 'Log in', notLoggedIn: 'You have to be logged in first.'});
  });
});


/* Users management--------------------------------------------------------------------------------------------------------------- */
router.get('/usersManagement', function(req, res, next) {
  if (req.session.username)
    res.render('usersManagement', { title: 'Users Management' });
  else
    res.render('index', { title: 'Log in', notLoggedIn: 'You have to be logged in first.'});
});


/* Billing--------------------------------------------------------------------------------------------------------------- */
router.get('/billing', function(req, res, next) {
  if (req.session.username)
    res.render('billing', { title: 'Billing' });
  else
    res.render('index', { title: 'Log in', notLoggedIn: 'You have to be logged in first.'});
});

router.post('/billing', function (req, res, next) {
  if(req.body.to != "")
    var to = new Date(req.body.to+" 23:59:59");
  if(req.body.to != "")
    var from = new Date(req.body.from);
  var recepient = req.body.recepient;
  var src = req.body.src;
  if((from) && (to) && (recepient)){
    async function billFromTo() {
      console.log('1');
      var bills = await CallList.findAll({order: [['accountcode', 'ASC']],
        where : {
          start : {
            [Op.gte] : from
          },
          end : {
            [Op.lte] : to
          },
          disposition : {
            [Op.eq] : 'ANSWERED'
          },
          dst : {
            [Op.eq] : recepient
          }
        }
      });
      var totalCost = 0;
      var totalDuration = 0;
      bills.forEach((val,index) => {
        totalDuration = totalDuration + bills[index].billsec;
      });
      totalCost = totalDuration * 2;
      res.render('bills', { title : 'Bills', totalCost : totalCost, totalDuration : totalDuration, from : from, to : to, dst : recepient, username : req.session.username});
    }
    billFromTo();
  }else if((recepient) && (src)){
      async function billReceipSrc() {
        console.log('2');
        var bills = await CallList.findAll({order: [['accountcode', 'ASC']],
          where : {
            src : {
              [Op.eq] : src
            },
            dst : {
              [Op.eq] : recepient
            }
          }
        });
        var totalCost = 0;
        var totalDuration = 0;
        bills.forEach((val,index) => {
          totalDuration = totalDuration + bills[index].billsec;
        });
        totalCost = totalDuration * 2;
        res.render('bills', { title : 'Bills', totalCost : totalCost, totalDuration : totalDuration, src : src, recepient : recepient, username : req.session.username});
      }
      billReceipSrc();
  }else if(recepient){
    async function billReceip() {
      console.log('3');
      var bills = await CallList.findAll({order: [['accountcode', 'ASC']],
        where : {
          dst : {
            [Op.eq] : recepient
          }
        }
      });
      var totalCost = 0;
      var totalDuration = 0;
      bills.forEach((val,index) => {
        totalDuration = totalDuration + bills[index].billsec;
      });
      totalCost = totalDuration * 2;
      res.render('bills', { title : 'Bills', totalCost : totalCost, totalDuration : totalDuration, recepient : recepient, username : req.session.username});
    }
    billReceip();
  }/*else if(src){
    async function billSrc() {
      console.log('4');
      var bills = await CallList.findAll({order: [['accountcode', 'ASC']],
        where : {
          src : {
            [Op.eq] : src
          }
        }
      });
      var totalCost = 0;
      var totalDuration = 0;
      bills.forEach((val,index) => {
        totalDuration = totalDuration + bills[index].billsec;
      });
      totalCost = totalDuration * 2;
      res.render('bills', { title : 'Bills', totalCost : totalCost, totalDuration : totalDuration, src : src, username : req.session.username});
    }
    billSrc();
  }*/
});


/* Bills---------------------------------------------------------------------------------------------------------------- */

router.get('/bills', function(req, res, next) {
  if (req.session.username)
    res.render('bills', { title: 'Bills' });
  else
    res.render('index', { title: 'Log in', notLoggedIn: 'You have to be logged in first.'});
});

/* Contact us------------------------------------------------------------------------------------------------------------- */

router.get('/contact', function(req, res, next) {
  if (req.session.username)
    res.render('contact', { title: 'Contact' });
  else
    res.render('index', { title: 'Log in', notLoggedIn: 'You have to be logged in first.'});
});

/* Settings------------------------------------------------------------------------------------------------------------- */

router.get('/settings', function(req, res, next) {
  if (req.session.username)
    res.render('settings', { title: 'Settings' });
  else
    res.render('index', { title: 'Log in', notLoggedIn: 'You have to be logged in first.'});
});

/* Logout--------------------------------------------------------------------------------------------------------------- */
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;