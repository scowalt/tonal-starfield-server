/**
 * Setting variables
 */
var maxVolume = 0.5;
var oldMaxVolume;


/**
 * Scene variables
 */
var sound = new Sound();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, window.innerWidth / window.innerHeight, 0.1, FAR);
var renderer = new THREE.WebGLRenderer();
var rotationCounter = 0;
var lastTime = Date.now();
var stars = [];
var comets = [];

// cannon
var world = new CANNON.World();
world.gravity.set(0,0,0); // no gravity

// lighting
var light = new THREE.AmbientLight(0x5E5E5E);
scene.add(light);
var newLight = false;

/**
 * Setup
 */
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var sockets = new Sockets();

/**
 * render() is used to generate each frame
 */
function render() {
	// debug info
	stats.begin();

	// render frame
	requestAnimationFrame(render);
	renderer.render(scene, camera);

	// remove non-visble objects from scene
	// http://stackoverflow.com/a/16613141/1222411
	var frustum = new THREE.Frustum();
	frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
	stars.forEach(function(star, index){
		var mesh = star.getMesh();
		var visible = frustum.intersectsObject(mesh);
		if (!visible){
			removeStar(star, index);
		} else {
			star.updatePosition();
		}
	});

	if (newLight){
		stars.forEach(function(star){
			star.updateMaterial();
		});
		newLight = false;
	}

	// add stars to scene
	for (var i = 0; i < STARS_PER_FRAME; i++) {
		var pos = randomSpawnLocation();
		var color = {
			red: 1,
			blue: 1,
			green: 1
		};
		var speed = STAR_MIN_SPEED + STAR_SPEED_RANGE * Math.random();
		var star = new Star(pos, color, speed);
		addStar(star);
	}
	
	// rotate camera
	if (rotationCounter >= rotationSpeed){
		camera.rotateOnAxis(new THREE.Vector3(0,0,1), degInRad(rotationSpeed));
		rotationCounter -= rotationSpeed;
	} else if (rotationCounter <= (-1*rotationSpeed)){
		camera.rotateOnAxis(new THREE.Vector3(0,0,1), degInRad(-rotationSpeed));
		rotationCounter += rotationSpeed;
	}

	var time = Date.now();
	var dt = (time - lastTime) / 1000;
	lastTime = time;
	world.step(dt);

	// debug info
	stats.end();
}

/**
 * Stats
 */
var stats = new Stats();
stats.setMode(0);
stats.domElement.class = 'debug';
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
stats.domElement.style.display = 'none';
document.body.appendChild(stats.domElement);

/**
 * Event handlers
 */
document.onkeypress = function onKeyPress(e) {
	e = e || window.event;
	console.log(e.keyCode);
	if (e.keyCode === 100) { // d
		if (stats.domElement.style.display === 'none') {
			stats.domElement.style.display = 'block';
			$('.debug').css('display', 'block');
		} else {
			stats.domElement.style.display = 'none';
			$('.debug').css('display', 'none');
		}
	} else if (e.keyCode === 109) { // m
		if (maxVolume === 0) {
			maxVolume = oldMaxVolume;
		}
		else {
			oldMaxVolume = maxVolume;
			maxVolume = 0;
		}
	} else if (e.keyCode === 114) { // r
		rotate();
	}
};
document.onclick = spawnComet;

/**
 * Helper functions
 */
function degInRad(deg){
	return 0.0174 * deg;
}

function addStar(star) {
	scene.add(star.getMesh());
	if (star.getLight){
		scene.add(star.getLight());
	}
	world.add(star.getBody());
	stars.push(star);
}

function removeStar(star, index){
	scene.remove(star.getMesh());
	if (star.getLight){
		scene.remove(star.getLight());
	}
	world.remove(star.getBody());
	stars.splice(index, 1);
}

function spawnComet(e) {
	// get event
	e = e || window.event;

	// spawn star
	var x = (e.x - (window.innerWidth / 2))/2;
	var y = ((window.innerHeight / 2) - e.y)/2;
	var z = -200;

	var color = new THREE.Color();
	color.setHSL(Math.random(), 1, 0.5);
	var comet = new Comet({x:x, y:y, z:z}, color);
	addStar(comet);
	newLight = true;
	sockets.send({
		'event': 'comet',
		'color': comet.getLight().color,
		'lifespan': Comet.lifespan
	});
}

function rotate(){
	rotationCounter += 360;
}

// https://github.com/mrdoob/three.js/issues/1239
function randomSpawnLocation(){
	var verticalFOV = degInRad(camera.fov);
	var horizontalFOV = degInRad(camera.fov * camera.aspect);
	var distance = camera.far;
	var verticalRange = 2 * distance * Math.tan(verticalFOV / 2);
	var horizontalRange = 2 * distance * Math.tan(horizontalFOV / 2);
	var x = 2 * Math.random() * horizontalRange - horizontalRange / 2 + camera.position.x;
	var y = 2 * Math.random() * verticalRange - verticalRange / 2 + camera.position.y;
	var z = camera.position.z - distance;
	return new THREE.Vector3(x,y,z);
}

/**
 * Start rendering
 */
render();

/**
 * Server socket
 */
var serverSocket = io();
serverSocket.on('comet', function(data){
	spawnComet({
		x: Math.random()*window.innerWidth,
		y: Math.random()*window.innerHeight
	});
});
