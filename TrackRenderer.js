class TrackRenderer {

	constructor(track, background) {
		this.drawArea = document.querySelector(".drawing")
		this.background = background
		this.distCache = {}
		this.render(track)
	}

	render(track) {
		const {points, width} = track
		if(this.background) {
			document.querySelector(".wrap").style.backgroundImage = `url(${this.background})`
			document.querySelector(".wrap").style.backgroundColor = this.background
		}
		const d = `M ${points[0][0]} ${points[0][1]} L ${points.slice(1).map(p=>`${p[0]} ${p[1]}`).join(", ")} Z`
		this.drawArea.insertAdjacentHTML("beforeend", `
			<path d="${d}" style="stroke-width: ${width+3}; stroke: red;"></path>
			<path d="${d}" style="stroke-width: ${width+3}; stroke: white; stroke-dasharray:4;"></path>
			<path d="${d}" style="stroke-width: ${width-3};"></path>`
		)
	}
}