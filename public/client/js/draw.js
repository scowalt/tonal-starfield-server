
// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas;
var context;
var canvasWidth = window.innerWidth - 15;
var tempHeight = window.innerHeight;
var canvasHeight = (tempHeight - 150);
var padding = 0;
var lineWidth = 8;
var clickX = [];
var clickY = [];
var clickColor = [];
var clickTool = [];
var clickSize = [];
var clickDrag = [];
var paint = false;
var curColor = '#00ff00';
//size of pen
var radius = 4;
var isClear = true; // is there nothing drawn by the user on the canvas?

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
function prepareCanvas()
{
	document.documentElement.requestFullscreen();
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasDiv.offsetWidth;);
	canvas.setAttribute('height', window.innerHeight - 150);
	canvas.setAttribute('id', 'canvas');
	canvas.setAttribute('style', 'left: 0px; top: 0px; border: 1px solid #000000;');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager !== 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext('2d'); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext('2d');
	
	canvas.addEventListener('touchstart', doTouchStart, false);
	canvas.addEventListener('touchmove', doTouchMove, false);
	canvas.addEventListener('touchend', doTouchEnd, false);
	window.addEventListener('resize', resizeCanvas, false);

	// Add mouse events
	// ----------------
	$('#canvas').mousedown(function(e)
	{
		// Mouse down location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		coords.push({x: mouseX, y: mouseY});

		paint = true;
		addClick(mouseX, mouseY, false);
		redraw();
	});
	
	$('#canvas').mousemove(function(e){
		if(paint===true){
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			coords.push({x: mouseX, y: mouseY});
			redraw();
		}
	});
	
	$('#canvas').mouseup(function(e){
		paint = false;
	  	redraw();
	});
	
	$('#canvas').mouseleave(function(e){
		paint = false;
	});

	drawHelpText();
}

function resizeCanvas() {
	console.log('resized to' + window.innerWidth + 'x' + window.innerHeight);
	var canvasDiv = document.getElementById('canvasDiv');
	var canvas = document.getElementById('canvas');
	canvasDiv.width = canvasDiv.offsetWidth;
	canvasDiv.height = window.innerHeight - 150;
	canvas.width = canvasDiv.offsetWidth;
	canvas.height = window.innerHeight - 150;
	canvasWidth = canvasDiv.offsetWidth;
	canvasHeight = window.innerHeight - 150;
	redraw();
	if (isClear){
		drawHelpText();
	}
}

function doTouchEnd(e){
	paint = false;
	redraw();
}

function doTouchStart(e){
	e.preventDefault();
	//var e = event.originalEvent;
	var mouseX = e.targetTouches[0].pageX;
	var mouseY = e.targetTouches[0].pageY;
	coords.push({x: mouseX, y: mouseY});

	paint = true;
	addClick(mouseX, mouseY, false);
	redraw();
}

function doTouchMove(e){
	e.preventDefault();
	//var e = event.originalEvent;
	if(paint===true){
			var mouseX = e.targetTouches[0].pageX;
			var mouseY = e.targetTouches[0].pageY;
			addClick(mouseX, mouseY, true);
			//$('#test').text(coords.length + ' mousex:' + mouseX + ' mousey:' + mouseY);
			coords.push({x: mouseX, y: mouseY});
			redraw();
		}
}

/**
* Adds a point to the drawing array.
* @param x
* @param y
* @param dragging
*/
function addClick(x, y, dragging)
{
	isClear = false;
	curColor = $('#colorpicker').val();
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
}

/**
* Clears the canvas.
*/

function erase()
{
	clickX = [];
	clickY = [];
	clickDrag = [];
	coords = [];
	outputNotes = [];
	clearCanvas();
	drawHelpText();
}

function clearCanvas()
{
	isClear = true;
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
 * Draw instructions onto the canvas
 */
function drawHelpText()
{
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	context.font = '48px serif';
	context.fillStyle = '#cccccc';
	context.textAlign = 'center';
	var x = canvas.width / 2;
	var y = canvas.height / 2;
	context.fillText('draw', x , y);
}

/**
* Redraws the canvas.
*/
function redraw()
{	
	clearCanvas();
	
	
	var i = 0;
	for(; i < clickX.length; i++)
	{		
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i], clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);

		context.closePath();
		
		context.lineJoin = 'round';
		context.lineWidth = radius;
		//setcolor
		context.strokeStyle = curColor;
		context.stroke();
		
	}
	context.restore();
	
}


/**/
