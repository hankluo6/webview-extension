class Shape {
	/**
	* @param {Object.<String, any>} config
	*/
	constructor(config) {
		this.startPos = {x:0, y:0};
		this.endPos = {x:0, y:0};
		this.config = config;
	}

	/**
	* @param {CanvasRenderingContext2D | null} context
	*/
	draw(context) {
		context && (context.strokeStyle = this.config.color);
	}
}

class Line extends Shape {
	/**
	* @param {CanvasRenderingContext2D | null} context
	*/
	draw(context) {
		super.draw(context);
		context?.beginPath();
		context?.moveTo(this.startPos.x, this.startPos.y);
		context?.lineTo(this.endPos.x, this.endPos.y)
		// context && (context.strokeStyle = color);
		context?.stroke();
	}
}

class Square extends Shape {
	/**
	* @param {CanvasRenderingContext2D} context
	*/
	draw(context) {
		super.draw(context);
		context?.beginPath();
		context?.moveTo(this.startPos.x, this.startPos.y);
		context?.lineTo(this.endPos.x, this.endPos.y)
		// context && (context.strokeStyle = color);
		context?.stroke();
	}

}

class Circle extends Shape {
	/**
	* @param {CanvasRenderingContext2D} context
	*/
	draw(context) {
		super.draw(context);
		context?.beginPath();
		context?.moveTo(this.startPos.x, this.startPos.y);
		context?.lineTo(this.endPos.x, this.endPos.y)
		// context && (context.strokeStyle = color);
		context?.stroke();
	}

}

