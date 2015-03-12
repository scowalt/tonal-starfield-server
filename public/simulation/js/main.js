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
var renderer = new THREE.WebGLRenderer({
	alpha: true
});
var rotationCounter = 0;
var lastTime = Date.now();
var stars = [];
var comets = [];
var windowResize = new THREEx.WindowResize(renderer, camera);

// cannon
var world = new CANNON.World();
world.gravity.set(0,0,0); // no gravity

// lighting
var light = new THREE.AmbientLight(0x3e3e3e);
scene.add(light);
var newLight = false;

/**
 * Setup
 */
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var kinect = new Kinect(scene);
var sockets = new Sockets();
sockets.kinect = kinect;

var engine = new ParticleEngine();
var settings = {
	positionStyle : Type.CUBE,
	positionBase : new THREE.Vector3( 0, 0, -100 ),
	positionSpread : new THREE.Vector3( 10, 0, 10 ),
	velocityStyle : Type.CUBE,
	velocityBase : new THREE.Vector3( 0, 150, 0 ),
	velocitySpread : new THREE.Vector3( 80, 50, 80 ),
	accelerationBase : new THREE.Vector3( 0,-10,0 ),
	particleTexture : THREE.ImageUtils.loadTexture( 'images/smokeparticle.png'),
	angleBase : 0,
	angleSpread : 720,
	angleVelocityBase : 0,
	angleVelocitySpread : 720,
	sizeTween : new Tween( [0, 1], [32, 128] ),
	opacityTween : new Tween( [0.8, 2], [0.5, 0] ),
	colorTween : new Tween( [0.4, 1], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),
	particlesPerSecond : 200,
	particleDeathAge : 2.0,
	emitterDeathAge : 60
};
engine.setValues(settings);
engine.initialize();

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

	comets.forEach(function(comet, index){
		var mesh = comet.getMesh();
		var visible = frustum.intersectsObject(mesh);
		if (mesh.position.z < camera.position.z - 200 && !visible){
			removeComet(comet, index);
		} else {
			comet.updatePosition();
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

	// kinect physics
	var index = 0;
	var bodies = kinect.getBodies();
	for (var id in bodies){
		var body = bodies[id];
		var hands = [body.Joints.HandLeft, body.Joints.HandRight];
		hands.forEach(function(hand, index){
			var comet = comets[index];
			if (comet){
				index++;
				comet.interactWith(hand);
			}
			var dimensions = getBackdropDimensions();
			var x = hand.Position.X * dimensions.width / 4;
			var y = hand.Position.Y * dimensions.height / 4;
			var z = -2000;
			kinect.getSprites().id.left.getMesh().position.set(x, y, z);
		});
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

	engine.update( 0.01 * 0.5 );

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
	if (e.keyCode === 'd'.charCodeAt(0)) {
		if (stats.domElement.style.display === 'none') {
			stats.domElement.style.display = 'block';
			$('.debug').css('display', 'block');
		} else {
			stats.domElement.style.display = 'none';
			$('.debug').css('display', 'none');
		}
	} else if (e.keyCode === 'm'.charCodeAt(0)) {
		if (maxVolume === 0) {
			maxVolume = oldMaxVolume;
		}
		else {
			oldMaxVolume = maxVolume;
			maxVolume = 0;
		}
	} else if (e.keyCode === 'r'.charCodeAt(0)) {
		rotate();
	} else if (e.keyCode === 'f'.charCodeAt(0)) {
		screenfull.toggle(document.body);
		windowResize.trigger();
	}
};
document.onclick = spawnComet;
window.onresize = windowResize.trigger;

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

function addComet(comet){
	scene.add(comet.getMesh());
	scene.add(comet.getLight());
	world.add(comet.getBody());
	comets.push(comet);
}

function removeStar(star, index){
	scene.remove(star.getMesh());
	if (star.getLight){
		scene.remove(star.getLight());
	}
	world.remove(star.getBody());
	stars.splice(index, 1);
}

function removeComet(comet, index){
	scene.remove(comet.getMesh());
	scene.remove(comet.getLight());
	world.remove(comet.getBody());
	comets.splice(index, 1);
}

function spawnComet(e, data) {
	// get event
	e = e || window.event;

	// spawn star
	var x = (e.x - (window.innerWidth / 2))/2;
	var y = ((window.innerHeight / 2) - e.y)/2;
	var z = -100;

	var color = new THREE.Color();
	if (data) {
		color.setHex(parseInt(data.color.replace('#', ''), 16));
	} else {
		color.setHSL(Math.random(), 1, 0.5);
	}
	var comet = new Comet({x:x, y:y, z:z}, color);
	addComet(comet);
	newLight = true;
	var message = {
		'event': 'comet', // comet spawning
		'color': comet.getLight().color, // r g b from 0 to 1
		'colorHSL': comet.getLight().color.getHSL(), // h s l from 0 to 1
		'lifespan': Comet.lifespan // lifespan in seconds
	};
	if (data){
		message.melody = data.melody;
	}
	sockets.send(message);
}

function rotate(){
	rotationCounter += 360;
}

// https://github.com/mrdoob/three.js/issues/1239
function randomSpawnLocation(){
	var dist = camera.far;
	var dimensions = getBackdropDimensions();
	var width = dimensions.width;
	var height = dimensions.height;
	var x = 2 * Math.random() * width - width / 2 + camera.position.x;
	var y = 2 * Math.random() * height - height / 2 + camera.position.y;
	var z = camera.position.z - dist;
	return new THREE.Vector3(x,y,z);
}

function getBackdropDimensions(){
	var aspect = camera.aspect;
	var vFOV = degInRad(camera.fov);
	var hFOV = 2 * Math.atan( Math.tan( vFOV / 2 ) * aspect );
	var dist = camera.far;
	var height = 2 * Math.tan( ( vFOV / 2 ) ) * dist;
	var width = 2 * Math.tan( ( hFOV / 2 ) ) * dist;
	return {
		width: width,
		height: height
	};
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
	}, data);
});
