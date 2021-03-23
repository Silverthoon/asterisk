var express = require('express');
var router = express.Router();
var CallList = require('../public/models/callList');
const paginate = require('express-paginate');
const { Op } = require("sequelize");
const moment = require('moment');

/* GET dashboard page. */
router.get('/dashboard', function (req, res, next) {
  async function loadCalls() {
    var calls = await CallList.findAndCountAll({limit: req.query.limit, offset: req.skip});
    const itemCount = calls.count;
    const pageCount = Math.ceil(calls.count / req.query.limit);
    if (req.session.username){
      res.render('dash/dashboard', {title: 'Dashboard', username : req.session.username, callList: calls.rows,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page) });
    }else{
      res.render('index', { title: 'Log in', notLoggedIn: 'You have to be logged in first.'});
    }
  }
  loadCalls();
});

/* GET dashboard page. */
router.post('/billing', function (req, res, next) {
  async function bill() {
    var to = new Date(req.body.to+" 23:59:59");
    var from = new Date(req.body.from);
    var bills = await CallList.findAll({
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
          [Op.eq] : 8001
        }
      }
    });
    var totalCost = 0;
    var totalDuration = 0;
    bills.forEach((val,index) => {
      totalDuration = totalDuration + bills[index].billsec;
    });
    totalCost = totalDuration * 2;
    res.render('billing', { title : 'Billing', totalCost : totalCost, totalDuration : totalDuration, from : from, to : to, username : req.session.username});
  }
  bill();
});

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