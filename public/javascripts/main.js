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

function initialize() {
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService();
  
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Here is where we will take you back to. Accuracy = '+position.coords.accuracy+'m'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

  var mapOptions = {
    zoom: 13,
    center: pos
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

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
    timeToDest = response.routes[0].legs[0].duration.text;
    if (status == google.maps.DirectionsStatus.OK) {
      // var warnings = document.getElementById('warnings_panel');
      // warnings.innerHTML = '<b>' + response.routes[0].warnings + '</b>';
      // call whenToHeadBack after calcRoute has finished so that timeToDest variable is defined::
      // console.log(timeToDest);
      tranformRouteDuration();
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

google.maps.event.addDomListener(window, 'load', initialize);

// this function does the magic of seeing if you should head back
// adding button, input text, and check box SHTUFF:::::::::::

$('#newDest').change(function(){
  $('#theirNewDest').toggle();
  // console.log('change happened on checkbox');
  // console.log(timeToReturn);
});

$('#iAmWalking').on('click', function(e){
  e.preventDefault();
  var hours = new Date().getHours();
  var minutes = new Date().getMinutes();
  var currentHoursMinutes = hours*60+minutes;
  var usersTime = $('#timeToReturn').val().split(':');
  var usersHours = parseInt(usersTime[0]);
  var usersMinutes = parseInt(usersTime[1]);
  timeToReturn = parseInt(usersTime[0])*60 + parseInt(usersTime[1]);

  // console.log(timeToReturn-currentHoursMinutes);

  var routeTotal;
  tranformRouteDuration = function(){
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
    console.log(routeTotal);
    whenToHeadBack();
  };

  whenToHeadBack = function(){
    if(routeTotal >= timeToReturn-currentHoursMinutes){
      console.log('Time To Return');
      $('h1').html('Take Aim!')
    }
  };

  if($('#newDest:checked').val()){

    specifiedOrDefaultDestination = $('#theirNewDest').val();
    // uncomment this calcRoute call to see route when dest is dif than home.
    // calcRoute();
  }

  // TRIAL: SEND LATLNG TO SERVER WITH AJAX
  $.get('/directions/'+pos, function(data){
    console.log('client Data: ', data);
  });
  // calcRoute();
  
});
