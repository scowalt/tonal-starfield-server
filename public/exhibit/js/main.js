/**
 * Constants
 */
var STARS_PER_FRAME = 10;
var FIELD_OF_VIEW = 1500;
var ZOOM_SPEED = 7;

/**
 * Setting variables
 */
var maxVolume = 0.5;
var oldMaxVolume;
var paused = false;

/**
 * Scene variables
 */
var sound = new Sound();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, FIELD_OF_VIEW);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry(2, 12, 12);
camera.position.z = 5;

function render() {
	stats.begin();

	requestAnimationFrame(render);
	renderer.render(scene, camera);

	// zoom out camera
	if (!paused)
		camera.position.z -= ZOOM_SPEED;

	// remove far away objects from scene
	// http://stackoverflow.com/a/16613141/1222411
	var frustum = new THREE.Frustum();
	frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
	scene.children.forEach(function(object) {
		var visible = frustum.intersectsObject(object);
		if (!visible)
			scene.remove(object);
	});

	// add stars to scene
	if (!paused)
		for (var i = 0; i < STARS_PER_FRAME; i++) {
			var material = new THREE.MeshBasicMaterial({
				color: 0xffffff
			});
			var circle = new THREE.Mesh(geometry, material);
			circle.position.set(Math.floor(3 * Math.random() * window.innerWidth) - window.innerWidth * 1.5, Math.floor(3 * Math.random() * window.innerHeight) - window.innerHeight * 1.5, camera.position.z - FIELD_OF_VIEW);
			circle.material.color.setRGB(1, 1, 1);
			scene.add(circle);
		}

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

document.onkeypress = function onKeyPress(e) {
	e = e || window.event;
	console.log(e.keyCode);
	if (e.keyCode == 100) { // d
		if (stats.domElement.style.display === 'none') {
			stats.domElement.style.display = 'block';
		} else {
			stats.domElement.style.display = 'none';
		}
	} else if (e.keyCode == 109) { // m
		if (maxVolume == 0)
			maxVolume = oldMaxVolume;
		else {
			oldMaxVolume = maxVolume;
			maxVolume = 0;
		}
	} else if (e.keyCode == 112) { // p
		paused = !paused;
	}
}

document.onclick = spawnStar;

io = io.connect();

io.on('play-note', function(){
	spawnStar({
		'x': window.innerWidth / 2,
		'y': window.innerHeight / 2
	})
})

function spawnStar(e) {
	e = e || window.event;
	console.log(e);
	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff
	});
	var circle = new THREE.Mesh(geometry, material);
	circle.position.set(e.x - (window.innerWidth / 2), (window.innerHeight / 2) - e.y, camera.position.z - FIELD_OF_VIEW);
	sound.playNote(maxVolume / 5);
	circle.material.color.setRGB(Math.random(), Math.random(), Math.random());
	scene.add(circle);
}

render();
