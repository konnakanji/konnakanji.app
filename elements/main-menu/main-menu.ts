import MultipleChoiceTest from "../multiple-choice-test/multiple-choice-test"
import State from "scripts/State"
import WordSet from "scripts/WordSet"

const predefinedWordSets = [
	"people",
	"occupations",
	"body",
	"family",
	"jlpt-n5"
]

export default class MainMenu extends HTMLElement {
	async connectedCallback() {
		State.wordSets = await Promise.all(
			predefinedWordSets.map(topic => new WordSet(topic).parse(`/words/${topic}.txt`))
		)

		for(let wordSet of State.wordSets) {
			let button = document.createElement("button")
			button.innerText = wordSet.name //[...wordSet.values()].join("、")
			button.addEventListener("click", () => {
				State.app.fade(() => this.testWordSet(wordSet))
			})
			this.appendChild(button)
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