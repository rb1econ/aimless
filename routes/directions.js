var express = require('express');
var router = express.Router();
var model = require('../models/model.js');


router.get('/:pos', function(req, res){
  console.log('REQ PARAMS POS::::',req.params.pos);
  model.dataTransferLatLng(req.params.pos);
  // console.log('routeTotal:::::::', model.routeTotal);
  // console.log(model.whenToHeadBack());
  // if(model.whenToHeadBack()){return res.send('TIME TO GO TO DESTINATION');}
  // else{res.send('YOOOOOOOO, directions route engaged::', model.headBack);}
  res.send('hey')
});

module.exports = router;
