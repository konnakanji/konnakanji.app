import Word from "scripts/Word"
import MultipleChoiceTest from "../multiple-choice-test/multiple-choice-test"

export default class AppView extends HTMLElement {
	words: Map<string, Word>
	wordSets: Array<Set<string>>
	mainMenu: HTMLElement

	async connectedCallback() {
		this.mainMenu = document.getElementById("main-menu")
		this.words = new Map<string, Word>()

		this.wordSets = await Promise.all([
			this.parse("/words/people.txt"),
			this.parse("/words/occupations.txt"),
			this.parse("/words/body.txt")
		])

		for(let wordSet of this.wordSets) {
			let button = document.createElement("button")
			button.innerText = [...wordSet.values()].join("、")
			button.addEventListener("click", () => this.testWordSet(wordSet))
			this.mainMenu.appendChild(button)
		}

		this.loading = false
	}

	get menuActivated() {
		return !this.mainMenu.classList.contains("hidden")
	}

	set menuActivated(value: boolean) {
		if(value) {
			this.mainMenu.classList.remove("hidden")
		} else {
			this.mainMenu.classList.add("hidden")
		}
	}

	testWordSet(wordSet: Set<string>) {
		this.menuActivated = false

		let multiTest = new MultipleChoiceTest([...wordSet.values()])
		this.appendChild(multiTest)
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
			this.words.set(word.kanji, word)
		}

		return wordSet
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