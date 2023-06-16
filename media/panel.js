var painterElement = /** @type {HTMLCanvasElement} */ (document.getElementById("painter"));
var context = painterElement.getContext('2d');
var paint = false;
var lastPos = {x: 0, y: 0};
var /** @type {string} */ mode = "Pen";
// const drawingHistory = /** @type {(string | undefined)[]} */ ([]);
var historyPointer = -1;
// const maxHistoryLength = 100;
var /** @type {Shape} */ currentObject;
var objectList = /** @type {(Shape)[]} */ ([]);
var /** @type {Object.<String, any>} */ config = {
	color: /** @type {HTMLInputElement} */ (document.getElementById('hex'))?.value, //TODO: when click change color, update it
	lineWidth: /** @type {HTMLInputElement} */ (document.getElementById('stroke'))?.value,
	globalCompositeOperation: "source-over",
	lineCap: "round",
};

const uploadButton = document.getElementById("image-upload");
uploadButton?.addEventListener('change', handleImageUpload);

const stroke = document.getElementById("stroke");
const strokeLabel = document.getElementById("stroke-value-label");

stroke?.addEventListener("input", () => {
	if (strokeLabel)
		strokeLabel.textContent = /** @type {HTMLInputElement} */ (stroke).value;
});

/**
 * @param {MouseEvent} e
 */
function mousedown(e) {
	switch (mode) {
		case "Pen":
			config.globalCompositeOperation = "source-over";
			currentObject = new LineList(getConfig());
			break;
		case "Line":
			config.globalCompositeOperation = "source-over";
			currentObject = new Line(getConfig());
			break;
		case "Circle":
			config.globalCompositeOperation = "source-over";
			currentObject = new Circle(getConfig());
			break;
		case "Square":
			config.globalCompositeOperation = "source-over";
			currentObject = new Square(getConfig());
			break;
		case "Eraser":
			config.globalCompositeOperation = "destination-out";
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

/**
 * @param {MouseEvent} e
 */
function mouseup(e) {
	currentObject.endPos.x = e.pageX - painterElement.offsetLeft;
	currentObject.endPos.y = e.pageY - painterElement.offsetTop;
}

/**
 * @param {MouseEvent} e
 */
function mousemove(e) {
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
	showConfirmationDialog()
	// clearCanvas();
	// drawAllObjects();
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
		lineWidth: /** @type {HTMLInputElement} */ (document.getElementById('stroke'))?.value,
		globalCompositeOperation: config.globalCompositeOperation,
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

document.getElementById("undo")?.addEventListener('click', undo)

document.getElementById("redo")?.addEventListener('click', redo)

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

const confirmationDialog = document.getElementById('confirmation-dialog');
const confirmButton = document.getElementById('confirm-btn');
const cancelButton = document.getElementById('cancel-btn');

confirmButton?.addEventListener('click', () => {
  // User clicked the Confirm button, handle the confirmation action here
  // For example, clear the canvas
  clearCanvas();
  drawAllObjects();
  if (confirmationDialog)
  	confirmationDialog.style.display = 'none';
});

cancelButton?.addEventListener('click', () => {
  // User clicked the Cancel button, close the dialog
  if (confirmationDialog)
  	confirmationDialog.style.display = 'none';
});

function showConfirmationDialog() {
	if (confirmationDialog)
  		confirmationDialog.style.display = 'block';
}

// require("dom-to-image")
// convertCodicon();
// function convertCodicon() {
// 	const tempCanvas = document.createElement('canvas');
// 	const tempCtx = tempCanvas.getContext('2d');
// 	if (tempCtx) {
// 		tempCtx.fillStyle = 'black'; // Set the fill color to black or any desired color
// 		tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

// 		const codiconElement = document.createElement('i');
// 		codiconElement.className = 'codicon codicon-circle'; // Replace with the desired codicon class name
// 		tempCtx.font = '24px codicon'; // Set the desired font size and font family for the codicon
// 		tempCtx.fillStyle = 'white'; // Set the fill color to white or any desired color
// 		tempCtx.fillText('\uea1b', 0, 24); // Replace '\uea1b' with the Unicode code point of the desired codicon
// 		// const dataURL = tempCanvas.toDataURL();
// 		const dataURL = "https://www.google.com/images/srpr/logo4w.png";
// 		painterElement.style.cursor = `url(${dataURL}), auto`;
// 		console.log('done');
// 	}
// }