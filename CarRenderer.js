
class CarRenderer {

	constructor() {
		this.drawArea = document.querySelector(".drawing")
		this.cars = []
		this.sprites = {}
	}

	initSprite(car, withScans) {
		let content = `<g class="car car_${car.id}" transform="translate(100 100)">
				<title>Car ${car.id}</title>
				<image
				x=-8 y=-5
				transform="rotate(20)"
				width="16" height="10"
				xlink:href="car.png"/>
			</g>`
		
		if(withScans) {
			content += `
				<line class="scan scan1 scan_${car.id}"></line>
				<line class="scan scan2 scan_${car.id}"></line>
				<line class="scan scan3 scan_${car.id}"></line>
				<line class="scan scan4 scan_${car.id}"></line>
				<line class="scan scan5 scan_${car.id}"></line>
			`
		}
		this.drawArea.insertAdjacentHTML("beforeend", content)
		this.sprites[car.id] = this.drawArea.querySelector(`.car_${car.id}`)
	}


	render(car, withScans = false) {
		if(!this.cars.includes(car)) {
			this.initSprite(car, withScans)
			this.cars.push(car)
		}
		this.sprites[car.id].setAttribute("transform", `translate(${car.x} ${car.y})`)
		this.sprites[car.id].querySelector("image").setAttribute("transform", `rotate(${180*car.rot/Math.PI})`)
		if(withScans) {
			this.renderScans(car)
		}
	}

	renderScans(car) {
		for(let l = 0; l < 5; l++) {
			const dir = car.rot + 0.25 * (l-2) * Math.PI
			let {x: x2, y: y2, dist} = car.track.scan(car.x, car.y, dir)
			let scan = this.drawArea.querySelector(`.scan_${car.id}.scan${l+1}`)
			scan.setAttribute("x1", car.x)
			scan.setAttribute("y1", car.y)
			scan.setAttribute("x2", x2)
			scan.setAttribute("y2", y2)
		}
	}

	remove(car) {
		this.cars.splice(this.cars.indexOf(car), 1)
		this.sprites[car.id].remove()
		delete this.sprites[car.id]
	}
}