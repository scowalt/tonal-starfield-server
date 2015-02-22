
// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas;
var context;
var tempWidth = window.innerWidth
var canvasWidth = tempWidth - 100;
var tempHeight = window.innerHeight;
var canvasHeight = (tempHeight - 200);
var padding = 25;
var lineWidth = 8;
var colorPurple = "#cb3594";
var clickX = [];
var clickY = [];
var clickColor = [];
var clickTool = [];
var clickSize = [];
var clickDrag = [];
var paint = false;
var curColor = colorPurple;
var curTool = "marker";
var curSize = "normal";
var sizeHotspotWidthObject = {};
sizeHotspotWidthObject.huge = 39;
sizeHotspotWidthObject.large = 25;
sizeHotspotWidthObject.normal = 18;
sizeHotspotWidthObject.small = 16;
var totalLoadResources = 8;
var curLoadResNum = 0;
/**
* Calls the redraw function after all neccessary resources are loaded.
*/
function resourceLoaded()
{
	//if(++curLoadResNum >= totalLoadResources){
		redraw();
	//}
}

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
function prepareCanvas()
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvas.setAttribute('style', 'border:1px solid #000000;')
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext("2d");
	
	canvas.addEventListener('touchstart', doTouchStart, false);
	canvas.addEventListener('touchmove', doTouchMove, false);
	canvas.addEventListener('touchend', doTouchEnd, false);

	// Add mouse events
	// ----------------
	$('#canvas').mousedown(function(e)
	{
		// Mouse down location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		$('#test').text(coords.length + ' mousex:' + mouseX + ' mousey:' + mouseY);
		coords.push({x: mouseX, y: mouseY});

		paint = true;
		addClick(mouseX, mouseY, false);
		redraw();
	});
	
	$('#canvas').mousemove(function(e){
		if(paint==true){
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			$('#test').text(coords.length + ' mousex:' + mouseX + ' mousey:' + mouseY);
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
/*
	//add touch events
	//equiv to mousedown
	$('#canvas').bind('touchstart', function(e) {
		// Mouse down location
		var mouseX = e.targetTouches[0].pageX - this.offsetLeft;
		var mouseY = e.targetTouches[0].pageY - this.offsetTop;
		$('#test').text(coords.length + ' mousex:' + mouseX + ' mousey:' + mouseY);
		coords.push({x: mouseX, y: mouseY});

		paint = true;
		addClick(mouseX, mouseY, false);
		redraw();
	});
	//equiv to mousemove
	$('#canvas').bind('touchmove', function(e) {
		if(paint==true){
			var mouseX = e.targetTouches[0].pageX - this.offsetLeft;
			var mouseY = e.targetTouches[0].pageY - this.offsetTop;
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			$('#test').text(coords.length + ' mousex:' + mouseX + ' mousey:' + mouseY);
			coords.push({x: mouseX, y: mouseY});
			redraw();
		}
	});
	//equiv to mouseup
	$('#canvas').bind('touchend', function(e) {
		paint = false;
		redraw();
	});

	*/
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
	if(paint==true){
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
	clickX.push(x);
	clickY.push(y);
	clickTool.push(curTool);
	clickColor.push(curColor);
	clickSize.push(curSize);
	clickDrag.push(dragging);
}

/**
* Clears the canvas.
*/
function clearCanvas()
{
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
* Redraws the canvas.
*/
function redraw()
{
	// parse what's on the canvas atm
	//parseCanvas();
	
	
	clearCanvas();
	
	var radius;
	var i = 0;
	for(; i < clickX.length; i++)
	{		
		if(clickSize[i] == "small"){
			radius = 2;
		}else if(clickSize[i] == "normal"){
			radius = 5;
		}else if(clickSize[i] == "large"){
			radius = 10;
		}else if(clickSize[i] == "huge"){
			radius = 20;
		}else{
			alert("Error: Radius is zero for click " + i);
			radius = 0;	
		}
		
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i], clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);

		context.closePath();
		
		context.lineJoin = "round";
		context.lineWidth = radius;
		context.stroke();
		
	}
	context.restore();
	
}


/**/
