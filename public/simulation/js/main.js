/**
 * Setting variables
 */
var maxVolume = 0.5;
var oldMaxVolume;
var rotationSpeed = 0.05; // speed of camera rotation

/**
 * Scene variables
 */
var sound = new Sound();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, FIELD_OF_VIEW);
var renderer = new THREE.WebGLRenderer();
var rotationCounter = 0;
var lastTime = Date.now();
var stars = [];

// cannon
var world = new CANNON.World();
world.gravity.set(0,0,0); // no gravity

/**
 * Setup
 */
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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

	// add stars to scene
	for (var i = 0; i < STARS_PER_FRAME; i++) {
		var x = Math.floor(3 * Math.random() * window.innerWidth) - window.innerWidth * 1.5;
		var y = Math.floor(3 * Math.random() * window.innerHeight) - window.innerHeight * 1.5;
		var z = camera.position.z - FIELD_OF_VIEW;
		var star = new Star({x: x, y: y, z:z}, {red:1, blue:1, green:1});
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
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
stats.domElement.style.display = 'none';
document.body.appendChild(stats.domElement);

/**
 * Key press handler
 */
document.onkeypress = function onKeyPress(e) {
	e = e || window.event;
	console.log(e.keyCode);
	if (e.keyCode === 100) { // d
		if (stats.domElement.style.display === 'none') {
			stats.domElement.style.display = 'block';
		} else {
			stats.domElement.style.display = 'none';
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

function degInRad(deg){
	return 0.0174 * deg;
}

document.onclick = spawnStar;

function addStar(star) {
	scene.add(star.getMesh());
	world.add(star.getBody());
	stars.push(star);
}

function removeStar(star, index){
	scene.remove(star.getMesh());
	world.remove(star.getBody());
	stars.splice(index, 1);
}

function spawnStar(e) {
	// get event
	e = e || window.event;
	console.log(e);

	// play note
	sound.playNote(maxVolume / 5);

	// spawn star
	var x = e.x - (window.innerWidth / 2);
	var y = (window.innerHeight / 2) - e.y;
	var z = camera.position.z - FIELD_OF_VIEW;

	var star = new Star({x:x, y:y, z:z}, {red: Math.random(), blue: Math.random(), green: Math.random()});
	addStar(star);
}

function rotate(){
	rotationCounter += 360;
}

render();

/**
 * Socket.io
 */
var socket = io();
socket.on('comet', function(data){
	console.log('COMET');
	spawnStar({
		x: Math.random()*window.innerWidth,
		y: Math.random()*window.innerHeight
	});
});
