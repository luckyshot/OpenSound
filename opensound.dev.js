OpenSound = {
	config: {
		interval: 5 // seconds
	},
	msg: function(msg, class) {"use strict";
		console.log(msg);
	},
	status: function(devicename) {"use strict";
		$.ajax({
			url: "status/"+encodeURIComponent(localStorage.devicename)
		}).done(function( response ) {
			console.log(response);
			var audio = document.getElementById('audio');
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
			// Volume
			$('#vol').val(response.vol);
			document.getElementById('audio').volume = response.vol/100;
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
			var clients = $('#clients>tbody');
			clients.empty();
			for (var i = 0; i < response.length; i++) {
				
				clients.append( '<tr><td><i class="ico"></i> '+response[i].name+'</td><td><input type="range" class="device-vol" data-devicename="'+response[i].name+'" min="0" max="100" step="1" value="'+response[i].vol+'"></td><td><input type="checkbox" class="device-status" data-devicename="'+response[i].name+'"'+((response[i].status===1)?' checked':'')+'></td></tr>' );
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
		$.ajax({
			url: "play/"+file
		}).done(function( response ) {
			var audio = document.getElementById('audio');
			audio.src = 'file/'+file;
			audio.play();
		});
	},
	pause: function(){"use strict";
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
		url: 'client/'+encodeURIComponent($(this).data('devicename'))+'/vol/'+$(this).val()
	}).done(function( response ) {
		console.log(response);
	});
});

$('#clients').on('change', 'input.device-status', function() {
	$.ajax({
		url: 'client/'+encodeURIComponent($(this).data('devicename'))+'/'+(($(this).prop('checked'))?'on':'off')
	}).done(function( response ) {
		console.log(response);
	});
});


$('#devicename').on('input paste', function() {
	OpenSound.name( $(this).val() );
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
