class CarPlayer extends Car {

	constructor(track) {
		super(track)
		this.setupKeyboardControl()
	}

	setupKeyboardControl() {

		const car = this

		window.addEventListener("keydown", (e) => {
			if(e.repeat) return
			if(e.key === "ArrowUp" || e.key === "w") car.acc = 1
			if(e.key === "ArrowDown" || e.key === "s") car.acc = -1
			if(e.key === "ArrowLeft" || e.key === "a") car.steer = -1
			if(e.key === "ArrowRight" || e.key === "d") car.steer = 1
		})
	
		window.addEventListener("keyup", (e) => {
			if(e.key === "ArrowUp" || e.key === "w") car.acc = 0
			if(e.key === "ArrowDown" || e.key === "s") car.acc = 0
			if(e.key === "ArrowLeft" || e.key === "a") car.steer = 0
			if(e.key === "ArrowRight" || e.key === "d") car.steer = 0
		})
	}



}