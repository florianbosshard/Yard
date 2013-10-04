$( document ).ready(function() {
	
    var map = new L.Map('map', {
      center: new L.LatLng(47.49901,8.728935),
      zoom: 17
    });

    // create a new tile layer
    var tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    layer = new L.TileLayer(tileUrl, {maxZoom: 18});

    // add the layer to the map
    map.addLayer(layer);
});