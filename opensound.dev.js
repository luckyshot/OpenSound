// Global variables
var audio = document.getElementById('audio');

OpenSound = {
	config: {
		interval: 5, // seconds
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
	status: function(devicename) {"use strict";
		// Start ping timer
		localStorage.ping = new Date().getTime();
		
		// Do AJAX call
		$.ajax({
			url: "status/"+encodeURIComponent(localStorage.devicename)
		}).done(function( response ) {
			// Get time again to calculate ping
			localStorage.ping = new Date().getTime() - localStorage.ping;

			console.log(response);

			// Song
			console.log(audio.src);
			console.log('file/'+response.song);
			if (audio.src.indexOf(encodeURIComponent(response.song)) < 0) {
				audio.src = 'file/'+response.song;
				audio.play();
			}
			// Position
			//if (audio.currentTime - response.pos < 10 && audio.currentTime - response.pos < 10) {
			//
			//}else{
			//	audio.currentTime = response.pos;
			//}
			// Playing?
			(response.status===1) ? audio.play() : audio.pause();
			// Volume
			//$('#vol').val(response.vol);
			//document.getElementById('audio').volume = response.vol/100;
			// Song info
			$('#track').html(response.song);
			//$('#track').html(response.song);
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
	clients: function(){"use strict";
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

				clients.append( '<tr><td><i class="status '+status+'" title="'+status+'"></i> '+response[i].name+'</td><td><input type="range" class="device-vol" data-devicename="'+response[i].name+'" min="0" max="100" step="1" value="'+response[i].vol+'"></td><td><input type="checkbox" class="device-status" data-devicename="'+response[i].name+'"'+((response[i].status==1)?' checked':'')+'></td></tr>' );
			}
		});
	},
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
		if (typeof file === 'undefined') file = '';
		$.ajax({
			url: "play/"+file
		}).done(function( response ) {
			audio.src = '/file/'+file;
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
	ping: function() {"use strict";
		$.ajax({
			url: "ping/"+localStorage.devicename
		}).done(function( response ) {
			if (response.status===1) {
				$.ajax({
					url: "ping2/"+localStorage.devicename
				}).done(function( response ) {
					if (response.status===1) {
						response.ping
					}else{
						this.msg = response.msg;
					} 
				});
			}
		});		
	}
};

/**
 *	EVENTS
 */
$('#playlist').on('click', 'li', function() {
	OpenSound.play( encodeURIComponent($(this).html()) );
});


$('#clients').on('change', 'input.device-vol', function() {
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


$('#devicename').on('input paste', function() {
	OpenSound.name( $(this).val() );
});


$('#play').on('click', function(){
	OpenSound.play();
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
	OpenSound.clients(); // TODO: remove once we do this in status() hash check
	OpenSound.status();
	
	// Set status timer
	var t = setInterval(function() {OpenSound.status();}, OpenSound.config.interval*1000);
});
