
/**
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
    onSuccessA,
    onError
  );
}

function calculateRouteFromCtoD (platform) {
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'fastest;truck',
      representation: 'display',
      waypoint0: '17.4802,78.5522', // ECIL
      waypoint1: '17.4421,78.5755',  // mallapur
      instructionformat : 'html',
      routeattributes: 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      jsonattributes:1
    };


  router.calculateRoute(
    routeRequestParams,
    onSuccessB,
    onError
  );
}


function calculateRouteFromEtoF (platform) {
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'fastest;truck',
      representation: 'display',
      waypoint0: '17.4802,78.5522', // ECIL
      waypoint1: '17.4389,78.5416',
      // waypoint2: '17.46,78.59',  // mallapur
      instructionformat : 'html',
      routeattributes: 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      jsonattributes:1
    };


  router.calculateRoute(
    routeRequestParams,
    onSuccessC,
    onError
  );
}

function calculateRouteFromGtoH (platform) {
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'fastest;truck',
      representation: 'display',
      waypoint0: '17.4802,78.5522', // ECIL
      waypoint1: '17.4911,78.5449',
      // waypoint2: '17.46,78.59',  // mallapur
      instructionformat : 'html',
      routeattributes: 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      jsonattributes:1
    };


  router.calculateRoute(
    routeRequestParams,
    onSuccessD,
    onError
  );
}


function enableTrafficInfo (map) {
  // Center map on Moula Ali
    map.setCenter({lat: 17.4603, lng: 78.5578});
    
  map.setZoom(13);

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
function onSuccessA(result) {
  var route = result.response.route[0];
 /*
  * The styling of the route response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  addRouteShapeToMapA(route);
  addManueversToMap(route);

  addManueversToPanel(route);
  addSummaryToPanel(route.summary);
  // ... etc.
}

function onSuccessB(result) {
  var route = result.response.route[0];
 /*
  * The styling of the route response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  addRouteShapeToMapB(route);
  addManueversToMap(route);

  addManueversToPanel(route);
  addSummaryToPanel(route.summary);
  // ... etc.
}

function onSuccessC(result) {
  var route = result.response.route[0];
 /*
  * The styling of the route response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  addRouteShapeToMapC(route);
  addManueversToMap(route);

  addManueversToPanel(route);
  addSummaryToPanel(route.summary);
  // ... etc.
}

function onSuccessD(result) {
  var route = result.response.route[0];
 /*
  * The styling of the route response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  addRouteShapeToMapD(route);
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
  center: {lat: 17.4590, lng: 78.5570},//Moula Ali
  zoom: 12
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


 var routeA = [];
 var routeB = [];
 var routeC = [];
 var routeD = [];

function addRouteShapeToMapA(route){
  var strip = new H.geo.Strip(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function(point) {
    var parts = point.split(',');
    routeA.push(parts);
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
  // map.setViewBounds(polyline.getBounds(), true); // pans on the screen -- Boon
}

function addRouteShapeToMapB(route){
  var strip = new H.geo.Strip(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function(point) {
    var parts = point.split(',');
    routeB.push(parts);
    strip.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(strip, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 238, 155, 0.7)'
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  

  // And zoom to its bounding rectangle
  // map.setViewBounds(polyline.getBounds(), true); // pans on the screen -- Boon
}

function addRouteShapeToMapC(route){
  var strip = new H.geo.Strip(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function(point) {
    var parts = point.split(',');
    routeC.push(parts);
    strip.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(strip, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 28, 51, 0.7)'
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  

  // And zoom to its bounding rectangle
  // map.setViewBounds(polyline.getBounds(), true); // pans on the screen -- Boon
}

function addRouteShapeToMapD(route){
  var strip = new H.geo.Strip(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function(point) {
    var parts = point.split(',');
    routeD.push(parts);
    strip.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(strip, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 18, 201, 0.7)'
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  

  // And zoom to its bounding rectangle
  // map.setViewBounds(polyline.getBounds(), true); // pans on the screen -- Boon
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */

 var array = [];

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
            console.log(route.leg[i].maneuver[j].position.latitude,route.leg[i].maneuver[j].position.longitude);
              var latlng = new H.geo.Point(route.leg[i].maneuver[j].position.latitude,route.leg[i].maneuver[j].position.longitude);

      maneuver = route.leg[i].maneuver[j];
      // Add a marker to the maneuvers group
      var marker =  new H.map.Marker({
        lat: maneuver.position.latitude,
        lng: maneuver.position.longitude} ,
        {icon: dotIcon});
      marker.instruction = maneuver.instruction;
       // group.addObject(marker);

       // transition([maneuver.position.latitude, maneuver.position.longitude]);
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

var car1 = new H.map.Marker(new H.geo.Point(17.4802,78.5522),{icon: new H.map.Icon('car1.png')});
var car2 = new H.map.Marker(new H.geo.Point(17.4802,78.5522), {icon: new H.map.Icon('car2.png')});
var car3 = new H.map.Marker(new H.geo.Point(17.4802,78.5522), {icon: new H.map.Icon('car3.png')});
var car4 = new H.map.Marker(new H.geo.Point(17.4802,78.5522), {icon: new H.map.Icon('car4.png')});

var boy2 = new H.map.Marker(new H.geo.Point(17.4640,78.5789),{icon: new H.map.Icon('boy1.png')});
var boy1 = new H.map.Marker(new H.geo.Point(17.4389,78.5416),{icon: new H.map.Icon('boy2.png')});
var lady1 = new H.map.Marker(new H.geo.Point(17.4421,78.5755),{icon: new H.map.Icon('lady1.png')});
var lady2 = new H.map.Marker(new H.geo.Point(17.4911,78.5449),{icon: new H.map.Icon('lady2.png')});

var hotspot = new H.map.Marker(new H.geo.Point(17.4802,78.5522), {icon: new H.map.Icon('hotspot.png')});


calculateRouteFromAtoB (platform);
calculateRouteFromCtoD (platform);
calculateRouteFromEtoF (platform);
calculateRouteFromGtoH (platform);

enableTrafficInfo(map);
// map.addObject(car1);
map.addObject(hotspot);
map.addObjects([boy1,boy2,lady1,lady2]);
map.addObjects([car1,car2,car3,car4]);

var i = 0;
var j = 0;
var k = 0;
var l = 0;

var stopA;
var stopB;
var stopC;
var stopD;

function setUpClickListener(map) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.
  map.addEventListener('tap', function (evt) {
    var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
    alert('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
        ((coord.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(coord.lng.toFixed(4)) +
         ((coord.lng > 0) ? 'E' : 'W'));
  });
}

setUpClickListener(map);

function addCircleToMap(map){
  map.addObject(new H.map.Circle(
    // The central point of the circle
    {lat: 17.4590, lng: 78.5570},
    // The radius of the circle in meters
    5010,
    {
      style: {
        strokeColor: 'rgba(0,255,0, 0.1)', // Color of the perimeter
        lineWidth: 2,
        fillColor: 'rgba(0,255,0, 0.2)'  // Color of the circle
      }
    }
  ));
}

setTimeout(addCircleToMap(map),3000);



function moveA(){

    var latlngA = new H.geo.Point(routeA[i][0],routeA[i][1]);
    car1.setPosition(latlngA);

    i++;

    if((i == routeA.length))clearTimeout(stopA);


}

function moveB(){

    var latlngB = new H.geo.Point(routeB[j][0],routeB[j][1]);
    car2.setPosition(latlngB);
    j++;

    if((j == routeB.length))clearTimeout(stopB);
}


function moveC(){

    var latlngC = new H.geo.Point(routeC[k][0],routeC[k][1]);
    car3.setPosition(latlngC);
    k++;

    if((k == routeC.length))clearTimeout(stopC);
}

function moveD(){

var latlngD = new H.geo.Point(routeD[l][0],routeD[l][1]);
    car4.setPosition(latlngD);
    l++;

    if((l == routeD.length))clearTimeout(stopD);


}


function move_All(){
      stopA = setInterval(moveA,1000);
      stopB = setInterval(moveB,2005);
      stopC = setInterval(moveC,1090);
      stopD = setInterval(moveD,2080);
}
stopper = setInterval(move_All,1000);
