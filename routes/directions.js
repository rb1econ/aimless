var express = require('express');
var router = express.Router();
var model = require('../models/model.js');
var checkHeadBack = require('../models/checkHeadBack.js');


router.post('/', function(req, res){
  // console.log('DIRECTIONS ROUTE AJAX DATAfromClient', req.body)
  checkHeadBack(req.body, function(err, headBack){
    if(err){res.send('sorry there was an error');}
    else{res.send(headBack);}
  });
  // console.log('REQ PARAMS POS::::',req.params.pos);
  // model.dataTransferLatLng(req.params.pos);
  // var functionThatLogs = function(){
  //   console.log('model.headBack::::::::::: ', model.headBack());
  // };
  // var timeOutId = setTimeout(functionThatLogs, 3000);
  // console.log(model);
  // // console.log('routeTotal:::::::', model.routeTotal);
  // // console.log('model.headBack::::::::::: ', model.headBack);
  // // if(model.headBack){return res.send('TIME TO GO TO DESTINATION');}
  // // else{res.send('YOOOOOOOO, directions route engaged::'}
  // res.send('hey');
});

module.exports = router;
