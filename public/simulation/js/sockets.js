var Sockets = function(){
	this.lights = null;
	this.sound = null;

	this.lightsSocketConnect = function(){
		if (this.lights){
			this.lights.close();
		}
		this.lights = createSocket(LIGHTS_PORT);
	};

	this.soundSocketConnect = function(){
		if (this.sound){
			this.sound.close();
		}
		this.sound = createSocket(SOUND_PORT);
	};

	function createSocket(port){
		var socket = new WebSocket('ws://localhost:' + port);
		socket.open = ko.observable(false);
		socket.onopen = function(){
			this.open(true);
		};
		socket.onclose = function(){
			this.open(false);
		}
		return socket;
	}

	this.reconnect = function(){
		ko.cleanNode($('#lightsStatus')[0]);
		ko.cleanNode($('#soundStatus')[0]);
		this.lightsSocketConnect();
		this.soundSocketConnect();
		ko.applyBindings(this.lights, $('#lightsStatus')[0]);
		ko.applyBindings(this.sound, $('#soundStatus')[0]);
	}

	this.reconnect();
};
