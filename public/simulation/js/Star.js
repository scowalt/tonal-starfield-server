// object
var Star = function(position, color){
	// visuals
	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff
	});
	var mesh = new THREE.Mesh(Star.geometry, material);
	mesh.position.set(position.x, position.y, position.z);
	mesh.material.color.setRGB(color.red, color.blue, color.green);

	// physics
	var sphereBody = new CANNON.Body({
		mass: 5,
		position: new CANNON.Vec3(position.x, position.y, position.z),
		shape: new CANNON.Sphere(Star.radius),
		velocity: Star.velocity
	});

	this.getMesh = function(){
		return mesh;
	};

	this.getBody = function () {
		return sphereBody;
	};

	this.updatePosition = function() {
		mesh.position.copy(sphereBody.position);
		mesh.quaternion.copy(sphereBody.quaternion);
	};
};

// static variables
Star.radius = 2;
Star.geometry = new THREE.SphereGeometry(Star.radius, 12, 12);
Star.velocity = new CANNON.Vec3(0,0,500);
