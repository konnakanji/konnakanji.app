export default class KanjiView extends HTMLElement {
	textElement: HTMLElement

	static get observedAttributes() {
		return ["kanji"]
	}

	connectedCallback() {
		this.textElement = document.createElement("div")
		this.textElement.classList.add("kanji")
		this.appendChild(this.textElement)
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if(attrName === "kanji") {
			this.render()
		}
	}

	render() {
		this.textElement.innerText = this.kanji
	}

	get kanji() {
		return this.getAttribute("kanji")
	}

	set kanji(value: string) {
		this.setAttribute("kanji", value)
	}
}