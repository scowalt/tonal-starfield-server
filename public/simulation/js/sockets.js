var lightsSocket = null;
var soundSocket = null;

function lightsSocketConnect(){
	lightsSocket = new WebSocket('ws://localhost:' + LIGHTS_PORT);
	debugUpdate();
}

function soundSocketConnect(){
	soundSocket = new WebSocket('ws://localhost:' + SOUND_PORT);
	debugUpdate();
}

function socketConnected(socket){
	return socket && socket.readyState === socket.OPEN;
}

lightsSocketConnect();
soundSocketConnect();
