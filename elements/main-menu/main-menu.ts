import Word from "scripts/Word"
import MultipleChoiceTest from "../multiple-choice-test/multiple-choice-test"
import State from "scripts/State"

const predefinedWordSets = [
	"people",
	"occupations",
	"body",
	"family"
]

export default class MainMenu extends HTMLElement {
	async connectedCallback() {
		State.wordSets = await Promise.all(
			predefinedWordSets.map(topic => this.parse(`/words/${topic}.txt`))
		)

		for(let wordSet of State.wordSets) {
			let button = document.createElement("button")
			button.innerText = [...wordSet.values()].join("、")
			button.addEventListener("click", () => this.testWordSet(wordSet))
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

	testWordSet(wordSet: Set<string>) {
		this.activated = false

		let multiTest = new MultipleChoiceTest([...wordSet.values()])
		this.parentElement.appendChild(multiTest)
	}

	async parse(url: string) {
		let response = await fetch(url)
		let text = await response.text()
		let lines = text.split("\n")
		let wordSet = new Set<string>()

		for(let line of lines) {
			let [kanji, hiragana, english] = line.split("|")
			let word = new Word(kanji, hiragana, english)

			wordSet.add(word.kanji)
			State.words.set(word.kanji, word)
		}

		return wordSet
	}
}