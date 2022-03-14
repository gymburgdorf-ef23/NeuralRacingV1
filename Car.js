
let id = 0

class Car {

	constructor(track) {
		this.track = track
		this.id = id
		id += 1
		this.reset()
	}

	reset() {
		const start = this.track.getStartPosition()
		this.x = start.x
		this.y = start.y
		this.rot = start.rot
		this.v = 0.1
		this.acc = 0
		this.steer = 0
		this.score = 0
	}

	move() {
		const dt = 0.1
		this.v = 0.99 * this.v + 0.08 * this.acc
		this.rot = (this.rot + 0.03 * this.steer * Math.sign(this.v)) % (2*Math.PI)
		this.x += Math.cos(this.rot) * this.v * dt
		this.y += Math.sin(this.rot) * this.v * dt
	}

	checkCollision() {
		return this.track.getOffset(this.x, this.y) > 0.5 * this.track.width
	}

	updateScore() {
		this.score = 0
	}

	getScans() {
		let scans = []
		for(let l = 0; l < 5; l++) {
			const dir = this.rot + 0.25 * (l-2) * Math.PI
			let {dist} = this.track.scan(this.x, this.y, dir)
			scans.push(0.5 * dist)
		}
		return scans
	}

}