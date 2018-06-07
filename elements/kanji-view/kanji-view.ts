export default class KanjiView extends HTMLElement {
	static get observedAttributes() {
		return ["kanji"]
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		this.render()
	}

	render() {
		this.innerText = this.kanji
	}

	get kanji() {
		return this.getAttribute("kanji")
	}

	set kanji(value: string) {
		this.setAttribute("kanji", value)
	}
}