var express = require('express');
var map;
var directionsDisplay;
// var directionsService;
var stepDisplay;
var markerArray = [];
var handleNoGeolocation;
var pos;
var infowindow;
var timeToDest;
var timeToReturn;
var whenToHeadBack;
var transformRouteDuration;
var destination;
var responseBodyFromGoogleParsed;
var routeTotal;
var hours = new Date().getHours();
var minutes = new Date().getMinutes();
var currentHoursMinutes = hours*60+minutes;
// var directionsService = new google.maps.DirectionsService();
var headBack = false;

var dataTransfer = function(timeDestObj){
  timeToReturn = timeDestObj.timeToReturn;
  destination = timeDestObj.destination;
  // console.log('LOGGING FROM MODEL JS timeToReturn:: ', timeToReturn, 'destination:: ', destination);
};

var dataTransferLatLng = function(latlng){
  pos = latlng;
  console.log('POS dataTransferLatLng ' , pos);
  console.log('requestFxn:::::: ',requestFxn());
  // return 'hello from dataTransferLatLng';
  
};

// THIS FUNCTION NEEDS TO RUN EVERY TIME THE USER SENDS A LAT LONG
var requestFxn = function(){
  var request = require ('request');
  request('http://maps.googleapis.com/maps/api/directions/json?origin='+pos+'&destination='+destination+'&mode=walking', function(error, response, body){
      if(error){console.log('ERROR GETTING DIRECTIONS FROM GOOGLE')}
      // console.log('response from google api::: ', response);
      responseBodyFromGoogleParsed = JSON.parse(body);
      // console.log('body from google api', responseBodyFromGoogle.routes[0].legs[0].duration.text);
      // make body info global::
      timeToDest = responseBodyFromGoogleParsed.routes[0].legs[0].duration.text;
      // console.log('timeToDest', timeToDest);
      transformRouteDuration();
  });
};

// var usersTime = $('#timeToReturn').val().split(':');
// var usersHours = parseInt(usersTime[0]);
// var usersMinutes = parseInt(usersTime[1]);
// timeToReturn = parseInt(usersTime[0])*60 + parseInt(usersTime[1]);

// console.log(timeToReturn-currentHoursMinutes);
console.log('currentHoursMinutes from SERVER::: ', currentHoursMinutes);

transformRouteDuration = function(){
  var routeDuration = timeToDest.split(' ').filter(function(elem){
      if(elem !== 'hours' && elem !== 'hour' && elem !== 'mins'){
        return elem;
      }
    });
  if(routeDuration.length===2){
    // mult hours by 60
    var routeHours = parseInt(routeDuration[0])*60;
    var routeMinutes = parseInt(routeDuration[1]);
    routeTotal = routeHours + routeMinutes;
  }
  else{
    // just minutes to work with.
    routeTotal = parseInt(routeDuration[0]);
  }
  console.log('routeTotal from transformRouteDuration:: ', routeTotal);
  whenToHeadBack();
};

whenToHeadBack = function(){
  if(routeTotal >= timeToReturn-currentHoursMinutes){
    headBack = true;
    console.log('Time To Return', headBack);
    return true;
  }
  else{return false}
};


module.exports = {
  requestFxn: requestFxn,
  dataTransfer: dataTransfer,
  dataTransferLatLng: dataTransferLatLng,
  routeTotal: routeTotal
}