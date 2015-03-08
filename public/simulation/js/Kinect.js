var Kinect = function(){
	var height = null;
	var width = null;
	var bodies = {};

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
				delete bodies[id];
			} else {
				// add body to data structure
				bodies[id] = data;
			}
		} else {
			// message contains other information
			console.log(data);
		}
	};

	this.getBodies = function(){
		return bodies;
	};

	this.getDimensions = function(){
		return {
			width: width,
			height: height
		};
	};
};
