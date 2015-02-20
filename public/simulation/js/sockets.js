var Sockets = function(){
	this.lights = null;
	this.sound = null;

	this.lightsSocketConnect = function(){
		this.lights = createSocket(LIGHTS_PORT);
	};

	this.soundSocketConnect = function(){
		this.sound = createSocket(SOUND_PORT);
	};

	function createSocket(port){
		var socket = new WebSocket('ws://localhost:' + port);
		socket.open = ko.observable(false);
		socket.onopen = function(){
			console.log('open');
			this.open(true);
		};
		socket.onclose = function(){
			console.log('close');
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
