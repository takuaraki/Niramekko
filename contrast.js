navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ;
window.URL = window.URL || window.webkitURL ;

function initialize() {
	navigator.getUserMedia(
		{audio: true, video: true},
		function(stream) {
			var video = document.getElementById('video');
			video.src = URL.createObjectURL(stream);
			video.play();
			renderStart();
		},
		function(error) {
			console.error(error);
		}
	);
}

function renderStart() {
	var video = document.getElementById('video');
	var buffer = document.createElement('canvas');
	var display = document.getElementById('display_canvas');
	var bufferContext = buffer.getContext('2d');
	var displayContext = display.getContext('2d');
	var render = function() {
		requestAnimationFrame(render);
		var width = video.videoWidth;
		var height = video.videoHeight;
		if (width == 0 || height == 0) {return;}
		buffer.width = display.width = width;
		buffer.height = display.height = height;
		bufferContext.drawImage(video, 0, 0);
		
		var src = bufferContext.getImageData(0, 0, width, height); // 射影元
		var dest = bufferContext.createImageData(buffer.width, buffer.height); // 射影先
		
		for (var i = 0; i < dest.data.length; i += 4) {
			for (var c = 0; c < 3; c ++) {
				if (src.data[i+c] < 128) {
					dest.data[i+c] = 0;
				} else {
					dest.data[i+c] = 255;
				}
			}
			dest.data[i+3] = 255;
		}
		
		displayContext.putImageData(dest, 0, 0);
	};
	render();
}

window.addEventListener('load', initialize);