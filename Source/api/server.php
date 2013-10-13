<?php
require '../lib/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();


$app->post('/player/:name', function ($name) {
    //TODO Create Player
});

$app->post('/anfrage/:userid/:longitude/:latitude', function ($userid, $longitude, $latitude) {
	//TODO Anfrage umsetzen.
});





$app->run();


?>
