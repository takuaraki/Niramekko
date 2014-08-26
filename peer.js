navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ;
window.URL = window.URL || window.webkitURL ;

var PEERJS_API_KEY = 'irddn8i4n2s7zaor';
var peer = null;
var selfid = null;
var localStream = null;

function initializePeer(callback) {
	peer = new Peer({key: PEERJS_API_KEY});
	
	peer.on('open', function(id) {
		selfid = id;
		var localID = document.getElementById('localID');
		localID.innerHTML = selfid ;
		callback();
	});
	peer.on('call', function(mediaConnection) {
		mediaConnection.answer(localStream);
		settingMediaConnection(mediaConnection);
	});
	peer.on('close', function() {
		peer.destroy();
	});
	peer.on('error', function(err) {
		console.error(err);
	});
}

function initializeMedia(callback) {
	navigator.getUserMedia(
		{audio: true, video: true},
		function(stream) {
			localStream = stream;
			var video = document.getElementById('local');
			video.src = URL.createObjectURL(stream);
			video.play();
			callback();
		},
		function(error) {
			console.error(error);
		}
	);
}

function settingMediaConnection(mediaConnection) {
	var remoteid = mediaConnection.peer;
	var remoteStream = null;
	var video = null;
	mediaConnection.on('stream', function(stream) {
		video = document.createElement('video');
		video.style.width = "400px";
		video.style.height = "300px";
		video.src = URL.createObjectURL(stream);
		video.play();
		var parent = document.getElementById('remotes');
		parent.appendChild(video);
	});
	mediaConnection.on('close', function() {
		URL.revokeObjectURL(video.src);
		video.parentNode.removeChild(video);
	});
	mediaConnection.on('error', function() {
		console.error(err);
	});
}

function initialize() {
	initializePeer(function() {
		initializeMedia(function() {
			var remoteID = document.getElementById('remoteID');
			var call = document.getElementById('call');
			
			call.onclick = function(){
				var id = remoteID.value;
				var mediaConnection = peer.call(id, localStream);
				settingMediaConnection(mediaConnection);
			};
		});
	});
}
window.addEventListener('load', initialize);



