var express = require('express');
var router = express.Router();
var model = require('../models/model.js');

router.get('/:pos', function(req, res){
  console.log('ALL CAPS REQ PARAMS POS::::',req.params.pos);
  // call fxn here that is in the model folder and pass it req.params.pos
  
  res.send('YOOOOOOOO');
});

router.post('/', function(req, res){
  console.log('AJAX POST: ', req.body);
});

module.exports = router;
