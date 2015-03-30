var express = require('express');
var router = express.Router();
var model = require('../models/model.js');
var Account = require('../models/account');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Aimless...', model: model });
});

// router.get('/direction/:pos', function(req, res){
//   console.log('ALL CAPS REQ PARAMS POS::::',req.params.pos);
// });

module.exports = router;
