<?php
require "connect.php";

require '../lib/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$con=mysql_connect("localhost",$username,$passwort,$db);
mysql_select_db($db);

// Check connection
if (mysqli_connect_errno($con))
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}


$app->get('/graph/', function() {
	
	$nodeArray = array();
	
	$result = mysql_query("SELECT Longitude, Latitude FROM Knoten");

	echo mysql_error();

	while($row = mysql_fetch_array($result))
	{
		$nodeArray[] = array("longitude" => $row["Longitude"], "latitude" => $row["Latitude"]);
	
	}
	
	$lineArray = array();
	$lineArray[] = array( "longitudeFrom" => "47.499344", "latitudeFrom" => "8.726432", "longitudeTo" => "47.498608", "latitudeTo" => "8.726545" );
	
	$graphArray = array("nodes" => $nodeArray, "lines" => $lineArray);
	
	echo json_encode($graphArray);
});
$app->post('/player/:name', function ($name) {
    //TODO Create Player
});

$app->post('/anfrage/:userid/:longitude/:latitude', function ($userid, $longitude, $latitude) {
	//TODO Anfrage umsetzen.
});






$app->run();


?>
