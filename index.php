<?php
//error_reporting(E_ERROR);

require_once('config.php');

/**
	ROUTES
**/

// Requests status
if (isset($_REQUEST['action']) && $_REQUEST['action'] === 'status') {
	require('opensound.php');
	$os = new OpenSound;
	header('Content-type: application/json');
	echo json_encode($os->status(), true);


// returns audio file
}else if (isset($_REQUEST['action']) && $_REQUEST['action'] === 'file') {
	require('opensound.php');
	$os = new OpenSound;
	echo $os->file($_REQUEST['value']);


// Request tracklist
}else if (isset($_REQUEST['action']) && $_REQUEST['action'] === 'tracklist') {
	require('opensound.php');
	$os = new OpenSound;
	header('Content-type: application/json');
	echo json_encode($os->files($config['path'],'mp3'), true);


}else if (isset($_REQUEST['action']) && $_REQUEST['action'] === 'play') {
	// Change status to play and get $request[value] for song filename
	require('opensound.php');
	$os = new OpenSound;
	header('Content-type: application/json');
	$os->statusUpdate('song', $_REQUEST['value']);
	$os->statusUpdate('pos', 0);
	$os->statusUpdate('status', 1);
	echo json_encode(array('status'=>1), true);


}else if (isset($_REQUEST['action']) && $_REQUEST['action'] === 'pause') {
	// Change status to pause
	require('opensound.php');
	$os = new OpenSound;
	header('Content-type: application/json');
	echo json_encode($os->statusUpdate('status', 0), true);


}else if (isset($_REQUEST['action']) && $_REQUEST['action'] === 'pos') {
	// Change position in seconds
	// Calculate latency and increase seconds by 1-2 to improve sync
	require('opensound.php');
	$os = new OpenSound;
	header('Content-type: application/json');
	echo json_encode($os->statusUpdate('pos', $_REQUEST['value']), true);


}else if (isset($_REQUEST['action']) && $_REQUEST['action'] === 'vol') {
	require('opensound.php');
	$os = new OpenSound;
	header('Content-type: application/json');
	echo json_encode($os->statusUpdate('vol', $_REQUEST['value']), true);


}else{
	require_once('home.html');
}


