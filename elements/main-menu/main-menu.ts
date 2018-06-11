import MultipleChoiceTest from "../multiple-choice-test/multiple-choice-test"
import State from "scripts/State"
import WordSet from "scripts/WordSet"

const predefinedWordSets = [
	"people",
	"occupations",
	"body",
	"family",
	"jlpt/n5",
	"jlpt/n4",
	"jlpt/n3",
	"jlpt/n2",
	"jlpt/n1"
]

export default class MainMenu extends HTMLElement {
	async connectedCallback() {
		for(let name of predefinedWordSets) {
			let wordSet = new WordSet(name)
			let button = document.createElement("button")
			button.innerText = wordSet.name
			button.disabled = true
			this.appendChild(button)

			// button.innerText = `${wordSet.name} (${wordSet.words.size})`
			// Preview: [...wordSet.values()].join("、")

			wordSet.parse(`/words/${name}.txt`).then(() => {
				button.addEventListener("click", () => {
					State.app.fade(() => this.testWordSet(wordSet))
				})

				button.disabled = false
			})
		}
	}

	get activated() {
		return !this.classList.contains("hidden")
	}

	set activated(value: boolean) {
		if(value) {
			this.classList.remove("hidden")
		} else {
			this.classList.add("hidden")
		}
	}

	testWordSet(wordSet: WordSet) {
		this.activated = false

		let multiTest = new MultipleChoiceTest([...wordSet.words.values()])
		this.parentElement.appendChild(multiTest)
	}
}