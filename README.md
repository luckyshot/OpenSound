OpenSound
======================

<span style="font-size:120%">Free Open Source HTML5 alternative to Sonos</span>

OpenSound allows you to play music synchronized across many devices anywhere, in your home or office. So you can listen to the same playlist in your living room, bedroom and kitchen.



How it works
----------------------
OpenSound works in any device with a modern HTML5 browser (desktop computers, laptops, smartphones, tablets, iPods&hellip;). The browser connects to your OpenSound server and then you can control your music from any device.



Main features
----------------------
- Works through your WiFi network and even the Internet (the least latency the best)
- Create playlists and stream MP3 files
- Works in all modern browsers including iPods
- Small scalable code
- Responsive design is optimized for big screens and mobiles too
- Easy-to-use interface and UX
- Detect connected devices



Requirements
----------------------
- A computer with a music library and a web server installed (XAMPP, LAMP&hellip;)



Technology
----------------------
- HTML5
- JavaScript/jQuery
- PHP
- JSON API
(no database, file-based)




Roadmap
----------------------

These features are not part of the MVP although pretty cool to implement in the future:

- Latency detector for perfect sync (Alpha versions will use HTTP requests and detect the ping, in the future we will move to WebSockets or a higher performance protocol)
- Password protected access
- Cross-fade songs (using two audio tags)
- P2P (server-less) capability (there's solutions for it although we may need to reccur to Flash)
- iOS, Android, Firefox app
