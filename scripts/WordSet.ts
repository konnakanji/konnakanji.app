import State from "./State"
import Word from "./Word"
import filterQuestions from "./filterQuestions"

export default class WordSet {
	name: string
	words: Set<string>
	available: Promise<void>
	filteredCache: string[]
	filteredCacheTime: number

	static all = new Map<string, WordSet>()

	static get(name: string) {
		let wordSet = WordSet.all.get(name)

		if(wordSet) {
			return wordSet
		}

		wordSet = new WordSet(name)
		WordSet.all.set(name, wordSet)
		return wordSet
	}

	constructor(name: string) {
		this.name = name
		this.words = new Set<string>()
		this.available = this.parse(`/words/${name}.txt`)
		this.filteredCache = []
		this.filteredCacheTime = 0
	}

	filtered() {
		let questions = [...this.words.values()]
		return filterQuestions(questions)
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
			} else {
				console.warn(`Invalid word definition in ${url}: ${line}`)
				continue
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
	}
}