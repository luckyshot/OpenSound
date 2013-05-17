<?php

// Need to include FileDatabase script from github

class OpenSound {

	function __construct() {

	}

	/**
		FILES
	 */

	// Returns array of files (JSON should be done in index.php)
	public function files($dir = ".", $ext = 'mp3', $showfolders = false) {
		$files = array();
		if ( is_dir($dir) && $handle = opendir($dir)) {
			while (false !== ($file = readdir($handle))) {
				if ($showfolders) {
					if (
						$file == ".." OR // folder up
						strtolower(substr($file, strrpos($file, '.') + 1)) == $ext OR // mp3 files
						strpos($file, '.') === false // folders
					) {
						array_push($files, $file);
					}
				}else{
					if ($file != "." && $file != ".." && strtolower(substr($file, strrpos($file, '.') + 1)) == $ext) {
						array_push($files, $file);
					}
				}
			}
			closedir($handle);
		}
		return $files;
	}


	// Returns MP3 file with appropriate headers
	public function file($filename) {
		global $config;
		$filename = htmlspecialchars_decode(rawurldecode($filename));

		if(file_exists($config['path'].'/'.$filename)) {
			
			// if requesting a range
			if (isset($_SERVER['HTTP_RANGE'])) {
				$this->rangeDownload($config['path'].'/'.$filename);
				return true;
			
			// downloading from the start
			}else{
				header("Content-Transfer-Encoding: binary"); 
				header("Content-Type: audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3");
				header('Accept-Ranges: bytes');			
				header('Content-Disposition: filename="'.$filename.'"');
				header('Content-length: '.filesize($config['path'].'/'.$filename));
				readfile($config['path'].'/'.$filename);
			}
		}else{
			header("HTTP/1.0 404 Not Found");
			header('Content-type: application/json');
			echo json_encode(array('status'=>'error','code'=>404,'msg'=>'File not found'), true);
		}
	}

	public function add($file) {
		require('php-file-database.php');
		$fdb = new FileDatabase('opensound');
		$db = $fdb->get();
		array_push($db['playlist'], $file);
		return $fdb->set($db);
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

		// Check if client is already in the list and update last seen, add him or delete him
		if ($client) {
			$clientexists = false;
			foreach($db['clients'] as $key => $value) {
				if ($value['name'] == $client) {
					// update lastseen
					$db['clients'][$key]['lastseen'] = time();
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
				$fdb->set($db);
			}
		}


		// TODO: remove inactive clients		

		// Save changes

		// update song pos
		$db['pos'] = $db['pos'] + microtime(true) - $db['started'];
		return $db;
	}


	public function paramUpdate($array) {
		// allow multiple changes (sending an array)
		require('php-file-database.php');
		$fdb = new FileDatabase('opensound');
		$db = $fdb->get();
		foreach ($array as $key => $value) {
			$db[$key] = $value;
		}
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
		foreach($db['clients'] as $key => &$value) {
			if ($value['name']==$client) {
				$value['status'] = (string)$status;
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










	// source: http://forums.phpfreaks.com/topic/106711-php-code-which-supports-byte-range-downloads-for-iphone/
	private function rangeDownload($filepath) {
		$fp = @fopen($filepath, 'rb');

		$size   = filesize($filepath); // File size
		$length = $size;           // Content length
		$start  = 0;               // Start byte
		$end    = $size - 1;       // End byte
		// Now that we've gotten so far without errors we send the accept range header
		/* At the moment we only support single ranges.
		 * Multiple ranges requires some more work to ensure it works correctly
		 * and comply with the spesifications: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.2
		 *
		 * Multirange support annouces itself with:
		 * header('Accept-Ranges: bytes');
		 *
		 * Multirange content must be sent with multipart/byteranges mediatype,
		 * (mediatype = mimetype)
		 * as well as a boundry header to indicate the various chunks of data.
		 */
		header("Accept-Ranges: 0-$length");
		// header('Accept-Ranges: bytes');
		// multipart/byteranges
		// http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.2
		if (isset($_SERVER['HTTP_RANGE'])) {
			$c_start = $start;
			$c_end   = $end;
			// Extract the range string
			list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
			// Make sure the client hasn't sent us a multibyte range
			if (strpos($range, ',') !== false) {
				// (?) Shoud this be issued here, or should the first
				// range be used? Or should the header be ignored and
				// we output the whole content?
				header('HTTP/1.1 416 Requested Range Not Satisfiable');
				header("Content-Range: bytes $start-$end/$size");
				// (?) Echo some info to the client?
				exit;
			}
			// If the range starts with an '-' we start from the beginning
			// If not, we forward the file pointer
			// And make sure to get the end byte if spesified
			if ($range{0} == '-') {
				// The n-number of the last bytes is requested
				$c_start = $size - substr($range, 1);
			} else {
				$range  = explode('-', $range);
				$c_start = $range[0];
				$c_end   = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
			}
			/* Check the range and make sure it's treated according to the specs.
			 * http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
			 */
			// End bytes can not be larger than $end.
			$c_end = ($c_end > $end) ? $end : $c_end;
			// Validate the requested range and return an error if it's not correct.
			if ($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size) {
				header('HTTP/1.1 416 Requested Range Not Satisfiable');
				header("Content-Range: bytes $start-$end/$size");
				// (?) Echo some info to the client?
				exit;
			}
			$start  = $c_start;
			$end    = $c_end;
			$length = $end - $start + 1; // Calculate new content length
			fseek($fp, $start);
			header('HTTP/1.1 206 Partial Content');
		}
		// Notify the client the byte range we'll be outputting
		header("Content-Range: bytes $start-$end/$size");
		header("Content-Length: $length");

		// Start buffered download
		$buffer = 1024 * 8;
		while(!feof($fp) && ($p = ftell($fp)) <= $end) {
			if ($p + $buffer > $end) {
				// In case we're only outputtin a chunk, make sure we don't
				// read past the length
				$buffer = $end - $p + 1;
			}
			set_time_limit(0); // Reset time limit for big files
			echo fread($fp, $buffer);
			flush(); // Free up memory. Otherwise large files will trigger PHP's memory limit.
		}

		fclose($fp);
	}





}