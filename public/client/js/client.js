$(document).ready(function onReady() {
	io = io.connect();

	$(document).click(function onClick(e) {
		io.emit('play-note', {
			'x-ratio': e.pageX / window.innerWidth,
			'y-ratio': e.pageY / window.innerHeight
		});
	});
});