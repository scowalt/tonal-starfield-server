function debugUpdate(){
	if (!lightsSocket){
		$('#lightsStatus').text('null');
	} else {
		$('#lightsStatus').text(lightsSocket.readyState);
	}
	if (!soundSocket){
		$('#soundStatus').text('null');
	} else {
		$('#soundStatus').text(soundSocket.readyState);
	}
}
