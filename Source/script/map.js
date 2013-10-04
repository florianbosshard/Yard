var map; 
function getLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(function (position) {
    	 L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
    }, function (error){
    	console.log(error);
    });
    }
  else{x.innerHTML="Geolocation is not supported by this browser.";}
  }


function showPosition(position) {
	console.log("Problem?");
	console.log(position);
	//var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
}


$(document).ready(function() {

	map = new L.Map('map', {
		center : new L.LatLng(47.49901, 8.728935),
		zoom : 17
	});

	// create a new tile layer
	var tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', layer = new L.TileLayer(tileUrl, {
		maxZoom : 18
	});

	// add the layer to the map
	map.addLayer(layer);


	getLocation();
}); 