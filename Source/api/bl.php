<?php
//File für Businesslogik

require 'connect.php';

$con = mysql_connect("localhost", $username, $passwort);
if(!$con){
	die("Konnte die Datenbank nicht öffnen. Fehlermeldung: ". mysql_error());
}


$dbCon = mysql_select_db($db, $con);

if(!$dbCon){
	die("Datenbank nicht geöffnet. Fehlermeldung: ". mysql_error());
}

function getGraph() {
	$nodeArray = array();
	$lineArray = array();

	//Abfragen der Knoten
	$result = mysql_query("SELECT Id, Longitude, Latitude FROM Knoten");
	echo mysql_error();

	while ($row = mysql_fetch_array($result)) {
		$nodeArray[] = array("Id" => $row["Id"], "longitude" => $row["Longitude"], "latitude" => $row["Latitude"]);
	}

	//Abfragen der Kanten
	$result = mysql_query("SELECT Kante.Knoten1Id, Kante.Knoten2Id, kn1.Longitude LongitudeFrom, kn1.Latitude LatitudeFrom, kn2.Longitude LongitudeTo, kn2.Latitude LatitudeTo FROM  Kante JOIN Knoten kn1 ON Kante.Knoten1Id = kn1.Id JOIN Knoten kn2 ON Kante.Knoten2Id = kn2.Id");
	echo mysql_error();

	while ($row = mysql_fetch_array($result)) {
		$resultRichtungspunkt = mysql_query("SELECT Longitude, Latitude FROM Richtungspunkt WHERE Knoten1Id = " . intval($row["Knoten1Id"]) . " AND Knoten2Id = " . intval($row["Knoten2Id"]) . " ORDER BY Nummer");
		if (mysql_num_rows($resultRichtungspunkt) > 0) {

			$before = array("Longitude" => $row["LongitudeFrom"], "Latitude" => $row["LatitudeFrom"]);
			while ($rowRichtungspunkt = mysql_fetch_array($resultRichtungspunkt)) {
				$lineArray[] = array("longitudeFrom" => $before["Longitude"], "latitudeFrom" => $before["Latitude"], "longitudeTo" => $rowRichtungspunkt["Longitude"], "latitudeTo" => $rowRichtungspunkt["Latitude"]);
				$before["Longitude"] = $rowRichtungspunkt["Longitude"];
				$before["Latitude"] = $rowRichtungspunkt["Latitude"];
			}
			$lineArray[] = array("longitudeFrom" => $before["Longitude"], "latitudeFrom" => $before["Latitude"], "longitudeTo" => $row["LongitudeTo"], "latitudeTo" => $row["LatitudeTo"]);
		} else {
			$lineArray[] = array("longitudeFrom" => $row["LongitudeFrom"], "latitudeFrom" => $row["LatitudeFrom"], "longitudeTo" => $row["LongitudeTo"], "latitudeTo" => $row["LatitudeTo"]);
		}
	}

	//Erzeugung der Graph-Array
	$graphArray = array("nodes" => $nodeArray, "lines" => $lineArray);

	echo json_encode($graphArray);
}

function addNewPlayer($name) {
	mysql_query("INSERT INTO Spieler (Name) VALUES('$playername') ") or die(mysql_error());

	echo "Neuer Spieler hinzugefuegt";
}

function catchMisterX($userId, $latitude, $longitude){
	// Finde heraus, bei welchem Knoten der Benutzer steht
	
	$query = "SELECT Id FROM  Knoten WHERE Longitude BETWEEN ". ($longitude - 0.000100). " AND ".  ($longitude + 0.000100) ." AND Latitude BETWEEN ". ($latitude - 0.000100). " AND ".  ($latitude + 0.000100) ;

	$result = mysql_query($query );
	echo mysql_error();
	
	if(mysql_num_rows($result) == 0){
		die(json_encode(array("message"=> "Du konntest keinem Punkt zugeordnet werden.". $query)));	
	} 
	if(mysql_num_rows($result) > 1){
		die(json_encode(array("message"=> "Keine eindeutige Zuordnung möglich.")));	
	} 
	
	
	$knoten = mysql_fetch_array($result);
	// Hole die letzten standorte von Mister X
	$result = mysql_query("SELECT m.KnotenId, m.Zeitpunkt, k.Latitude, k.Longitude FROM Misterx m JOIN Knoten k ON  m.KnotenId = k.Id ORDER BY m.Zeitpunkt DESC LIMIT 2");
	echo mysql_error();
	
	$misterxPos = mysql_fetch_array($result);
	// erste Position von Mister X stimmt mit der Position des Benutzers überein => gefunden
	if($misterxPos['KnotenId'] == $knoten['Id']){
		die(json_encode(array("message"=> "Gratulation - du hast MisterX erwischt.")));	
	}
	
	// Gebe aus, wo sich Mister X als letztes aufgehalten hat
	$misterxLastPos = mysql_fetch_array($result);
	
	
	
	die(json_encode(array("message"=> "Da ist Mister X nicht... ", "MisterXLast" => array("latitude" => $misterxLastPos['Latitude'], "longitude" => $misterxLastPos['Longitude'] ))));
	
}

?>