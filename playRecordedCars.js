function playRecordedCars() {
	
	const track = setupMonaco()
	const carRenderer = new CarRenderer(track)

	async function runGeneration(traces) {
		return new Promise(resolve=>{
			let cars = traces.map(t => new Car(track))
			let steps = 0
			function step() {
				for(let i = 0; i < cars.length; i++) {
					let pos = traces[i][steps]
					if(pos) {
						cars[i].x = pos[0]
						cars[i].y = pos[1]
						cars[i].rot = pos[2]
						carRenderer.render(cars[i])
					}
					else {
						cars[i].gameOver = true
					}
				}
				if(cars.some(c=>!c.gameOver)) {
					steps++
					requestAnimationFrame(step)
				}
				else {
					for(let car of cars) {
						carRenderer.remove(car)
					}
					resolve()
				}
			}
			step()
		})
	}

	async function run() {
		let generation = 0
		let found = true
		while(found) {
			try {
				traces = await fetch(`./data/traces${generation}.json`).then(r=>r.json())
				console.log({generation});
				await runGeneration(traces)
				generation += 1
			}
			catch(e) {
				console.log(e);
				found = false
			}
		}
	}

	run()

}

