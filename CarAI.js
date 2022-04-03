class CarAI extends Car {

	constructor(track) {
		super(track)
		this.nn = new NeuralNetwork(6, {seed: this.id + 0}) // 100 in gen 3 // 300 also fine!
		this.nn.addLayer(4)
		this.nn.addLayer(2)
	}

	control() {
		let scans = this.getScans()
		let results = this.nn.feedForward([...scans, this.v])
		this.acc = -1 + 2 * results[0]
		this.steer = -1 + 2 * results[1]
	}

}