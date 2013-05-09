OpenSound: Free Open-Source HTML5 Wireless Multi-Room Music System
======================

OpenSound allows you to play music synchronized across multiple devices (laptops, computers, smartphones, iPods&hellip;), so you can listen to music in multiple rooms: at home, office or anywhere else.





How it works
----------------------
OpenSound works in any device with a modern HTML5 browser (desktop computers, laptops, smartphones, tablets, iPods&hellip;). The browser connects to your OpenSound server and then you can control your music from any device. Navigate through your music folder, fill in a playlist and play/pause/skip songs which will be streamed simultaneously to all connected devices.



Why are we building this?
----------------------
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



Requirements
----------------------
- A computer with MP3s and a web server installed (XAMPP, LAMP&hellip;)
- Devices with a modern browser that support HTML5 <code>audio</code> and Internet connection



Setup
----------------------
. Start your web server in the computer with the music library
. Open the URL of the server in other devices (ie. <code>http://192.168.1.23/opensound/</code> )
. Add songs to the playlist and press Play :D




Technology
----------------------
- HTML5
- JavaScript/jQuery
- PHP
- JSON API
(no database, it's <a href="https://github.com/luckyshot/php-file-database">file-based</a> for simplicity)




Roadmap
----------------------
We are currently focusing on getting a prototype functioning. These features are not part of the MVP although pretty cool to implement in the future, so I've noted them down:

- Latency detector for perfect sync and gap-less playback (early versions will use HTTP requests and detect the ping, in the future we will move to WebSockets or a higher performance protocol)
- Get computer audio output so OpenSound is not limited to playing music through the browser but can actually stream music from Spotify and any other software (there's solutions for it although we may need to reccur to Flash)
- Multiple playlists
- IDE3 tags detection
- Password protected access
- Cross-fade songs (using two audio tags)
- P2P (server-less) capability (there's solutions for it although we may need to reccur to Flash)
- iOS, Android, Firefox OS apps
