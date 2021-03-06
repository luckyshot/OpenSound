OpenSound: Free Open-Source HTML5 Wireless Multi-Room Music System
======================

![screenshot](https://cloud.githubusercontent.com/assets/141241/10775240/075e1a88-7d07-11e5-81d2-4f9599176553.png)

OpenSound allows you to play music synchronized across multiple devices (laptops, computers, smartphones, iPods&hellip;), so you can listen to music in multiple rooms: at home, office or anywhere else.





How it works
----------------------
OpenSound works in any device with a modern HTML5 browser (desktop computers, laptops, smartphones, tablets, iPods&hellip;). The browser connects to your OpenSound server and then you can control your music from any device. Navigate through your music folder, fill in a playlist and play/pause/skip songs which will be streamed simultaneously to all connected devices.



### Why are we building this?

We love music and considered setting up Sonos but that was a huge investment, thousands of euros we'd rather spend in something else&hellip; We have got many speakers around and old iPods/laptops we would need to throw away or sell for nothing. And hey, we are web developers and know HTML5 and current open technologies are able to do that. We can use our existing speakers, plug them into iPods and old laptops and voila! We got Sonos for free :D And it's Web, platform agnostic and open source&hellip; Awesome!

It also serves as a great project to learn a lot of cool stuff, feel free to fork the project and help us build it, this is going to be a game-changer!



Main features
----------------------
- Works through your WiFi network and even the Internet (the least latency the best)
- Create playlists and stream MP3 files across all devices
- Works in all modern browsers including iPods and tablets
- Works with all speakers no matter brand, model or age
- Small scalable code
- Responsive design optimized for big screens and mobiles
- Easy-to-use revolutionary interface and UX
- Detects connected devices and allows fine-tunning volume and control
- Can be managed through any device, anywhere
- REST API


### Future roadmap

We are currently focusing on getting a prototype functioning. These features are not part of the MVP although pretty cool to implement in the future, so we've noted them down:

- Latency detector for perfect sync and gap-less playback (early versions will use HTTP requests and detect the ping, in the future we will move to WebSockets or a higher performance protocol)
- Dark theme and theme selection
- Get computer audio output so OpenSound is not limited to playing music through the browser but can actually stream music from Spotify and any other software (there's solutions for it although we may need to reccur to Flash)
- Integrate OpenSound with Raspberry Pi's, that'd mean super-cheap $50 controllers (instead of the $300+ on the market right now)
- Multiple playlists
- IDE3 tags detection
- Album cover &amp; lyrics
- Password protected access
- Cross-fade songs (using two audio tags)
- P2P (server-less) capability (there's solutions for it although we may need to reccur to Flash)
- iOS, Android, Firefox OS apps
- TideSDK?



### Requirements

- A computer with MP3s and a web server installed (XAMPP, LAMP&hellip;)
- Devices with a modern browser that support HTML5 <code>audio</code> and Internet connection



### Setup

Our main priority is to avoid any setup at all and keep it super simple to start using OpenSound so here's the 5 minute setup:

1. Start your web server in a computer with a music library
2. Open <code>config.php</code> and change the music folder path to where you have some MP3 files
3. Open the URL of the server in other devices (ie. <code>http://192.168.1.23/opensound/</code> )
4. Add songs to the playlist and press Play




### Technology

- HTML5
- JavaScript/jQuery
- PHP
- JSON API

(No database, it's <a href="https://github.com/luckyshot/php-file-database">file-based</a> for simplicity)






API
----------------------

Everything is returned as a JSON string (simplified here for readability).


### /

Returns the HTML view (homepage).


### /status

Requests JSON status of OpenSound every 5 seconds, a client is considered connected if he sends a status update at least every 10 seconds:

<pre>song: 'folder/path/mysong.mp3'
pos: 0 // in seconds
status: 0 (paused) or 1 (playing)
hash: { // hash is an md5 of the JSON string. If the hash changes, the client will request an update
	playlist: '9f4e3847f075d1e7e21141658ade4837'
	clients: '5f93f983524def3dca464469d2cf9f3e'
}</pre>


### /playlist

Requests current playlist, called on page load and when the <code>status.hash.playlist</code> changes.

Returns <code>playlist</code> from the <a href="#database-file">Database file</a>.


### /clients

Requests connected clients, called on page load and when the <code>status.hash.clients</code> changes.

Clients can be connected or disconnected, when connected, they can be enabled or disabled.

Returns <code>clients</code> from the <a href="#database-file">Database file</a>.


### /file/folder/path/mysong.mp3

Returns audio file in MP3 format.


### /browse/folder/path/

Returns list of files and folders in that path.

<pre>{
	path: '/techno/Marek Hemmann'
	files: [
		'/folder/'
		'/anotherfolder/'
		'mysong.mp3'
		'othersong.mp3'
	]
}</pre>






### /add/folder/path/mysong.mp3

Adds song to playlist.

##### Returns:
- <code>"status": "1"</code>
- <code>"status": "0", "error": "adderror", "msg": "Could not add the song"</code>


### /remove/folder/path/mysong.mp3

Removes song from playlist.

##### Returns:
- <code>"status": "1"</code>
- <code>"status": "0", "error": "removeerror", "msg": "Could not remove the song"</code>


### /play/folder/path/mysong.mp3

Plays song (starts at position 0).

##### Returns:
- <code>"status": "1"</code>
- <code>"status": "0", "error": "songnotfound", "msg": "Could not find the song"</code>


### /pause

Pauses song at current position.

##### Returns:
- <code>"status": "1"</code>
- <code>"status": "0", "error": "pauseerror", "msg": "Can't pause"</code>


### /pos/134

Moves current track to position (in seconds).

##### Returns:
- <code>"status": "1"</code>
- <code>"status": "0", "error": "posinvalid", "msg": "Invalid value for position"</code>




### /name/Black+laptop

Renames current device.

##### Returns:
- <code>"status": "1"</code>
- <code>"status": "0", "error": "nameinvalid", "msg": "Invalid name"</code>




### /client/Xavi+iPhone/on

Enable client (pass URL encoded client's name).

##### Returns:
- <code>"status": "1"</code>
- <code>"status": "0", "error": "clientnotfound", "msg": "The client could not be found"</code>


### /clientstatus/Xavi+iPhone/off

Disable client (pass URL encoded client's name).

##### Returns:
- <code>"status": "1"</code>
- <code>"status": "0", "error": "clientnotfound", "msg": "The client could not be found"</code>



### /clientvol/Xavi+iPhone/90

Change volume for a specific client.

##### Returns:
- <code>"status": "1"</code>
- <code>"status": "0", "error": "clientnotfound", "msg": "The client could not be found"</code>
- <code>"status": "0", "error": "volinvalid", "msg": "Invalid value for volume"</code>











localStorage
----------------------

OpenSound stores information in localStorage of each device, as minimum as possible since we want to keep everything in sync in the <code>opensound.json</code> database file:

<pre>{
	devicename: 'iMac'
	vol: 80
	ping: 200
	hash: [
		playlist: 'a1324603d9b1a22277809229934a36fd'
		clients: '0777d5c17d4066b82ab86dff8a46af6f'
	]
}</pre>








Database file
----------------------

<pre>{
	url: 'http://192.168.1.62/opensound/'
	song: 'folder/path/mysong.mp3'
	pos: 23
	started: 1368386529.79 // microtime(true), when the song started so we can sync
	status: 1
	path: /
	playlist: [
		'folder/path/mysong.mp3'
		'folder/path/mysong.mp3'
		...
	]
	clients: [
		{
			name: 'iMac'
			vol: 90
			status: 0 (disabled) or 1 (enabled)
			lastseen: 1000000 // Unix timestamp
			ping: 200 // ms
		},
		{
			name: 'iPhone'
			vol: 20
			status: 1
			lastseen: 1000000
			ping: 1400
		},
		...
	]
	hash: [
		playlist: 'd19544ae709580379cd2523b0e72c86d'
		clients: '250413d2982f1f83aa62a3a323cd2a87'
	]
}</pre>




Message
----------------------

There are three kind of messages shown in OpenSound:

- <code>error</code> (default): Displays an error
- <code>success</code>: After a user action, notifies of a successful change
- <code>info</code>: Informs of something, not necessarily a change or an error





References
----------------------
- http://www.serversideup.net/programming/style-the-html-5-audio-element





License
----------------------

<strong>Copyright (c) 2013 Xavi Esteve (http://xaviesteve.com) &amp; Marek Suliga (https://github.com/mark81)</strong>

Everyone is permitted to copy and distribute verbatim or modified copies of this, and changing it is allowed as long as the name is changed.

DON'T BE A DICK PUBLIC LICENSE TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

1. Do whatever you like with the original work, just don't be a dick.

	Being a dick includes - but is not limited to - the following instances:

	a. Outright copyright infringement - Don't just copy this and change the name.

	b. Selling the unmodified original with no work done what-so-ever, that's REALLY being a dick.

	c. Modifying the original work to contain hidden harmful content. That would make you a PROPER dick.

2. If you become rich through modifications, related works/services, or supporting the original work, share the love. Only a dick would make loads off this work and not buy a pint to the original work creator(s).

3. Code is provided with no warranty. Using somebody else's code and bitching when it goes wrong makes you a DONKEY dick. Fix the problem yourself. A non-dick would submit the fix back.

4. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.


### Credits &amp; Attribution

Icons adapted from <a href="http://juliuscsurgo.me/">Julius Csurgo</a>
