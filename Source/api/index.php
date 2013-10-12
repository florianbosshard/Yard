<?php

$request_body = file_get_contents('php://input');

$obj = json_decode($request_body);

$rw = array("username"=> $obj->username, "message" => "Sorry ". $obj->username." \nDu hast Mister X nicht gefunden, da er gar noch nicht unterwegs ist... ");

echo json_encode($rw);

?>