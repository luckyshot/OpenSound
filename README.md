OpenSound
======================

OpenSound allows you to play music synchronized across many devices (laptops, computers, smartphones, iPods...), so you can listen to music all across your home, office or anywhere else.

<span style="font-size:120%">Free Open-Source HTML5 alternative to Sonos</span>




How it works
----------------------
OpenSound works in any device with a modern HTML5 browser (desktop computers, laptops, smartphones, tablets, iPods&hellip;). The browser connects to your OpenSound server and then you can control your music from any device. Navigate through your music folder, fill in a playlist and play/pause/skip songs which will be streamed simultaneously to all connected devices.



Why I built this?
----------------------
I just got my own flat and considered setting up Sonos but that was a huge investment, thousands of euros&hellip; Also, I have got many speakers around and old iPods/laptops I would need to throw away or sell for nothing. So I came with the idea of OpenSound, HTML5 is able to do that. I can use my existing speakers, plug them into iPods and old laptops and voila! We got Sonos for free and without any hassle :) And it's Web, platform agnostic and open source&hellip; Awesome!



Main features
----------------------
- Works through your WiFi network and even the Internet (the least latency the best)
- Create playlists and stream MP3 files across all devices
- Works in all modern browsers including iPods and tablets
- Small scalable code
- Responsive design optimized for big screens and mobiles
- Easy-to-use revolutionary interface and UX
- Detects connected devices and allows fine-tunning volume and control
- Can be managed through any device, anywhere



Requirements
----------------------
- A computer with a music library and a web server installed (XAMPP, LAMP&hellip;)
- Devices with a modern browser and Internet connection



Technology
----------------------
- HTML5
- JavaScript/jQuery
- PHP
- JSON API
(no database, it's file-based for simplicity)




Roadmap
----------------------
These features are not part of the MVP although pretty cool to implement in the future:

- Latency detector for perfect sync (Alpha versions will use HTTP requests and detect the ping, in the future we will move to WebSockets or a higher performance protocol)
- Password protected access
- Cross-fade songs (using two audio tags)
- P2P (server-less) capability (there's solutions for it although we may need to reccur to Flash)
- iOS, Android, Firefox app
