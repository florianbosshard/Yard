var yard = {
	map : null,
	ownPositionMarker : null,
	misterXCircle: null,
	userPosition: null,
	otherPlayers: new Array(),
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
			contentType : "text/json",
			url : "api/server.php/graph",
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
	     //Extend the Default marker class
         var RedIcon = L.Icon.Default.extend({
            options: {
            	    iconUrl: 'images/player.png', 
            	    iconSize:     [32, 37],
            }
         });
         var redIcon = new RedIcon();
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(function(position) {
				yard.userPosition = position;
				if(yard.ownPositionMarker){
					map.removeLayer(yard.ownPositionMarker);
				}

				yard.ownPositionMarker = L.marker([position.coords.latitude, position.coords.longitude], {icon: redIcon});
				yard.ownPositionMarker.addTo(map);
			}, function(error) {
				window.location = "gpsError.html";
			});
		} else {
				window.location = "gpsError.html";
		}
	},
	catchMisterX : function() {
		//Extend the Default marker class
         var BlueIcon = L.Icon.Default.extend({
            options: {
            	    iconUrl: 'images/otherPlayer.png', 
            	    iconSize:     [32, 37],
            }
         });
         var blueIcon = new BlueIcon();

		// send current position to server
		 $.ajax({
			type : 'POST',
			contentType : "text/json",
			url : "api/server.php/anfrage/",
			dataType : "json",
			data : JSON.stringify({
				"latitude" : yard.userPosition.coords.latitude,
				"longitude" : yard.userPosition.coords.longitude
			}),
			success : function(data, textStatus, jqXHR) {
				if(yard.misterXCircle){
					map.removeLayer(yard.misterXCircle);
				}
				while(yard.otherPlayers.length > 0){
					map.removeLayer(yard.otherPlayers.pop());
				}
					
				if(data.MisterXLast){
					yard.misterXCircle = L.circle([data.MisterXLast.longitude, data.MisterXLast.latitude], 10, {
						color: 'red',
						fillColor: 'red',
						fillOpacity: 1.0
					});						
					yard.misterXCircle.addTo(map);
				}
				if(data.OtherPlayers){
					// Remove existing markers
					for(var i = 0;i< data.OtherPlayers.length;i++){
						var otherPlayer = data.OtherPlayers[i];
						
						var datumSpieler = new Date(Date.parse(otherPlayer.zeitpunkt));
						var datumNow = new Date();
						var differenzSekunden = (datumNow.getTime() - datumSpieler.getTime()) / 1000;
						var minuten = Math.floor(differenzSekunden / 60);
						var sekunden = Math.floor(differenzSekunden - minuten* 60);
						
							
						var marker = L.marker([otherPlayer.longitude, otherPlayer.latitude], {icon: blueIcon})
							.bindPopup(otherPlayer.Name +" vor "+ minuten +" Minuten "+ sekunden +" Sekunden");
						yard.otherPlayers.push(marker);
					    marker.addTo(map);
					}	
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
			
	},
	drawNode : function(lat, lon, id) {
		var circle = L.circle([lat, lon], 10, {
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
	
	yard.markUserLocation();


});
