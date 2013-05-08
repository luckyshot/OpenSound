<?php

class OpenSound {

	function __construct() {

	}

	/**
		FILES
	 */

	public function files($dir = ".", $ext = 'mp3') {
		// Returns array of files (JSON should be done in index.php)
		$files = array();
		if ($handle = opendir($dir)) {
			while (false !== ($file = readdir($handle))) {
				if ($file != "." && $file != ".." && strtolower(substr($file, strrpos($file, '.') + 1)) == $ext) {
					array_push($files, $file);
				}
			}
			closedir($handle);
		}
		return $files;
	}


	public function file($filename) {
		global $config;
		// Returns MP3 file with appropriate headers
		if(file_exists($config['path'].'/'.$filename)) {
			header('Content-Type: audio/mpeg');
			header('Content-Disposition: filename="'.$filename.'"');
			header('Content-length: '.filesize($config['path'].'/'.$filename));
			header('Cache-Control: no-cache');
			header("Content-Transfer-Encoding: chunked"); 

			readfile($config['path'].'/'.$filename);
		}else{
			header("HTTP/1.0 404 Not Found");
			header('Content-type: application/json');
			echo json_encode(array('status'=>'error','code'=>404,'msg'=>'File not found'), true);
		}
	}


	/**
		STATUS
	 */

	public function status() {
		global $config;
		require('php-file-database.php');
		$fdb = new FileDatabase($config['database']);
		$db = $fdb->get();
		if (!$db) {
			$db = array(
				'song' => '',
				'pos' => 0,
				'status' => 0,
				'vol' => 80,
				'master' => 'Ahtec laptop', // should change when a manual action is taken from another client
				'clients' => array(
					0 => array(
						'name' => 'Ahtec laptop',
						'status' => 1,
						'lastseen' => 1000000,
					)
				),
			);
			$fdb->set($db);
		}
		return $db;
	}


	public function statusUpdate($param, $value) {
		global $config;
		require('php-file-database.php');
		$fdb = new FileDatabase($config['database']);
		$db = $fdb->get();
		$db[$param] = $value;
		$fdb->set($db);
		return array('status' => 1);
	}


	/**
		DEVICES
	 */

	public function deviceAdd() {
		//
	}


	public function deviceRemove() {
		//
	}


	public function deviceStatus($status = 1) {
		// Turns device ON/OFF (1 or 0)
	}




}