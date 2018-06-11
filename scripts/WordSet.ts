import State from "./State"
import Word from "./Word"

export default class WordSet {
	name: string
	words: Set<string>

	constructor(name: string) {
		this.name = name
		this.words = new Set<string>()
	}

	async parse(url: string) {
		let response = await fetch(url)
		let text = await response.text()
		let lines = text.split("\n")

		for(let line of lines) {
			let [kanji, hiragana, english] = line.split("|")
			let word = new Word(kanji, hiragana, english)

			this.words.add(word.kanji)
			State.words.set(word.kanji, word)
		}

		return this
	}
}