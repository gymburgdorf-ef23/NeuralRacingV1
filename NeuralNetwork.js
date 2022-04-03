const activationFns = {
	relu: z => z > 0 ? z : 0,
	RELU: z => z > 0 ? z : 0,
	leakyRELU: z => z > 0 ? z : 0.01*z,
	sigmoid: z => 1 / (1 + Math.exp(-z)),
	linear: z => z,
	tanh: z => Math.tanh(z)
}

class NeuralNetwork {
	constructor(numInputs, {seed = Math.random(), activationFn = "sigmoid"} = {}) {
		this.randomseeded = SeedRandom(seed)
		this.numInputs = numInputs
		this.layers = [] // will later be: [4, 2] or similar
		this.weights = []
		this.biases = []
		this.activations = []
		this.neuronsBeforeLayer = [0]
		this.activationFn = activationFn
	}

	addLayer(numNeurons) {
		const layerIndex = this.layers.length
		let lastLayerLength = this.prevSize(layerIndex)
		this.neuronsBeforeLayer.push(this.neuronsBeforeLayer[layerIndex] + numNeurons)
		this.layers.push(numNeurons)
		for(let n = 0; n < numNeurons; n++) {
			this.biases.push(this.rand(-1, 1))
			this.activations.push(0)
			for(let a = 0; a < lastLayerLength; a++) {
				this.weights.push(this.rand(-1, 1))
			}
		}
	}

	fireNeuron(layer, neuron) {
		let pos = this.neuronsBeforeLayer[layer] + neuron
		let sum = 0
		for(let a = 0; a < this.prevSize(layer); a++) {
			sum += this.pickWeight(layer, neuron, a) * this.pickInput(layer, a)
		}
		sum += this.biases[pos]
		this.activations[pos] = this.output(sum)
	}

	feedForward(inputActivations) {
		console.assert(inputActivations.length === this.numInputs)
		this.inputActivations = inputActivations
		for(let layer = 0; layer < this.layers.length; layer++) {
			for(let n = 0; n < this.layers[layer]; n++) {
				this.fireNeuron(layer, n, inputActivations)
			}
		}
		return this.activations.slice(this.neuronsBeforeLayer[this.layers.length-1])
	}

	output(z) {
		return activationFns[this.activationFn](z)
	}

	pickWeight(layer, neuron, inputNr) {
		let count = 0
		for(let l = 0; l < layer; l++) {
			count += this.layers[l] * this.prevSize(l)
		}
		count += neuron * this.prevSize(layer)
		return this.weights[count + inputNr]
	}
	
	pickInput(layer, inputNr) {
		if(layer === 0) return this.inputActivations[inputNr]
		return this.activations[this.neuronsBeforeLayer[layer-1] + inputNr]
	}

	prevSize(layer) {
		return layer === 0 ? this.numInputs : this.layers[layer-1]
	}

	exportState() {
		let {weights, biases} = this
		return JSON.stringify({weights, biases})
	}

	importState(state) {
		let {weights, biases} = JSON.parse(state)
		Object.assign(this, {weights, biases})
	}

	clone() {
		let nn = new NeuralNetwork(this.numInputs, {seed: this.randomseeded(1e9)*1e-9, activationFn: this.activationFn})
		this.layers.forEach(l=>nn.addLayer(l))
		nn.weights = [...this.weights]
		nn.biases = [...this.biases]
		return nn
	}

	randomAdjust(amount) {
		this.weights.forEach((_, i) => this.weights[i] += gauss(amount, this.randomseeded))
		this.biases.forEach((_, i) => this.biases[i] += gauss(amount, this.randomseeded))
	}

	rand(low, high) {
		return low + (high - low) * Math.round(this.randomseeded(1e9) / 1e7) / 100
	}
}

function gauss(variance, randomseeded = Math.random) {
	var u = 0, v = 0;
	while(u === 0) u = randomseeded(1e9)*1e-9; //Converting [0,1) to (0,1)
	while(v === 0) v = randomseeded(1e9)*1e-9;
	return variance * Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function SeedRandom(state1,state2){
	var mod1=4294967087
	var mul1=65539
	var mod2=4294965887
	var mul2=65537
	if(typeof state1!="number"){
			state1=+new Date()
	}
	if(typeof state2!="number"){
			state2=state1
	}
	state1=state1%(mod1-1)+1
	state2=state2%(mod2-1)+1
	function random(limit){
			state1=(state1*mul1)%mod1
			state2=(state2*mul2)%mod2
			if(state1<limit && state2<limit && state1<mod1%limit && state2<mod2%limit){
					return random(limit)
			}
			return (state1+state2)%limit
	}
	return random
}

/*
let nn = new NeuralNetwork(6)
nn.addLayer(4)
nn.addLayer(2)
console.log(nn.feedForward([0.5, 0.5, 0.5, 0.5, 0.5, 0.5]));
*/