// object
var Star = function(position, color, speed){
	// visuals
	var material = null;
	if (Math.random() < DULL_STAR_CHANCE) {
		material = new THREE.MeshBasicMaterial({
			color: Star.color
		})
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

	// physics
	var velocity = new CANNON.Vec3(0,0,speed);
	var sphereBody = new CANNON.Body({
		mass: 5,
		position: new CANNON.Vec3(position.x, position.y, position.z),
		shape: new CANNON.Sphere(Star.radius),
		velocity: velocity
	});

	this.getMesh = function(){
		return mesh;
	};

	this.getBody = function () {
		return sphereBody;
	};

	this.updateMaterial = function(){
		material.needsUpdate = true;
	};

	this.updatePosition = function() {
		mesh.position.copy(sphereBody.position);
		mesh.quaternion.copy(sphereBody.quaternion);
	};
};

// static variables
Star.radius = 10;
Star.geometry = new THREE.SphereGeometry(Star.radius, 12, 12);
Star.color = new THREE.Color('0xffffff');
