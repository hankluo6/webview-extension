var painterElement = /** @type {HTMLCanvasElement} */ (document.getElementById("painter"));
var context = painterElement.getContext('2d');
var paint = false;
var lastPos = {x: 0, y: 0};
var /** @type {string} */mode = "Pen";
// const drawingHistory = /** @type {(string | undefined)[]} */ ([]);
var historyPointer = -1;
const maxHistoryLength = 100;
var /** @type {Shape} */ currentObject;
var objectList = /** @type {(Shape)[]} */ ([]);
var /** @type {Object.<String, any>} */ config = {
	color: "white",
	lineWidth: 10,
	globalCompositeOperation: "source-over",
	lineCap: "round",
};

const uploadButton = document.getElementById("image-upload");
uploadButton?.addEventListener('change', handleImageUpload);

function mousedown(/** @type {MouseEvent} */ e) {
	// setPosition(e);
	switch (mode) {
		case "Pen":
			currentObject = new LineList(getConfig());
			break;
		case "Line":
			currentObject = new Line(getConfig());
			break;
		case "Circle":
			currentObject = new Circle(getConfig());
			break;
		case "Square":
			currentObject = new Square(getConfig());
			break;
		case "Eraser":
			currentObject = new Eraser(getConfig());
		default:
			break;
	}
	if (historyPointer + 1 != objectList.length) {
		objectList.splice(historyPointer + 1);
	}
	objectList.push(currentObject);
	historyPointer++;

	currentObject.startPos.x = e.pageX - painterElement.offsetLeft;
	currentObject.startPos.y = e.pageY - painterElement.offsetTop;
}

function mouseup(/** @type {MouseEvent} */ e) {
	currentObject.endPos.x = e.pageX - painterElement.offsetLeft;
	currentObject.endPos.y = e.pageY - painterElement.offsetTop;
}

function mousemove(/** @type {MouseEvent} */ e) {
	if (e.buttons != 1)
		return;
	if (currentObject instanceof LineList) {
		currentObject.endPos.x = e.pageX - painterElement.offsetLeft;
		currentObject.endPos.y = e.pageY - painterElement.offsetTop;
		const line = new Line(currentObject.config);
		line.set(currentObject.startPos, currentObject.endPos);
		currentObject.push(line);

		currentObject.startPos.x = e.pageX - painterElement.offsetLeft;
		currentObject.startPos.y = e.pageY - painterElement.offsetTop;
	} else {
		currentObject.endPos.x = e.pageX - painterElement.offsetLeft;
		currentObject.endPos.y = e.pageY - painterElement.offsetTop;
	}
	
	drawAllObjects();
}

function drawAllObjects() {
	context?.clearRect(0, 0, context.canvas.width, context.canvas.height);
	for (let i = 0; i < historyPointer + 1; ++i) {
		objectList[i].draw(context);
	}
}

painterElement?.addEventListener('mousedown', mousedown)

painterElement?.addEventListener('mouseup', mouseup)

painterElement?.addEventListener('mousemove', mousemove)

document.getElementById("line")?.addEventListener('click', function(e) {
	mode = "Line";
})

document.getElementById("square")?.addEventListener('click', function(e) {
	mode = "Square";
})

document.getElementById("circle")?.addEventListener('click', function(e) {
	mode = "Circle";
})

document.getElementById("pen")?.addEventListener('click', function(e) {
	mode = "Pen"
})

document.getElementById("eraser")?.addEventListener('click', function(e) {
	mode = "Eraser"
})

document.getElementById("clear")?.addEventListener('click', function(e) {
	clearCanvas();
	drawAllObjects();
})

document.getElementById("download")?.addEventListener('click', function(e) {
	const downloadLink = document.createElement('a');
	downloadLink.href = painterElement.toDataURL();
	downloadLink.download = 'canvas_image.png';
	downloadLink.click();
})

function getConfig() {
	return {
		color: /** @type {HTMLInputElement} */ (document.getElementById('hex'))?.value,
		lineWidth: 10,
		globalCompositeOperation: "source-over",
		lineCap: "round",
	}
}

/**
 * @this {HTMLInputElement}
 */
function handleImageUpload() {
	const file = this.files?.[0];
	// Create a FileReader object
	const reader = new FileReader();
	if (file) {
		reader.readAsDataURL(file);
		// Set the onload event handler
		reader.onload = function () {
			// Create a new image element
			const image = new Image();
			// When the image is loaded, draw it on the canvas
			image.onload = function () {
				// Draw the image on the canvas
				clearCanvas();
				objectList.push(new ImageShape(getConfig(), image));
				drawAllObjects();
			};
			// Set the source of the image to the uploaded file
			if (typeof reader.result === 'string')
				image.src = reader.result;
		}
	};
  
}

function clearCanvas() {
	objectList.splice(0, objectList.length);
	historyPointer = -1;
}


// document.getElementById("clear")?.addEventListener('click', function(e) {
// 	context?.clearRect(0, 0, context.canvas.width, context.canvas.height);
// 	drawingHistory.splice(0, drawingHistory.length)
// 	historyPointer = -1;
// 	saveCanvasState();
// })

document.getElementById("undo")?.addEventListener('click', undo)

document.getElementById("redo")?.addEventListener('click', redo)

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

function undo() {
	if (objectList.length > 0) {
		historyPointer--;
		drawAllObjects();
	}
}

function redo() {
	if (historyPointer + 1 < objectList.length) {
		historyPointer++;
		drawAllObjects();
	}
}

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