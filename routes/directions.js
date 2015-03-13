var express = require('express');
var router = express.Router();
var model = require('../models/model.js');


router.get('/:pos', function(req, res){
  console.log('REQ PARAMS POS::::',req.params.pos);
  model.dataTransferLatLng(req.params.pos);
  // model.requestFxn();
  res.send('YOOOOOOOO, directions route engaged::');
});

module.exports = router;
