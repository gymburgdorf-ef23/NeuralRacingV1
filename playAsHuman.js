function playAsHuman() {
	const track = setupMonaco()
	const car = new CarPlayer(track)
	const carRenderer = new CarRenderer(track)

	function step() {
		car.move()
		carRenderer.render(car, true)
		const score = car.updateScore()
		//document.querySelector(".score").textContent = score
		if(car.checkCollision()) {
			alert("game over")
		}
		else {
			requestAnimationFrame(step)
		}
	}

	step()
}