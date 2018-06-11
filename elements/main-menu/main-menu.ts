import MultipleChoiceTest from "../multiple-choice-test/multiple-choice-test"
import State from "scripts/State"
import WordSet from "scripts/WordSet"
import cloneTemplate from "scripts/cloneTemplate"

const predefinedWordSets = [
	"people",
	"occupations",
	"body",
	"family",
	"animals",
	"actions",
	"emotions",
	"state",
	"food",
	"time",
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
			let template = cloneTemplate("wordset-button-template")
			let button = template.firstElementChild as HTMLDivElement
			button.querySelector(".wordset-name").innerHTML = wordSet.name
			button.classList.add("loading")
			this.appendChild(template)

			wordSet.parse(`/words/${name}.txt`).then(() => {
				button.addEventListener("click", () => {
					State.app.fade(() => this.testWordSet(wordSet))
				})

				button.classList.remove("loading")
				button.querySelector(".wordset-count").innerHTML = wordSet.words.size.toString()
				button.querySelector(".wordset-preview").innerHTML = [...wordSet.words.values()].join("、")
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