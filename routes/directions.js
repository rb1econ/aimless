var express = require('express');
var router = express.Router();
var model = require('../models/model.js');
var checkHeadBack = require('../models/checkHeadBack.js');


router.post('/', function(req, res){
  console.log('DIRECTIONS ROUTE AJAX DATAfromClient', req.body)
  checkHeadBack(req.body, function(err, headBack){
    if(err){res.send('sorry there was an error');}
    else{res.send(headBack);}
  });
});

module.exports = router;
