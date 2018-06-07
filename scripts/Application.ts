export default class Application extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		this.loading = false
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		console.log("attribute changed")
	}

	get loading() {
		return this.hasAttribute("loading")
	}

	set loading(value: boolean) {
		if(value) {
			this.setAttribute("loading", "true")
		} else {
			this.removeAttribute("loading")
		}
	}
}