
/**
 * Calculates and displays  a truck route from Chicago O'Hare Airport to
 * the I-290 Eisenhower Expressway nearby.
 *
 * A full list of available request parameters can be found in the Routing API documentation.
 * see:  http://developer.here.com/rest-apis/documentation/enterprise-routing/topics/resource-calculate-route.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function calculateRouteFromAtoB (platform) {
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'fastest;truck',
      representation: 'display',
      waypoint0: '17.4802,78.5522', // ECIL
      waypoint1: '17.4640,78.5789',  // AS Rao
      instructionformat : 'html',
      routeattributes: 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      jsonattributes:1
    };


  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
}

function calculateRouteFromCtoD (platform) {
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'fastest;truck',
      representation: 'display',
      waypoint0: '17.4361,78.5598', // nacharam
      waypoint1: '17.4421,78.5755',  // mallapur
      instructionformat : 'html',
      routeattributes: 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      jsonattributes:1
    };


  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
}

function enableTrafficInfo (map) {
  // Center map on New York
    map.setCenter({lat: 17.3859, lng: 78.4867});
  map.setZoom(11);

  // Show traffic tiles
  map.setBaseLayer(defaultLayers.normal.traffic);

  // Enable traffic incidents layer
  map.addLayer(defaultLayers.incidents);
}


/**
 * This function will be called once the Routing REST API provides a response
 * @param  {Object} result          A JSONP object representing the calculated route
 *
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
 */
function onSuccess(result) {
  var route = result.response.route[0];
 /*
  * The styling of the route response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  addRouteShapeToMap(route);
  addManueversToMap(route);

  addManueversToPanel(route);
  addSummaryToPanel(route.summary);
  // ... etc.
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Ooops!');
}




/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map  + panel
var mapContainer = document.getElementById('map'),
  routeInstructionsContainer = document.getElementById('panel');

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
 app_id: 'ghg6IkMGjZpqXwlCwDmA',
app_code: 'Cn64wmxK7LleA7ch4KrWEQ',
  // useCIT: true,
  // useHTTPS: true
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Berlin
var map = new H.Map(mapContainer,
  defaultLayers.normal.map,{
  center: {lat: 17.3859, lng: 78.4867},
  zoom: 13
});

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Hold a reference to any infobubble opened
var bubble;

/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text){
 if(!bubble){
    bubble =  new H.ui.InfoBubble(
      position,
      // The FO property holds the province name.
      {content: text});
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}


/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(route){
  var strip = new H.geo.Strip(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function(point) {
    var parts = point.split(',');
    strip.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(strip, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 128, 255, 0.7)'
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  // And zoom to its bounding rectangle
  map.setViewBounds(polyline.getBounds(), true);
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToMap(route){
  var svgMarkup = '<svg width="18" height="18" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
    '</svg>',
    dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
    group = new  H.map.Group(),
    i,
    j;

  // Add a marker for each maneuver
  for (i = 0;  i < route.leg.length; i += 1) {
    for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];
      // Add a marker to the maneuvers group
      var marker =  new H.map.Marker({
        lat: maneuver.position.latitude,
        lng: maneuver.position.longitude} ,
        {icon: dotIcon});
      marker.instruction = maneuver.instruction;
      group.addObject(marker);
    }
  }

  group.addEventListener('tap', function (evt) {
    map.setCenter(evt.target.getPosition());
    openBubble(
       evt.target.getPosition(), evt.target.instruction);
  }, false);

  // Add the maneuvers group to the map
  map.addObject(group);
}



/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addSummaryToPanel(summary){
  var summaryDiv = document.createElement('div'),
   content = '';
   content += '<b>Total distance</b>: ' + summary.distance  + 'm. <br/>';
   content += '<h2><b>Travel Time</b>: ' + summary.trafficTime.toMMSS() + ' (in current traffic)</h2>';


  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft ='5%';
  summaryDiv.style.marginRight ='5%';
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToPanel(route){



  var nodeOL = document.createElement('ol'),
    i,
    j;

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';
  nodeOL.className = 'directions';

     // Add a marker for each maneuver
  for (i = 0;  i < route.leg.length; i += 1) {
    for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];

      var li = document.createElement('li'),
        spanArrow = document.createElement('span'),
        spanInstruction = document.createElement('span');

      spanArrow.className = 'arrow '  + maneuver.action;
      spanInstruction.innerHTML = maneuver.instruction;
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
    }
  }

  routeInstructionsContainer.innerHTML = '';

  routeInstructionsContainer.appendChild(nodeOL);
}


Number.prototype.toMMSS = function () {
  return  Math.floor(this / 60)  +' minutes '+ (this % 60)  + ' seconds.';
}

// Now use the map as required...

var marker_dutt1 = new H.map.Marker({
  lat: 17.4802, lng: 78.5522
});

var marker_dutt2 = new H.map.Marker({
  lat: 17.4640, lng: 78.5789
});

calculateRouteFromAtoB (platform);
calculateRouteFromCtoD (platform);
enableTrafficInfo(map);
map.addObject(marker_dutt1);
map.addObject(marker_dutt2);
