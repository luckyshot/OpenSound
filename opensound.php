<?php

// Need to include FileDatabase script from github

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

	public function status($client = '') {
		global $config;
		require('php-file-database.php');
		$fdb = new FileDatabase('opensound');
		$db = $fdb->get();
		// Check if DB exists, if not, create one
		if (!$db) {
			$db = array(
				'url' => 'http://192.168.1.62/opensound/',
				'song' => '',
				'pos' => 0,
				'status' => 0,
				'playlist' => array(
					'folder/mysong.mp3',
					'folder/othersong.mp3'
				),
				'clients' => array(),
				'hash' => array(
					'playlist' => '',
					'clients' => ''
				)
			);
			$fdb->set($db);
		}

		// Check if client is already in the list or add him
		if ($client) {
			$clientexists = false;
			foreach($db['clients'] as $key => $value) {
				if ($value['name'] == $client) {
					$clientexists = true;
				}
			}
			if (!$clientexists) {
				array_push($db['clients'], array(
					'name' => $client,
					'vol' => '90',
					'status' => 1,
					'lastseen' => time(),
					'ping' => '200' // ms
				));
			}
		}

		// TODO: update song pos

		// TODO: update lastseen

		// TODO: remove inactive clients		

		$fdb->set($db);
		return $db;
	}


	public function paramUpdate($param, $value) {
		require('php-file-database.php');
		$fdb = new FileDatabase('opensound');
		$db = $fdb->get();
		$db[$param] = $value;
		return $fdb->set($db);
	}


	/**
		CLIENTS
	 */
	// List all clients
	public function clients() {
		require('php-file-database.php');
		$fdb = new FileDatabase('opensound');
		$db = $fdb->get();
		return $db['clients'];
	}

	// Change a client's status
	public function clientstatus($client, $status) {
		require('php-file-database.php');
		$fdb = new FileDatabase('opensound');
		$db = $fdb->get();
		foreach($db['clients'] as $key => $value) {
			if ($value['name']==$client) {
				$db['clients'][$key]['status'] = $status;
				$fdb->set($db);
				return array('status' => 1);
			}
		}
		return array('status' => 0, 'error'=>'clientnotfound', 'msg' => 'The client could not be found');
	}
	
	// Change a client's volume
	public function clientvol($client, $vol) {
		require('php-file-database.php');
		$fdb = new FileDatabase('opensound');
		$db = $fdb->get();
		foreach($db['clients'] as $key => $value) {
			if ($value['name']==$client) {
				$db['clients'][$key]['vol'] = $vol;
				$fdb->set($db);
				return array('status' => 1);
			}
		}
		return array('status' => 0, 'error'=>'clientnotfound', 'msg' => 'The client could not be found');
	}



}