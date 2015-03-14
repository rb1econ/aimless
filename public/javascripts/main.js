var map;
var directionsDisplay;
var directionsService;
var stepDisplay;
var markerArray = [];
var handleNoGeolocation;
var pos;
var infowindow;
var specifiedOrDefaultDestination;
var timeToDest;
var timeToReturn;
var whenToHeadBack;
var tranformRouteDuration;
var refreshIntervalId;

// THIS FUNCTION NEEDS TO RUN EVERY 60 SECONDS. - change setInterval to 60,000ms
var everyMinute = function(){

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = '('+position.coords.latitude+', '+ position.coords.longitude+')';

    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

  $.post('/directions', timeDestObj, function(dataFromServer){
    console.log('client Data: ', dataFromServer);
  });

  // callEveryMinute();
};
var callEveryMinute = function(){
  refreshIntervalId = setInterval(everyMinute, 3000);
  console.log('interval ID', refreshIntervalId);
};

// when it's time to head back, call this function to stop poling the maps api.
// clearInterval(refreshIntervalId);

$('#newDest').change(function(){
  $('#theirNewDest').toggle();
  // console.log('change happened on checkbox');
  // console.log(timeToReturn);
});

$('#iAmWalking').on('click', function(e){
  e.preventDefault();

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      specifiedOrDefaultDestination = '('+position.coords.latitude+', '+ position.coords.longitude+')';
      pos = '('+position.coords.latitude+', '+ position.coords.longitude+')';

    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

  // reassign specifiedOrDefaultDestination if box is checked.
  if($('#newDest:checked').val()){specifiedOrDefaultDestination = $('#theirNewDest').val()}

  var usersTime = $('#timeToReturn').val().split(':');
  var usersHours = parseInt(usersTime[0]);
  var usersMinutes = parseInt(usersTime[1]);
  timeToReturn = parseInt(usersTime[0])*60 + parseInt(usersTime[1]);


  timeDestObj = {
    pos: pos,
    timeToReturn: timeToReturn,
    dst: specifiedOrDefaultDestination
  }
  
  // TRIAL: SEND POST REQUEST WITH TIME AND DESTINATION
  $.post('/initialPost', timeDestObj, function(dataFromServer){
    console.log('dataFromServer POST AJAX: ', dataFromServer);
  });
  
  callEveryMinute();
  
});