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

	this.velocity = new THREE.Vector3(
		-1 + 2 * Math.random(),
		-1 + 2 * Math.random(),
		-1 * Comet.speed
	);

	this.getLight = function(){
		return light;
	};

	this.getMesh = function(){
		return sprite;
	};

	this.updateMaterial = function(){
		// do nothing, as this function is just here to match the
		// Star prototype
	};

	this.updatePosition = function() {
		var position = light.position.add(this.velocity);
		light.position.copy(position);
		sprite.position.copy(position);
	};
};

// static variables
Comet.radius = 30;
Comet.geometry = new THREE.SphereGeometry(Comet.radius, 12, 12);
Comet.speed = 2;
Comet.lifespan = FAR / Comet.speed;
