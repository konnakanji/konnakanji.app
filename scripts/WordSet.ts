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
			let existingWord = State.words.get(kanji)

			let word = new Word(kanji, hiragana, english)
			this.words.add(word.kanji)

			if(!existingWord) {
				State.words.set(word.kanji, word)
			} else if(existingWord.hiragana !== hiragana) {
				//console.warn("Word definition conflict:", kanji, existingWord.hiragana, hiragana, "in", url)
			}
		}

		return this
	}
}