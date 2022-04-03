class Track {

	constructor(points, width) {
		this.points = points
		this.width = width
		this.distCache = {}
		//this.prepareScores()
	}

	getStartPosition() {
		const p0 = this.points[0]
		const p1 = this.points[1]
		const rot = Math.atan2(p1[1] - p0[1], p1[0] - p0[0])
		return {
			x: p0[0],
			y: p0[1],
			rot
		}
	}

	getExactOffset(x, y) {
		let	dSqrMin = Infinity
		const points = this.points
		for(let i = 0; i < points.length; i++) {
			let [x1, y1] = points[i]
			let [x2, y2] = points[(i+1) % points.length]
			let dSqr = getDistSqr(x, y, x1, y1, x2, y2)
			if(dSqr < dSqrMin) dSqrMin = dSqr
		}
		return dSqrMin ** 0.5
	}

	getOffset(x, y) {
		let rx = Math.round(x)
		let ry = Math.round(y)
		let key = rx + "_" + ry
		let cached = this.distCache[key] 
		if(cached && cached < 0.9 * this.width) {
			return cached
		}
		else {
			const dist = this.getExactOffset(x, y)
			this.distCache[key] = this.getExactOffset(rx, ry)	
			return dist
		}
	}

	scan(x0, y0, dir) {
		const rmax = this.width / 2
		let x = x0
		let y = y0
		let r = this.getOffset(x, y)
		while(r < rmax - 1e-2) {
			const maxStep = rmax - r
			x += maxStep * Math.cos(dir)
			y += maxStep * Math.sin(dir)
			r = this.getOffset(x, y)
		}
		const dist = ((x-x0)**2 + (y-y0)**2)**0.5
		return {x, y, dist}
	}

	getCheckPoint(x, y) {
		let	dmin = Infinity
		let checkPoint = 0
		for(let i = 0; i < this.points.length; i++) {
			let [x1, y1] = this.points[i]
			let [x2, y2] = this.points[(i+1) % this.points.length]
			let d = getDistSqr(x, y, x1, y1, x2, y2)
			if(d < dmin) {
				dmin = d
				checkPoint = i + getParam(x, y, x1, y1, x2, y2)
			}
		}
		return checkPoint
	}

	/*
	addPointToScores(x, y, score) {
		const key = `${x}_${y}`
		if(this.getExactOffset(x, y) <= (score==0 ? 0.7: 0.5)*this.width && !(key in this.scores)) {
			this.scores[key] = score
			return true
		}
		return false
	}

	prepareScores() {
		const {x, y, rot} = this.getStartPosition()
		this.scores = {[`${x}_${y}`]: 0}
		const dx = Math.sin(rot) //sin for 90° rot!
		const dy = -Math.cos(rot) //-cos for 90° rot!
		let pending = []
		let nextScore = 0
		for(let i = -0.6*this.width; i < 0.6*this.width; i++) {
			const xP = Math.round(x + i*dx)
			const yP = Math.round(y + i*dy)
			this.addPointToScores(xP, yP, nextScore)
		}
		nextScore = 1
		for(let i = -0.6*this.width; i < 0.6*this.width; i++) {
			const horizontal = Math.abs(Math.tan(rot)) < 1
			const xP = Math.round(x - i*dx) + (horizontal ? Math.sign(Math.cos(rot)) : 0)
			const yP = Math.round(y - i*dy) + (horizontal ? 0 : Math.sign(Math.sin(rot)))
			if(this.addPointToScores(xP, yP, nextScore)) {
				pending.push([xP, yP])
			}
		}
		while(pending.length) {
			let nextPending = []
			nextScore += 1
			for(let [x, y] of pending) {
				for(let [dx, dy] of [[1,0], [0,1], [-1, 0], [0, -1]]) {
					const xP = x + dx 
					const yP = y + dy 
					if(this.addPointToScores(xP, yP, nextScore)) {
						nextPending.push([xP, yP])
					}
				}
			}
			pending = nextPending
		}
	}

	getScoreFromPoint(x, y) {
		const key = `${Math.round(x)}_${Math.round(y)}`
		return this.scores[key]
	}*/

}

function getDistSqr(x, y, x1, y1, x2, y2) {
	let param = getParam(x, y, x1, y1, x2, y2)

	if(param < 0) param = 0
	if(param > 1) param = 1

	const px = x1 + param * (x2 - x1)
	const py = y1 + param * (y2 - y1)

	const dx = x - px
	const dy = y - py
	return dx * dx + dy * dy
}

function getParam(x, y, x1, y1, x2, y2) {
	const Ax = x - x1
	const Ay = y - y1
	const Bx = x2 - x1
	const By = y2 - y1

	const dotProduct = Ax * Bx + Ay * By
	const lenSquare = Bx ** 2 + By ** 2
	return lenSquare > 0 ? dotProduct / lenSquare : 0
}
