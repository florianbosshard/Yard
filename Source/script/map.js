var yard = {
	map : null,
	userLocation : null,
	misterXCircle: null,
	initMap : function() {
		map = new L.Map('map', {
			center : new L.LatLng(47.49901, 8.728935),
			zoom : 17,
			maxZoom : 19,
			minZoom : 14
		});

		var tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', layer = new L.TileLayer(tileUrl);

		map.addLayer(layer);

		map.on('click', function(e) {
			console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
		});
	},
	drawGraph : function() {
		$.ajax({
			type : 'GET',
			//contentType : 'application/json',
			contentType : "text/json",
			url : "/api/server.php/graph",
			dataType : "json",
			success : function(data, textStatus, jqXHR) {
				for (var i = 0; i < data.nodes.length; i++) {
					yard.drawNode(data.nodes[i].longitude, data.nodes[i].latitude, data.nodes[i].Id);
				};

				for (var i = 0; i < data.lines.length; i++) {
					yard.drawLine(data.lines[i].longitudeFrom, data.lines[i].latitudeFrom, data.lines[i].longitudeTo, data.lines[i].latitudeTo);
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
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				// send current position to server
				$.ajax({
					type : 'POST',
					contentType : "text/json",
					url : "/api/server.php/anfrage/",
					dataType : "json",
					data : JSON.stringify({
						"userid" : "1",
						"latitude" : position.coords.latitude,
						"longitude" : position.coords.longitude
					}),
					success : function(data, textStatus, jqXHR) {
						if(yard.misterXCircle){
							map.removeLayer(yard.misterXCircle);
						}
						if(data.MisterXLast){
							yard.misterXCircle = L.circle([data.MisterXLast.longitude, data.MisterXLast.latitude], 7, {
								color: 'red',
								fillColor: 'red',
								fillOpacity: 1.0
							});						
							yard.misterXCircle.addTo(map);
						}
						
						
						
						$("#messagePopup").popup();
						$("#messagePopup").popup("open");
						$("#message").text(data.message);
						


					},
					error : function(jqXHR, textStatus, errorThrown) {
						console.log(textStatus);
						console.log(errorThrown);
					}
				});
			}, function(error) {
				alert(error);
			});
		} else {
			alert("navigator.geolocation ist ausgeschaltet");
		}

	},
	drawNode : function(lat, lon, id) {
		var circle = L.circle([lat, lon], 7, {
			color : 'blue',
			fillColor : 'blue',
			fillOpacity : 0.3
		}).addTo(map);

		// L.marker([lat, lon]).addTo(map).bindPopup('Id:' + id).openPopup();
	},
	drawLine : function(latFrom, longFrom, latTo, longTo) {
		var from = new L.LatLng(latFrom, longFrom);
		var to = new L.LatLng(latTo, longTo);
		yard.drawPolyLine([from, to]);
	},
	drawPolyLine : function(pointList) {
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
	$("#btnCatchMisterX").click(yard.catchMisterX);
	

});
