var Q = require('q');
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
var userDataObj;
var loadTheMap;
var start;
var stopVibration;



var makeVibrate = function(){
  // navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
  // console.log('navigator.vibrate', !!navigator.vibrate);
  // if (navigator.vibrate) {
  //   // console.log('vibrate if entered, navigator.vibrate= ', navigator.vibrate);
  //   var actualVibration = function(){
  //     navigator.vibrate(1000)
  //   }
  //   stopVibration = setInterval(actualVibration, 1500);
  // }
  // else{
    // var visualVibration = function(){
    //   // $('#panel').prepend('<button class="btn btn-danger">Vibration Simulation ;)</button>')
    //   alert('Yo, it\'s time to head back!!');
    // };
    // stopVibration = setInterval(visualVibration, 2000);
  // }
  $('#myModal').modal();
  // setTimeout($('#myModal').css({
  //   "-webkit-animation-name": "spaceboots",
  //   "-webkit-animation-duration": "0.8s",
  //   "-webkit-transform-origin":"50% 50%",
  //   "-webkit-animation-iteration-count": "infinite",
  //   "-webkit-animation-timing-function": "linear"
  // }), 5000);
  $('#panel').on('click', '#iAmReturning', function(){
    clearInterval(stopVibration);
    $('#iAmWalking').removeAttr("style");
    $('#iAmReturning').css("display", "none");
    console.log('iAmReturning btn worked!!');
    // vibrating = false;
  });
};

// THIS FUNCTION NEEDS TO RUN EVERY 60 SECONDS. - change setInterval to 60,000ms
var everyMinute = function(){
  var geoFxn = function(){
    console.log('The geoFxn ran.')
    var deferred = Q.defer();
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = '('+position.coords.latitude+', '+ position.coords.longitude+')';
        deferred.resolve();
      }, function() {
        handleNoGeolocation(true);
      });
    } else {
      pos = 'denver, co';
      deferred.reject();
      alert('Please allow the browser to get your location, thanks');

      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }
    return deferred.promise;
  };
  

  var nextToRun = function(){
    console.log('The nextToRun ran.')
    var deferred = Q.defer();
    // console.log('pos', pos);
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var currentHoursMinutes = hours*60+minutes;

    userDataObj = {
      pos: pos,
      timeToReturn: timeToReturn,
      dst: specifiedOrDefaultDestination,
      currentHoursMinutes: currentHoursMinutes
    }

    $.post('/directions', userDataObj, function(dataFromServer){
      console.log('dataFromServer', dataFromServer);
      if(dataFromServer){
        // make phone vibrate here:::::
        initialize();
        makeVibrate();
        clearInterval(refreshIntervalId);
        $('#panel').prepend('<button class="btn btn-primary" id="iAmReturning"> (: I am returning :)</button>');

        console.log('Time to Return!!!!!!', dataFromServer);
      }
      else{console.log('dataFromServer',dataFromServer);}
    });
    return deferred.promise;
  };

  var erring = function(){
    console.log('erroh');
  };

  var promise = geoFxn();
  promise.then(nextToRun, erring);
};

var callEveryMinute = function(){
  refreshIntervalId = setInterval(everyMinute, 3000);
  // console.log('interval ID', refreshIntervalId);
};

// when it's time to head back, call this function to stop poling the maps api.
// clearInterval(refreshIntervalId);
// $('#panel').on('click', '#newDestBtn', function(){
//   $('#newDest').prop("checked", "checked");
// });

$('#newDest').change(function(){
  $('#theirNewDest').toggle();
  // console.log('change happened on checkbox');
  // console.log(timeToReturn);
});

$('#iAmWalking').on('click', function(e){
  e.preventDefault();
  $(this).css("display", "none");

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      if($('#newDest:checked').val()){specifiedOrDefaultDestination = $('#theirNewDest').val()
      }
      else{specifiedOrDefaultDestination = '('+position.coords.latitude+', '+ position.coords.longitude+')';
      }
      pos = '('+position.coords.latitude+', '+ position.coords.longitude+')';

    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

  // reassign specifiedOrDefaultDestination if box is checked.

  var usersTime = $('#timeToReturn').val().split(':');
  var usersHours = parseInt(usersTime[0]);
  var usersMinutes = parseInt(usersTime[1]);
  timeToReturn = parseInt(usersTime[0])*60 + parseInt(usersTime[1]);


  userDataObj = {
    pos: "pos",
    timeToReturn: timeToReturn,
    dst: specifiedOrDefaultDestination
  }
  
  // TRIAL: SEND POST REQUEST WITH TIME AND DESTINATION
  $.post('/initialPost', userDataObj, function(dataFromServer){
    console.log('dataFromServer POST AJAX: ', dataFromServer);
  });
  
  callEveryMinute();
 
});


// Everything below is google maps stuff::::::::::::::::::::::::::::::::::::::
function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService();
  var mapOptions = {
    zoom: 10,
    center: start
  }

  // Create a renderer for directions and bind it to the map.
  var rendererOptions = {
    map: map,
    // InfoWindow: infowindow,
    // panel: '#directions'
    // draggable: true
  }
  directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

  // Instantiate an info window to hold step text.
  stepDisplay = new google.maps.InfoWindow();
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));
  calcRoute();
}

function calcRoute() {

  // First, remove any existing markers from the map.
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }

  // Now, clear the array itself.
  markerArray = [];

  // Retrieve the start and end locations and create
  // a DirectionsRequest using WALKING directions.
  // var start = document.getElementById('start').value;
  start = pos;
  var end = specifiedOrDefaultDestination;
  var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.WALKING
  };

  // Route the directions and pass the response to a
  // function to create markers for each step.
  directionsService.route(request, function(response, status) {
    // console.log(response.routes[0].legs[0].duration.text);
    if (status == google.maps.DirectionsStatus.OK) {
      // var warnings = document.getElementById('warnings_panel');
      // warnings.innerHTML = '<b>' + response.routes[0].warnings + '</b>';
      // call whenToHeadBack after calcRoute has finished so that timeToDest variable is defined::
      // console.log(timeToDest);
      directionsDisplay.setDirections(response);
      showSteps(response);
    }
  });
}

function showSteps(directionResult) {
  // For each step, place a marker, and add the text to the marker's
  // info window. Also attach the marker to an array so we
  // can keep track of it and remove it when calculating new
  // routes.
  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++) {
    var marker = new google.maps.Marker({
      position: myRoute.steps[i].start_location,
      map: map
    });
    attachInstructionText(marker, myRoute.steps[i].instructions);
    markerArray[i] = marker;
  }
}

function attachInstructionText(marker, text) {
  google.maps.event.addListener(marker, 'click', function() {
    // Open an info window when the marker is clicked on,
    // containing the text of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}

