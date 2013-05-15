// Global variables
var audio = document.getElementById('audio');

var OpenSound = {
	config: {
		interval: 5, // seconds to request new status
		msgtimer: ''
	},
	msg: function(msg, css) {"use strict";
		clearTimeout(this.config.msgtimer);
		$('#msg').remove();
		$('body').append('<div id="msg" class="'+css+'"><span id="msg-close" class="close" title="Close">&times;</span><p>'+msg+'</p></div>');
		$('#msg').fadeIn('fastest');
		$('#msg-close').on('click', function() {
			$(this).unbind('click');
			clearTimeout(this.config.msgtimer);
			$('#msg').fadeOut('fast', function() {
				$('#msg').remove();
			});
		});
		this.config.msgtimer = setTimeout( function() {
			$('#msg').fadeOut('slow', function() {
				$(this).remove();
			});
		}, 7000);
	},
	status: function() {"use strict";
		// Start ping timer
		// TODO: Ping is not exactly accurate since request and response times may differ although it's the closest way I can think of right now
		localStorage.ping = new Date().getTime();

		// Do AJAX call
		$.ajax({
			url: "status/"+encodeURIComponent(localStorage.devicename)
		}).done(function( response ) {
			
			console.log(response);

			// Get time again to calculate ping
			localStorage.ping = (new Date().getTime() - localStorage.ping) / 2;
			$('#ping').html(localStorage.ping);

			// Song
			//audio.play();
			//audio.pause(); // we just load it now
			if (audio.src.indexOf(encodeURIComponent(response.song)) < 0) {
				audio.src = 'file/'+response.song;
			}

			// Playing state
			if (response.status) {
				audio.play();
			}

			// Position
			// reposition only if high unsync (2 seconds)
			if (audio.currentTime+2 < response.pos || audio.currentTime-2 > response.pos) {
				setTimeout(function() {audio.currentTime = response.pos + localStorage.ping/1000;}, 1);
				//console.log(response.pos +' - '+ localStorage.ping/1000);
			}


			// Volume
			//$('#vol').val(response.vol);
			//document.getElementById('audio').volume = response.vol/100;

			// Song info
			$('#track').html(response.song);
			//$('#track').html(response.song);

			// Update clients
			var clients = $('#clients>tbody'),
				status;
			clients.empty();
			for (var i = 0; i < response.clients.length; i++) {
				// Assign current status
				status = Math.round(new Date().getTime() / 1000);

				if (response.clients[i].name === localStorage.devicename) {
					status = 'you';
				}else if (status - response.clients[i].lastseen > 30) {
					status = 'offline';
				}else if (status - response.clients[i].lastseen < 10) {
					status = 'online';
				}else{
					status = 'idle';
				}

				clients.append( '<tr><td><i class="status '+status+'" title="'+status+'"></i> '+response.clients[i].name+'</td><td><input type="range" class="device-vol" data-devicename="'+response.clients[i].name+'" min="0" max="100" step="1" value="'+response.clients[i].vol+'"></td><td><input type="checkbox" id="device-status-'+i+'" class="device-status" data-devicename="'+response.clients[i].name+'"'+((response.clients[i].status===1)?' checked':'')+'><label for="device-status-'+i+'"></label></td></tr>' );
			}

		});
	},
	playlist: function() {"use strict";
		$.ajax({
			url: "playlist"
		}).done(function( response ) {
			for(var i in response) {
				$('#playlist').append('<li>'+response[i]+'</li>');
			}
		});
	},
	/*clients: function(){"use strict";
		$.ajax({
			url: "clients/"
		}).done(function( response ) {
			var clients = $('#clients>tbody'),
				status;
			clients.empty();
			for (var i = 0; i < response.length; i++) {
				// Assign current status
				status = Math.round(new Date().getTime() / 1000);

				if (response[i].name === localStorage.devicename) {
					status = 'you';
				}else if (status - response[i].lastseen > 30) {
					status = 'offline';
				}else if (status - response[i].lastseen < 10) {
					status = 'online';
				}else{
					status = 'idle';
				}

				clients.append( '<tr><td><i class="status '+status+'" title="'+status+'"></i> '+response[i].name+'</td><td><input type="range" class="device-vol" data-devicename="'+response[i].name+'" min="0" max="100" step="1" value="'+response[i].vol+'"></td><td><input type="checkbox" class="device-status" data-devicename="'+response[i].name+'"'+((response[i].status===1)?' checked':'')+'></td></tr>' );
			}
		});
	},*/
	file: function(file){"use strict";
		$.ajax({
			url: "file/"+file
		}).done(function( response ) {
			console.log(response);
		});
	},
	browse: function(path){"use strict";
		$.ajax({
			url: "browse/"+path
		}).done(function( response ) {
			$('#path').html( response.path );
			$('#browser').html('<li>..</li>');
			for(var i in response.files) {
				$('#browser').append('<li>'+response[i]+'</li>');
			}
		});
	},
	add: function(file){"use strict";
		$.ajax({
			url: "add/"+file
		}).done(function( response ) {
			if (response.status===1) {
				this.status();
			}else{
				this.msg(response.msg);
			}
		});
	},
	remove: function(file){"use strict";
		$.ajax({
			url: "remove/"+file
		}).done(function( response ) {
			if (response.status===1) {
				this.status();
			}else{
				this.msg(response.msg);
			}
		});
	},
	play: function(file){"use strict";
		if (typeof file === 'undefined') {file = '';}
		$.ajax({
			url: "play/"+file
		}).done(function( response ) {
			// TODO: Some code is duplicated in status, unify
			audio.src = '/file/'+file;
			// Song info
			$('#track').html(response.song);
			audio.play();
		});
	},
	pause: function(){"use strict";
		audio.pause();
		$.ajax({
			url: "pause"
		}).done(function( response ) {
			if (response.status===1) {
				this.status();
			}else{
				this.msg(response.msg);
			}
		});
	},
	pos: function(pos){"use strict";
		$.ajax({
			url: "pos/"+pos
		}).done(function( response ) {
			console.log(response);
		});
	},
	name: function(devicename){"use strict";
		localStorage.devicename = devicename;
	},
	client: function(devicename, enabled){"use strict";
		$.ajax({
			url: "client/"+devicename+"/"+enabled
		}).done(function( response ) {
			console.log(response);
		});
	},
	clientvol: function(devicename, vol){"use strict";
		$.ajax({
			url: "client/"+devicename+"/vol/"+vol
		}).done(function( response ) {
			console.log(response);
		});
	},
	delay: function(func, ms) {
		if (typeof ms === 'undefined') {ms = 500;}
		setTimeout(function(){func()}, ms);
	},
	nextSong: function() {
		var songs = [];
		$('#playlist>li').each(function() { songs.push($(this).text()) });
		for (var i = 0; i < songs.length; i++) {
			console.log($('#track').html() +'-'+ songs[i]);
			if ($('#track').html() === songs[i]) {
				OpenSound.play(songs[i+1]);
				break;
			}
		}
	}
};


// callback when song ends
$(audio).bind('ended', function(){
	OpenSound.nextSong();
});

/**
 *	EVENTS
 */
$('#playlist').on('click', 'li', function() {
	OpenSound.play( encodeURIComponent($(this).html()) );
});


$('#clients').on('mouseup', 'input.device-vol', function() {
	if ($(this).data('devicename')===localStorage.devicename) {
		document.getElementById('audio').volume = $(this).val()/100;
	}

	$.ajax({
		url: 'clientvol/'+encodeURIComponent($(this).data('devicename'))+'/'+$(this).val()
	}).done(function( response ) {
		console.log(response);
	});
});

$('#clients').on('change', 'input.device-status', function() {
	$.ajax({
		url: 'clientstatus/'+encodeURIComponent($(this).data('devicename'))+'/'+(($(this).prop('checked'))?1:0)
	}).done(function( response ) {
		console.log(response);
	});
});


$('#devicename').on('blur', function() {
	OpenSound.name( $(this).val() );
});


$('#play').on('click', function(){
	OpenSound.play($('#track').html());
});
$('#pause').on('click', function(){
	OpenSound.pause();
});


$(document).ready(function() {
	// Load local settings
	// Assign random name if none set
	if (typeof localStorage.devicename === 'undefined') {
		localStorage.devicename = 'device-'+Math.floor(Math.random()*999+100);
	}
	$('#devicename').val(localStorage.devicename);

	// Request server data
	OpenSound.playlist();
	//OpenSound.clients(); // TODO: remove once we do this in status() hash check
	OpenSound.status();

	// Set status timer
	setInterval(function() {OpenSound.status();}, OpenSound.config.interval*1000);

});
