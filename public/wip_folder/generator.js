//todo list to return:
//color
//play these notes
//play these chords
//return a hue value from 0 to 1 for timbre maybe'
//in outputlist of notes, 1 can signify a rest

//var notesList = Array();
var outputNotes = Array();
//if sequencer, only use a few of the densely populated grids
var chordlist = [
[0,2,4],
[1,3,5],
[2,4,6],
[3,5,7],
[4,6,8]
];

var chord1, chord2, chord3, chord4;

//sort ascending x
function sortX(a, b) {
	return a.x - b.x;
}

//sort ascending y
function sortY(a, b) {
	return a.y - b.y;
}


function getMeanInRange(low, high) {
	var sum = 0;
	var count = 1;
	
	for(var i = 0; i < coords.length; i++){
		if(coords[i].x > low && coords[i].x < high){
			sum += coords[i].y;
			count++;
		}
	}
	var mean = sum/count;
	//console.log(Math.floor(mean))

	context.moveTo(low, mean);
    context.lineTo(high, mean);
    context.strokeStyle = '#ff0000';
    context.stroke();

	return Math.floor(mean);
}

function getMaxInRange(low, high) {
	var curMax = 0;
	
	for(var i = 0; i < coords.length; i++){
		if(coords[i].x > low && coords[i].x < high){
			if(coords[i].y > curMax)
				curMax = coords[i].y;
		}
	}
	return curMax;
}

function getMinInRange(low, high) {
	var curMin = 9999;
	
	for(var i = 0; i < coords.length; i++){
		if(coords[i].x > low && coords[i].x < high){
			if(coords[i].y < curMin)
			curMin = coords[i].y;
		}
	}
	return curMin;
}

function pseudorandom(){
	return 0.5;
}

function convertMeanToNum(minY, maxY, mean){
	//divide into n sections
	var n = 10
	var sectionsize = (maxY-minY)/n;
	var num = 1
	for(var i = minY; i < maxY; i+=sectionsize){

		if(mean > i && mean < (i + sectionsize)){
			console.log(num);
			return num;
		}
		num++;
	}
	return num;
}

function parseCanvas() {
	coords.sort(sortX);
	//$('#coords').text(JSON.stringify(coords));
	
	var minX = coords[0].x;
	var maxX = coords[coords.length-1].x;
	var thisrange = maxX - minX;

	coords.sort(sortY)
	var minY = coords[0].y;
	var maxY = coords[coords.length-1].y;
	var sectionsize = thisrange/range;
/*
	var outputChords = Array();

	//split signature range into n parts for n notes
	
	for(var i = minX; i < maxX; i += sectionsize){
		var curmean = getMeanInRange(i, i+sectionsize);
		//outputChords.push()
	}
*/
	context.lineWidth = 2;
	outputNotes = []	
	for(var i = minX; i < maxX; i += sectionsize){
		context.moveTo(i, 0);
		context.lineTo(i, context.canvas.height);
		context.stroke();
		var curmean = getMeanInRange(i, i+sectionsize);
		outputNotes.push(convertMeanToNum(getMinInRange(i, i+sectionsize), getMaxInRange(i, i+sectionsize), curmean));
	}
	context.moveTo(maxX, 0);
	context.lineTo(maxX, context.canvas.height);
	context.stroke();

	//alert('range: ' + thisrange + ' left: ' + minX + ' right: ' + maxX);

	$('#coords').text(JSON.stringify(outputNotes));
}
