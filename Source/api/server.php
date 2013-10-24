<?php
require 'bl.php';

require '../lib/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();




$app->get('/graph/', function() {
	getGraph();
});

$app->post('/player/:name', function ($name) {
    addNewPlayer($name);
});

$app->post('/anfrage/:userid/:longitude/:latitude', function ($userid, $longitude, $latitude) {
	//TODO Anfrage umsetzen.
});






$app->run();


?>
