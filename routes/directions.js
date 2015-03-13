var express = require('express');
var router = express.Router();
var model = require('../models/model.js');


router.get('/:pos', function(req, res){
  console.log('REQ PARAMS POS::::',req.params.pos);
  // call fxn here that is in the model folder and pass it req.params.pos
  
  res.send('YOOOOOOOO');
});

router.post('/initialPost', function(req, res){
  console.log('AJAX POST, LOGGING FROM ROUTE: ', req.body);
  model.dataTransfer(req.body);
  model.modelFXN();
  res.send('sup from DIRECTIONS JS')
});

module.exports = router;
