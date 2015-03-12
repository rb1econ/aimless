var express = require('express');
var router = express.Router();
var model = require('../models/model.js');

router.get('/:pos', function(req, res){
  console.log('ALL CAPS REQ PARAMS POS::::',req.params.pos);
  res.send('YOOOOOOOO')
});

module.exports = router;
