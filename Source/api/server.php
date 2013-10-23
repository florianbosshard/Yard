<?php
require '../lib/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();



$app->get('/graph/', function() {
	$nodeArray = array();
	$nodeArray[] = array("longitude" => "47.499344", "latitude" => "8.726432");
	
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
