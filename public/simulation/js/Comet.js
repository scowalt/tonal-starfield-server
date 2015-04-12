// object
var Comet = function(position, color){
	// visuals
	// glow
	// https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Simple-Glow.html
	var spriteMaterial = new THREE.SpriteMaterial({
		map: new THREE.ImageUtils.loadTexture('img/glow.png'),
		color: color.getHex(),
		transparent: false,
		blending: THREE.AdditiveBlending
	});
	var sprite = new THREE.Sprite(spriteMaterial);
	var scale = Comet.radius + 20;
	sprite.scale.set(scale,scale,scale);

	// point light
	var light = new THREE.PointLight(color.getHex(), 1, 5000);
	light.position.set(position.x, position.y, position.z);

	this.velocity = new CANNON.Vec3(
		-100 + 200 * Math.random(),
		-100 + 200 * Math.random(),
		-1 * Comet.speed
	);

	// physics
	var sphereBody = new CANNON.Body({
		mass: 5,
		position: new CANNON.Vec3(position.x, position.y, position.z),
		shape: new CANNON.Sphere(Comet.radius),
		velocity: this.velocity
	});

	this.getLight = function(){
		return light;
	};

	this.getMesh = function(){
		return sprite;
	};

	this.getBody = function () {
		return sphereBody;
	};

	this.updateMaterial = function(){
		// do nothing, as this function is just here to match the
		// Star prototype
	};

	this.updatePosition = function() {
		var position = sphereBody.position;
		var quaternion = sphereBody.quaternion;
		light.position.copy(position);
		light.quaternion.copy(quaternion);
		sprite.position.copy(position);
		sprite.quaternion.copy(quaternion);
	};
};

// static variables
Comet.radius = 30;
Comet.geometry = new THREE.SphereGeometry(Comet.radius, 12, 12);
Comet.speed = 100;
Comet.lifespan = FAR / Comet.speed;
