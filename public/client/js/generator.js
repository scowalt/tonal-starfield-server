//todo list to return:
//color
//play these notes
//play these chords

var coords = [];
var outputNotes = [];
var rangeofnotes = 16;
var melodyLength = 8;
var colorname = '';

var tempsum_ofnotes = 0;

//sort ascending x
function sortX(a, b) {
	return a.x - b.x;
}

//sort ascending y
function sortY(a, b) {
	return a.y - b.y;
}


//for finding 
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
	return Math.floor(mean);
}

function getMaxInRange(low, high) {
	var curMax = 0;
	
	for(var i = 0; i < coords.length; i++){
		if(coords[i].x > low && coords[i].x < high){
			if(coords[i].y > curMax){
				curMax = coords[i].y;
			}
		}
	}
	return curMax;
}

function getMinInRange(low, high) {
	var curMin = 9999;
	
	for(var i = 0; i < coords.length; i++){
		if(coords[i].x > low && coords[i].x < high){
			if(coords[i].y < curMin){
				curMin = coords[i].y;
			}
		}
	}
	return curMin;
}

function convertMeanToNum(minY, maxY, mean){
	//divide into n sections
	var n = rangeofnotes;
	var sectionsize = (maxY-minY)/n;
	console.log('sectionsize: ' + sectionsize);
	var num = 1;
	for(var i = minY; i < maxY; i+=sectionsize){
	//for(var i = 0; i < window.innerHeight; i+=sectionsize){

		if(mean > i && mean < (i + sectionsize)){
			//console.log(num);
			return num;
		}
		num++;
	}
	return num;
}

function parseCanvas() {

	coords.sort(sortX);
	
	var minX = coords[0].x;
	var maxX = coords[coords.length-1].x;
	var range = maxX - minX;

	coords.sort(sortY);
	/*
	var minY = coords[0].y;
	var maxY = coords[coords.length-1].y;
	*/
	var minY = 0;
	var maxY = canvasHeight;
	outputNotes = [];

	//split signature range into n parts for n notes
	var sectionsize = range/melodyLength;
	for(var j = minX; j < maxX; j += sectionsize){
		var notecurmean = getMeanInRange(j, j+sectionsize);
		tempsum_ofnotes += (rangeofnotes - convertMeanToNum(minY, maxY, notecurmean));
		
		if(tempsum_ofnotes > 14){
			outputNotes.pop();
			outputNotes.push(0);
			tempsum_ofnotes = 0;
		}
		
		//outputNotes.push(convertMeanToNum(getMinInRange(j, j+sectionsize), getMaxInRange(j, j+sectionsize), notecurmean));
		outputNotes.push(1 + rangeofnotes - convertMeanToNum(minY, maxY, notecurmean));
	}

	var n_match  = ntc.name(curColor);
	colorname = n_match[1];
	console.log(colorname);
	console.log(outputNotes);
}


