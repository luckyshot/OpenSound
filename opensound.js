OpenSound = {
	config: {
		interval: 5
	},
	tracklist: function() {"use strict";
		$.ajax({
			url: "tracklist"
		}).done(function( response ) {
			for(var i in response) {
				$('#playlist').append('<li>'+response[i]+'</li>');
			}
		});
	},
	status: function() {"use strict";
		$.ajax({
			url: "status/"+encodeURIComponent(localStorage.devicename)
		}).done(function( response ) {
			console.log(response);
			var audio = document.getElementById('audio');
			// Song
			console.log(audio.src);
			console.log('?action=file&value='+response.song);
			if (audio.src.indexOf(encodeURIComponent(response.song)) < 0) {
				audio.src = '?action=file&value='+response.song;
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
		audio.src = '?action=file&value='+$(this).html();
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
	localStorage.devicename = $(this).val();
});


$(document).ready(function() {
	// Load local settings
	if (typeof localStorage.devicename === 'undefined') {
		localStorage.devicename = 'device-'+Math.floor(Math.random()*999+100);
	}
	$('#devicename').val(localStorage.devicename);
	// Request server data
	OpenSound.tracklist();
	OpenSound.status();
	var t = setInterval(function() {OpenSound.status();}, OpenSound.config.interval*1000);
});
