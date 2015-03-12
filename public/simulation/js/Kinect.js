var Kinect = function(scene){
	var height = null;
	var width = null;
	var bodies = {};
	var sprites = {};

	this.messageHandler = function(message){
		var data = JSON.parse(message.data);
		if (data.Height && data.Width){
			// message contains information about sensor
			height = data.Height;
			width = data.Width;
		} else if(data.Joints && data.TrackingId) {
			// message contains body information
			var id = data.TrackingId;

			// if body is no longer being tracked
			if (data.LeanTrackingState === 0){
				// remove body from data structure
				delete bodies.id;
				scene.remove(sprites.id.left.getMesh());
				scene.remove(sprites.id.right.getMesh());
				delete sprites.id.left;
				delete sprites.id.right;
				delete sprites.id;

			} else {
				// add body to data structure
				bodies[id] = data;

				// create sprites
				if (!sprites.id) {
					sprites.id = {};
					var pos = {x:200, y:300, z:-2000};
					var color = new THREE.Color(0xffffff);
					sprites.id.left = new Comet(pos, color);
					sprites.id.right = new Comet(pos, color);
					scene.add(sprites.id.left.getMesh());
					scene.add(sprites.id.right.getMesh());
				}
			}
		} else {
			// message contains other information
			console.log(data);
		}
	};

	this.getBodies = function(){
		return bodies;
	};

	this.getSprites = function(){
		return sprites;
	}

	this.getDimensions = function(){
		return {
			width: width,
			height: height
		};
	};
};
