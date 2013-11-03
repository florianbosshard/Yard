<?php
 error_reporting(E_ALL);
 ini_set('display_errors', 1);
 

require 'bl.php';

require '../lib/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();


$app->get('/graph/', function() {
	getGraph();
});

$app->post('/login/', 'login');
$app->post('/anfrage/', 'anfrage' );

function login() {
	$request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $requestData = json_decode($body);
	
    addNewPlayer($requestData->name);
}


function anfrage() {
	$request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $requestData = json_decode($body);
	
	moveMisterX();
	catchMisterX($requestData->userid, $requestData->longitude, $requestData->latitude);
	
}






$app->run();


?>
