export default class Word {
	kanji: string
	hiragana: string
	english: string

	constructor(kanji: string, hiragana: string, english: string) {
		this.kanji = kanji
		this.hiragana = hiragana
		this.english = english
		Object.freeze(this)
	}
}