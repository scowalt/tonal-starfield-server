// object
var Star = function(position, color, speed){
	// visuals
	var material = null;
	if (Math.random() < DULL_STAR_CHANCE) {
		material = new THREE.MeshBasicMaterial({
			color: Star.color
		});
	} else {
		material = new THREE.MeshLambertMaterial({
			combine: THREE.AddOperation,
			shininess: 100,
			color: Star.color
		});
	}
	var mesh = new THREE.Mesh(Star.geometry, material);
	mesh.position.set(position.x, position.y, position.z);
	mesh.material.color.setRGB(color.red, color.blue, color.green);

	var velocity = new THREE.Vector3(Math.random(), Math.random(), speed);

	this.getMesh = function(){
		return mesh;
	};

	this.updateMaterial = function(){
		material.needsUpdate = true;
	};

	this.updatePosition = function() {
		mesh.position.copy(mesh.position.add(velocity));
	};
};

// static variables
Star.radius = 10;
Star.geometry = new THREE.SphereGeometry(Star.radius, 12, 12);
Star.color = new THREE.Color('0xffffff');
