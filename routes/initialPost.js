var express = require('express');
var router = express.Router();
var model = require('../models/model.js');
var request = require('request');

router.post('/', function(req, res){
  console.log('AJAX POST, LOGGING FROM ROUTE: ', req.body);
  model.dataTransfer(req.body);
  // model.modelFxn();
  res.send('sup from DIRECTIONS JS')
});

module.exports = router;