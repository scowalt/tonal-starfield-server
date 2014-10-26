$(document).ready(function onReady() {
	io = io.connect();

	$("#test-button").click(function onClick(e) {
		io.emit('play-note', {});
	});
});