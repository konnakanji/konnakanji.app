import KanjiView from "../kanji-view/kanji-view"

const vocabulary = {
	"漢字": "かんじ",
	"感じ": "かんじ",
	"行く": "いく",
	"飲む": "のむ",
	"食べる": "たべる",
	"分かる": "わかる"
}

function randomItem<T>(collection: T[]) {
	return collection[Math.floor(Math.random() * collection.length)]
}

export default class MultipleChoiceQuestion extends HTMLElement {
	kanjiView: KanjiView
	answers: HTMLElement[]

	connectedCallback() {
		this.kanjiView = this.getElementsByTagName("kanji-view")[0] as KanjiView
		this.answers = [...this.getElementsByClassName("answer")] as HTMLElement[]
		
		for(let answer of this.answers) {
			answer.addEventListener("click", e => this.onAnswerClicked(e.target as HTMLElement))
		}

		this.randomQuestion()
	}

	randomQuestion() {
		let allKanji = Object.keys(vocabulary)
		let nextKanji = randomItem(allKanji)

		this.kanjiView.kanji = nextKanji
		this.generateAnswers()
	}

	clearAnswers() {
		for(let answer of this.answers) {
			answer.innerText = ""
		}
	}

	generateAnswers() {
		this.clearAnswers()
		let allKana = Object.values(vocabulary)
		let used = new Set<string>()
		let correctAnswerIndex = Math.floor(Math.random() * this.answers.length)

		for(let answer of this.answers) {
			let text = randomItem(allKana)

			// Avoid duplicate answers
			if(allKana.length >= this.answers.length) {
				while(used.has(text)) {
					text = randomItem(allKana)
				}
			}

			answer.innerText = text
			used.add(text)
		}
	}

	onAnswerClicked(answer: HTMLElement) {
		console.log("Clicked answer", answer)

		let correctAnswerText = vocabulary[this.kanjiView.kanji]

		if(answer.innerText === correctAnswerText) {
			answer.classList.add("correct")
		} else {
			answer.classList.add("wrong")

			for(let element of this.answers) {
				if(element.innerText === correctAnswerText) {
					element.classList.add("correct")
					break
				}
			}
		}
	}
}