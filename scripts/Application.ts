export default class Application extends HTMLElement {
	date: Date
	timer: number

	constructor() {
		super()
	}

	connectedCallback() {
		this.tick()

		this.timer = setInterval(
			() => this.tick(),
			1000
		)
	}

	disconnectedCallback() {
		clearInterval(this.timer)
	}

	tick() {
		this.date = new Date()
		this.render()
	}

	render() {
		this.innerText = this.date.toLocaleTimeString()
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		console.log("attribute changed")
	}
}