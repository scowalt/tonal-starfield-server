var nCanvas;
var notesCanvasHeight = 100;
var notesCanvasWidth = 500;
//onload get img ready
var restimg = new Image();


function makeNoteCanvas(){
	// var nCanvas = document.getElementById('nCanvas');
	// nCanvas.setAttribute('width', 'auto');
	// nCanvas.setAttribute('height', notesCanvasHeight);
	// nCanvas.setAttribute('id', 'nCanvas');
	// nCanvas.setAttribute('style', 'left: 0px; top: 0px; border: 1px solid #000000;');
}

function fillNoteCanvas(){

	var nCanvas = document.getElementById('nCanvas');
    var c = nCanvas.getContext('2d');
    var whitespace = 0;
    var ycoordinate = 10;

    //clearing
    c.clearRect ( 0 , 0 , canvas.width, canvas.height );
	// draw the staff
    for (var i = 1; i <= 5; i++){
        c.strokeStyle = 'black';
        c.moveTo(0,ycoordinate);
        c.lineTo(canvas.width,ycoordinate);
        c.stroke();
        ycoordinate = ycoordinate + 15;
    }

    //draw 4 beat measure line
    c.moveTo(500/2, 10);
    c.lineTo(500/2, 4*15 + 10);
    c.stroke();

    drawNotes()
}

function drawNotes(){

    restimg.src = 'http://www.clipartbest.com/cliparts/Rcd/g6k/Rcdg6koc9.svg';
    var nCanvas = document.getElementById('nCanvas');
    var c = nCanvas.getContext('2d');
    notesCanvasWidth = nCanvas.width;
    notesCanvasHeight = nCanvas.height;

    console.log('drawing notes');
    console.log(outputNotes.slice(0,8));

    /*offset by 50px on each side*/
    var spacing = (notesCanvasWidth-100) / 8;
    var cur_time = 15;
    for (var i = 0; i < 8; i++){
        cur_time += spacing;

        if (outputNotes[i] == 0){
            c.drawImage(restimg, cur_time, 20, 20, 40);

        }
        else {
            var vertpos = notesCanvasHeight - outputNotes[i]*7.5;
            console.log(vertpos);
            c.beginPath();
            c.arc(cur_time, vertpos, 7.5, 0, Math.PI*2, true); 
            c.closePath();
            c.fill();
        }
        
    }
}

//1 is first of scale goes up to 16