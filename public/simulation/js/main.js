/**
 * Constants
 */
var STARS_PER_FRAME = 10;
var FIELD_OF_VIEW = 3000;
var ZOOM_SPEED = 7;

/**
 * Setting variables
 */
var maxVolume = 0.5;
var oldMaxVolume;
var paused = false;
var rotationSpeed = 0.05; // speed of camera rotation

/**
 * Scene variables
 */
var sound = new Sound();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, FIELD_OF_VIEW);
var renderer = new THREE.WebGLRenderer();
var geometry = new THREE.SphereGeometry(2, 12, 12);
var rotationCounter = 0;

/**
 * Setup
 */
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

/**
 * render() is used to generate each frame
 */
function render() {
	// debug info
	stats.begin();

	requestAnimationFrame(render);
	renderer.render(scene, camera);

	// zoom out camera
	if (!paused) {
		camera.position.z -= ZOOM_SPEED;
	}

	// remove far away objects from scene
	// http://stackoverflow.com/a/16613141/1222411
	var frustum = new THREE.Frustum();
	frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
	scene.children.forEach(function(object) {
		var visible = frustum.intersectsObject(object);
		if (!visible) {
			scene.remove(object);
		}
	});

	// add stars to scene
	if (!paused){
		for (var i = 0; i < STARS_PER_FRAME; i++) {
			var x = Math.floor(3 * Math.random() * window.innerWidth) - window.innerWidth * 1.5;
			var y = Math.floor(3 * Math.random() * window.innerHeight) - window.innerHeight * 1.5;
			var z = camera.position.z - FIELD_OF_VIEW;
			var star = new Star({x: x, y: y, z:z}, {red:1, blue:1, green:1});
			scene.add(star.getMesh());
		}
	}
	
	// rotate camera
	if (rotationCounter >= rotationSpeed){
		camera.rotateOnAxis(new THREE.Vector3(0,0,1), degInRad(rotationSpeed));
		rotationCounter -= rotationSpeed;
	} else if (rotationCounter <= (-1*rotationSpeed)){
		camera.rotateOnAxis(new THREE.Vector3(0,0,1), degInRad(-rotationSpeed));
		rotationCounter += rotationSpeed;
	}

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
	} else if (e.keyCode === 112) { // p
		paused = !paused;
	}
};

function degInRad(deg){
	return 0.0174 * deg;
}

document.onclick = spawnStar;

///**
// * Socket.io stuff
// */
//io = io.connect();
//io.on('play-note', function(data){
//	spawnStar({
//		'x': data['x-ratio'] * window.innerWidth,
//		'y': data['y-ratio'] * window.innerHeight
//	})
//})

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

	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff
	});
	var circle = new THREE.Mesh(geometry, material);
	circle.position.set(x, y, z);
	circle.material.color.setRGB(Math.random(), Math.random(), Math.random());
	scene.add(star.getMesh());
}

function rotate(){
	rotationCounter += 360;
}

render();
