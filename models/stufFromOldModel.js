var modelFxn = function(){
  console.log('modelFxn was called');
  function initialize() {
  // Instantiate a directions service.
    // directionsService = new google.maps.DirectionsService();

    // var mapOptions = {
    //   zoom: 13,
    //   center: pos
    // }
    // map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // // Create a renderer for directions and bind it to the map.
    // var rendererOptions = {
    //   map: map,
    //   // InfoWindow: infowindow,
    //   // panel: '#directions'
    //   // draggable: true
    // }
    // directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

    // // Instantiate an info window to hold step text.
    // stepDisplay = new google.maps.InfoWindow();
    // directionsDisplay.setPanel(document.getElementById('directionsPanel'));

    // calcRoute();
  }
  // initialize();
  calcRoute();
  function calcRoute() {

    // First, remove any existing markers from the map.
    // for (var i = 0; i < markerArray.length; i++) {
    //   markerArray[i].setMap(null);
    // }

    // // Now, clear the array itself.
    // markerArray = [];

    // Retrieve the start and end locations and create
    // a DirectionsRequest using WALKING directions.
    start = pos;
    var end = destination;
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
        console.log('timeToDest FROM SERVER::', timeToDest);
        tranformRouteDuration();
        // uncomment the two following lines whne ready to display map and directions.  
        // directionsDisplay.setDirections(response);
        // showSteps(response);
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

  // google.maps.event.addDomListener(window, 'load', initialize);

};

