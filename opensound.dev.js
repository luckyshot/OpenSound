OpenSound = {
	config: {
		interval: 5
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
			$('#artist').html(response.song);
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
			console.log(response);
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
			console.log(response);
		});
	},
	add: function(file){"use strict";
		$.ajax({
			url: "add/"+file
		}).done(function( response ) {
			console.log(response);
		});
	},
	remove: function(file){"use strict";
		$.ajax({
			url: "remove/"+file
		}).done(function( response ) {
			console.log(response);
		});
	},
	play: function(file){"use strict";
		$.ajax({
			url: "play/"+file
		}).done(function( response ) {
			console.log(response);
		});
	},
	pause: function(){"use strict";
		$.ajax({
			url: "pause/"+file
		}).done(function( response ) {
			console.log(response);
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
	$.ajax({
		url: "play/"+encodeURIComponent($(this).html())
	}).done(function( response ) {
		var audio = document.getElementById('audio');
		audio.src = 'file/'+$(this).html();
		audio.play();
	});
});
$('#vol').on('change', function() {
	document.getElementById('audio').volume = $(this).val()/100;
	$.ajax({
		url: "vol/"+$(this).val()
	}).done(function( response ) {
		console.log('vol (change):');
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
	OpenSound.status();
	
	// Set status timer
	var t = setInterval(function() {OpenSound.status();}, OpenSound.config.interval*1000);
});
