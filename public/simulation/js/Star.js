// object
var Star = function(position, color){
	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff
	});
	var mesh = new THREE.Mesh(Star.geometry, material);
	mesh.position.set(position.x, position.y, position.z);
	mesh.material.color.setRGB(color.red, color.blue, color.green);

	this.getMesh = function(){
		return mesh;
	};
};

// static variables
Star.geometry =  new THREE.SphereGeometry(2, 12, 12);
