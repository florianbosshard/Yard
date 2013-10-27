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
?>