var painterElement = /** @type {HTMLCanvasElement} */ (document.getElementById("painter"));
var context = painterElement.getContext('2d');
var paint = false;
var lastPos = {x: 0, y: 0};
var /** @type {string} */mode = "Line";
// const drawingHistory = /** @type {(string | undefined)[]} */ ([]);
var historyPointer = -1;
const maxHistoryLength = 100;
var /** @type {Shape} */ currentObject;
var objectList = /** @type {(Shape)[]} */ ([]);
var /** @type {Object.<String, any>} */ config = {
	color: 'black',
};

// /* initialization */
// drawingHistory.push(context?.canvas.toDataURL());

// saveCanvasState();

function mousedown(/** @type {MouseEvent} */ e) {
	// setPosition(e);
	switch (mode) {
		case "Line":
			currentObject = new Line(config);
			break;
		case "Circle":
			currentObject = new Circle(config);
			break;
		case "Square":
			currentObject = new Square(config);
			break;
		default:
			break;
	}
	currentObject.startPos.x = e.pageX - painterElement.offsetLeft;
	currentObject.startPos.y = e.pageY - painterElement.offsetTop;
}

function mouseup(/** @type {MouseEvent} */ e) {
	// setPosition(e)
	objectList.push(currentObject);
	// saveCanvasState()
}

function mousemove(/** @type {MouseEvent} */ e) {
	var color = /** @type {HTMLInputElement} */ (document.getElementById('hex'))?.value;
	if (e.buttons != 1)
		return;
	currentObject.endPos.x = e.pageX - painterElement.offsetLeft;
	currentObject.endPos.y = e.pageY - painterElement.offsetTop;
	drawAllObjects();
}

function drawAllObjects() {
	objectList.forEach((object) => {
		object.draw(context);
	})
	currentObject.draw(context);
}

function setPosition(/** @type {MouseEvent} */ e) {
	lastPos.x = e.pageX;
	lastPos.y = e.pageY;
}

// painterElement?.addEventListener('mousedown', setPosition)

painterElement?.addEventListener('mousedown', mousedown)

painterElement?.addEventListener('mouseup', mouseup)

painterElement?.addEventListener('mousemove', mousemove)

document.getElementById("line")?.addEventListener('click', function(e) {
	console.log('draw line');
})

document.getElementById("square")?.addEventListener('click', function(e) {
	console.log('draw square');
})

document.getElementById("circle")?.addEventListener('click', function(e) {
	console.log('draw circle');
})

document.getElementById("pen")?.addEventListener('click', function(e) {
	console.log('draw pen');
})

document.getElementById("eraser")?.addEventListener('click', function(e) {
	console.log('draw eraser');
})

document.getElementById("download")?.addEventListener('click', function(e) {
	console.log('draw download');
})

document.getElementById("upload")?.addEventListener('click', function(e) {
	console.log('draw upload');
})

// document.getElementById("clear")?.addEventListener('click', function(e) {
// 	context?.clearRect(0, 0, context.canvas.width, context.canvas.height);
// 	drawingHistory.splice(0, drawingHistory.length)
// 	historyPointer = -1;
// 	saveCanvasState();
// })

// document.getElementById("undo")?.addEventListener('click', undo)

// document.getElementById("redo")?.addEventListener('click', redo)

// function saveCanvasState() {
// 	historyPointer++;
// 	const canvasState = context?.canvas.toDataURL();
// 	console.log(drawingHistory)
// 	drawingHistory.splice(historyPointer);
// 	drawingHistory.push(canvasState);
// 	if (historyPointer > maxHistoryLength) {
// 		drawingHistory.shift();
// 		historyPointer--;
// 	}
// 	console.log('end save ', drawingHistory);
// }

// function undo() {
// 	console.log('undo:', drawingHistory.length)
// 	if (historyPointer > 0) {
// 		const previousState = new Image();
// 		previousState.src = /** @type string */ (drawingHistory[historyPointer - 1]);
// 		previousState.onload = function () {
// 			context?.clearRect(0, 0, context.canvas.width, context.canvas.height); 
// 			context?.drawImage(previousState, 0, 0);
// 		};
// 		historyPointer--; // Remove the last canvas state
// 	}
// 	console.log('after undo:', drawingHistory.length)
// }

// function redo() {
// 	console.log('redo:', drawingHistory.length)
// 	if (historyPointer + 1 < drawingHistory.length) {
// 		const previousState = new Image();
// 		previousState.src = /** @type string */ (drawingHistory[historyPointer + 1]);
// 		previousState.onload = function () {
// 			context?.clearRect(0, 0, context?.canvas.width, context?.canvas.height);
// 			context?.drawImage(previousState, 0, 0);
// 		};
// 		historyPointer++;
// 	}
// 	console.log('after redo:', drawingHistory.length)
// }

// $('#painter').mousedown(function(e){
// 	var mouseX = e.pageX - this.offsetLeft;
// 	var mouseY = e.pageY - this.offsetTop;
		  
// 	paint = true;
// 	addDot(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
// 	redraw();
//   });
  
//   $('#painter').mousemove(function(e){
// 	if(paint){
// 	  addDot(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
// 	  redraw();
// 	}
//   });
  
//   // Mouse Up Event: Marker is off the paper; paint boolean will remember!
//   $('#painter').mouseup(function(e){
// 	paint = false;
//   });
  
//   // Mouse Leave Event: If the marker goes off the paper
//   $('#painter').mouseleave(function(e){
// 	paint = false;
//   });
  
//   //	user picks a color
//   $('.picker').on('click', function(e){
// 	  curColor = $(this).css('background-color');
//   });
  
//   //	user clears data
//   $('#btnClear').on('click', function(e){
// 	clickX = new Array();
// 	  clickY = new Array();
// 	  clickDrag = new Array();
// 	  clickColor = new Array();
// 	  clickSize = new Array();
// 	// Clears the canvas
// 	context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
//   })
  
//   //  save data
//   $('#btnSave').on('click', function(e){
// 	var canvas = document.getElementById('painter');
// 	var data = canvas.toDataURL();
// 	window.open(data);
//   });