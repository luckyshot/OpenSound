<?php
/*!

 88888888b oo dP          888888ba             dP            dP                                  
 88           88          88    `8b            88            88                                  
a88aaaa    dP 88 .d8888b. 88     88 .d8888b. d8888P .d8888b. 88d888b. .d8888b. .d8888b. .d8888b. 
 88        88 88 88ooood8 88     88 88'  `88   88   88'  `88 88'  `88 88'  `88 Y8ooooo. 88ooood8 
 88        88 88 88.  ... 88    .8P 88.  .88   88   88.  .88 88.  .88 88.  .88       88 88.  ... 
 dP        dP dP `88888P' 8888888P  `88888P8   dP   `88888P8 88Y8888' `88888P8 `88888P' `88888P' 
ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

	A tiny class to store PHP arrays into JSON files

 * @author      Xavi Esteve <xavi@xaviesteve.com>
 * @copyright   2013 Xavi Esteve
 * @link        http://xaviesteve.com
 * @version     1.0.0
 *
 * MIT LICENSE
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * FileDatabase
 *
 * This class provides the implementation for an uploaded file. It exposes
 * common attributes for the uploaded file (e.g. name, extension, media type)
 * and allows you to attach validations to the file that must pass for the
 * upload to succeed.
 *
 * @author  Xavi Esteve <xavi@xaviesteve.com>
 * @since   1.0.0
 * @package FileDatabase
 */
Class FileDatabase {
	private $filename = '';

	/**
     * Initializes the Class for the database with name $filename
     * @var string
     */
	function __construct($filename = 'database') {
		$this->filename = $filename;
	}

	/**
     * Saves a PHP associative array into a JSON file
     * @var array
     */
	public function set($array) {
		$filehandle = fopen($this->filename.".json", 'w');
		if (!$filehandle) {return false;}
		$fwrite = fwrite($filehandle, stripslashes(json_encode($array)));
		fclose($filehandle);
		return $fwrite;
	}

	/**
     * Converts a JSON file into a PHP associative array
     * @return array
     */
	public function get() {
		$data = '';
		if (file_exists($this->filename.".json")) {
			$data = file_get_contents($this->filename.".json");
			return json_decode($data, true);
		}else{
			return false;
		}
	}

}
