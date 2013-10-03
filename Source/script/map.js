$( document ).ready(function() {
        var map = new OpenLayers.Map("osMap");
        var mapnik         = new OpenLayers.Layer.OSM();
        var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
        var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
        // 47.499003,8.728572
        var position       = new OpenLayers.LonLat(8.728572,47.499003).transform( fromProjection, toProjection);
        var zoom           = 16; 
 
 		console.log(position);
 
        map.addLayer(mapnik);
    	var markers = new OpenLayers.Layer.Markers( "Markers" );
    	map.addLayer(markers);
    	markers.addMarker(new OpenLayers.Marker(position));
        map.setCenter(position, zoom );
});