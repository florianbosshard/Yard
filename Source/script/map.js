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
	yard.markUserLocation();
	yard.drawNode(47.499344, 8.726432);
	var pointA = new L.LatLng(47.499344, 8.726432);
	var pointB = new L.LatLng(47.498608, 8.726545);
	var pointC = new L.LatLng(47.499304, 8.725874);

	var pointList = [pointA, pointB, pointC, pointA];
	yard.drawPolyLine(pointList);

	yard.drawNode(47.498608, 8.726545);
	yard.drawNode(47.499304, 8.725874);

	$("#btnCatchMisterX").click(yard.catchMisterX);

});
