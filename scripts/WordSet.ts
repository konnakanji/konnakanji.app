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
			let parts = line.split("|")
			let kanji, hiragana, english

			if(parts.length === 3) {
				[kanji, hiragana, english] = parts
			} else if(parts.length === 1) {
				[kanji] = parts
			}

			let existingWord = State.words.get(kanji)

			if(!hiragana && existingWord && existingWord.hiragana) {
				hiragana = existingWord.hiragana
			}

			if(!hiragana) {
				continue
			}

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