var yard = {
	map : null,
	userLocation : null,
	initMap : function() {
		map = new L.Map('map', {
			center : new L.LatLng(47.49901, 8.728935),
			zoom : 17,
			maxZoom : 19,
			minZoom : 14
		});

		var tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', layer = new L.TileLayer(tileUrl);

		map.addLayer(layer);
	},
	drawGraph : function() {
		$.ajax({
				type : 'GET',
				//contentType : 'application/json',
				contentType: "text/json",
				url : "/api/server.php/graph",
				dataType : "json",
				success : function(data, textStatus, jqXHR) {
					console.log(data);

					for (var i=0; i < data.nodes.length; i++) {
					  yard.drawNode(data.nodes[i].longitude,  data.nodes[i].latitude);
					};

					for (var i=0; i < data.lines.length; i++) {
					  yard.drawLine(data.lines[i].longitudeFrom,  data.lines[i].latitudeFrom, data.lines[i].longitudeTo,  data.lines[i].latitudeTo);
					};
	
				},
				error : function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
	
		
	},
	markUserLocation : function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				userLocation = position;
				ownPositionMarker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
			}, function(error) {
				alert(error);
			});
		} else {
			alert("navigator.geolocation ist ausgeschaltet");
		}
	},
	catchMisterX : function() {
		// send current position to server
		$.ajax({
			type : 'PUT',
			//contentType : 'application/json',
			contentType: "text/json",
			url : "/api/",
			dataType : "json",
			data : JSON.stringify({
				"position" : userLocation,
				"username": "Gewinnertyp"
			}),
			success : function(data, textStatus, jqXHR) {
				console.log(data);
				alert(data.message);

			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
		// show sanduhr

		// show resultmessage

	},
	drawNode : function(lat, lon) {
		var circle = L.circle([lat, lon], 7, {
			color : 'blue',
			fillColor : 'blue',
			fillOpacity : 0.3
		}).addTo(map);
	},
	drawLine : function(latFrom, longFrom, latTo, longTo){
		 var from = new L.LatLng(latFrom, longFrom);
		 var to = new L.LatLng(latTo, longTo);
		 yard.drawPolyLine([from, to]);
	},
	drawPolyLine : function(pointList) {
		console.log("hier");
		var polyline = new L.Polyline(pointList, {
			color : 'blue',
			weight : 3,
			opacity : 0.5,
			smoothFactor : 1
		});

		map.addLayer(polyline);

	}
};

$(document).ready(function() {

	yard.initMap();
	yard.drawGraph();
	// yard.markUserLocation();
	$("#btnCatchMisterX").click(yard.catchMisterX);

});
