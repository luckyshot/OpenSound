<?php
//error_reporting(E_ERROR);

require_once('config.php');

/**
	ROUTES
**/

require('opensound.php');
$os = new OpenSound;

// Requests status
if (isset($_REQUEST['param1']) && $_REQUEST['param1'] === 'status') {
	header('Content-type: application/json');
	echo json_encode($os->status(), true);

// Requests status
}else if (isset($_REQUEST['param1']) && $_REQUEST['param1'] === 'clients') {
	header('Content-type: application/json');
	echo json_encode($os->clients(), true);


// returns audio file
}else if (isset($_REQUEST['param1']) && $_REQUEST['param1'] === 'file') {
	echo $os->file($_REQUEST['param2']);


// Request playlist
}else if (isset($_REQUEST['param1']) && $_REQUEST['param1'] === 'playlist') {
	header('Content-type: application/json');
	echo json_encode($os->files($config['path'],'mp3'), true);


}else if (isset($_REQUEST['param1']) && $_REQUEST['param1'] === 'play') {
	// Change status to play and get $request[value] for song filename
	header('Content-type: application/json');
	$os->statusUpdate('song', $_REQUEST['param2']);
	$os->statusUpdate('pos', 0);
	$os->statusUpdate('status', 1);
	echo json_encode(array('status'=>1), true);


}else if (isset($_REQUEST['param1']) && $_REQUEST['param1'] === 'pause') {
	// Change status to pause
	header('Content-type: application/json');
	echo json_encode($os->statusUpdate('status', 0), true);


}else if (isset($_REQUEST['param1']) && $_REQUEST['param1'] === 'pos') {
	// Change position in seconds
	// Calculate latency and increase seconds by 1-2 to improve sync
	header('Content-type: application/json');
	echo json_encode($os->statusUpdate('pos', $_REQUEST['param2']), true);


}else if (isset($_REQUEST['param1']) && $_REQUEST['param1'] === 'vol') {
	header('Content-type: application/json');
	echo json_encode($os->statusUpdate('vol', $_REQUEST['param2']), true);


}else{
	require_once('home.html');
}


