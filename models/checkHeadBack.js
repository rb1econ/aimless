var request = require('request');

transformRouteDuration = function(timeToDest){
  // console.log('timeToDest:::::: line 4 of checkHeadBack', timeToDest);
  var routeDuration = timeToDest.split(' ').filter(function(elem){
      if(elem !== 'hours' && elem !== 'hour' && elem !== 'mins' && elem !=='min'){
        return elem;
      }
    });
  if(routeDuration.length===2){
    // mult hours by 60
    var routeHours = parseInt(routeDuration[0])*60;
    var routeMinutes = parseInt(routeDuration[1]);
    var routeTotal = routeHours + routeMinutes;
  }
  else{
    // just minutes to work with.
    var routeTotal = parseInt(routeDuration[0]);
  }
  // console.log('routeTotal from transformRouteDuration:: ', routeTotal);
  return routeTotal;
};

module.exports = function(data, callBackFxn){
  var timeToReturn = parseInt(data.timeToReturn);
  var currentHoursMinutes = parseInt(data.currentHoursMinutes);
  // console.log("data", data);
  request('http://maps.googleapis.com/maps/api/directions/json?origin='+data.pos+'&destination='+data.dst+'&mode=walking', function(error, response, body){
    if(error){console.log('ERROR GETTING DIRECTIONS FROM GOOGLE')}
    // console.log('body of response from google api::: ', body);
    var responseBodyFromGoogleParsed = JSON.parse(body);
    
    var timeToDest = responseBodyFromGoogleParsed.routes[0].legs[0].duration.text;

    var routeTotal = transformRouteDuration(timeToDest);
    // console.log('timeToReturn B4 ', typeof timeToReturn);
    // console.log('currentHoursMinutes B4 IF :', typeof currentHoursMinutes);
    if(timeToReturn<=currentHoursMinutes){
      console.log('timeToReturn B4 +=1,440 is: ', timeToReturn)
      timeToReturn = parseInt(timeToReturn) + 1440;
    }

    var shouldGoBack = routeTotal >= timeToReturn-currentHoursMinutes;

    console.log('routeTotal ', routeTotal, 'timeToReturn', timeToReturn, 'currentHoursMinutes', currentHoursMinutes);
    callBackFxn(null, shouldGoBack);
  });
};