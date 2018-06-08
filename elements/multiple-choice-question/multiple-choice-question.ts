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
	question: HTMLDivElement
	answers: HTMLButtonElement[]

	connectedCallback() {
		this.kanjiView = this.getElementsByTagName("kanji-view")[0] as KanjiView
		this.question = this.getElementsByClassName("question")[0] as HTMLDivElement
		this.answers = [...this.getElementsByClassName("answer")] as HTMLButtonElement[]
		
		for(let answer of this.answers) {
			answer.addEventListener("click", e => this.onAnswerClicked(e.target as HTMLButtonElement))
		}

		this.question.addEventListener("click", e => this.onQuestionClicked(e))
		this.nextQuestion()
	}

	onQuestionClicked(e: MouseEvent) {
		if(e.target !== this.question) {
			return
		}

		if(!this.solved) {
			return
		}

		this.nextQuestion()
	}

	nextQuestion() {
		let allKanji = Object.keys(vocabulary)
		let nextKanji = randomItem(allKanji)

		this.kanjiView.kanji = nextKanji
		this.clearAnswers()
		this.generateAnswers()
	}

	clearAnswers() {
		for(let answer of this.answers) {
			answer.innerText = ""
			answer.classList.remove("correct")
			answer.classList.remove("wrong")
			answer.disabled = false
		}
	}

	get correctAnswer() {
		return vocabulary[this.kanjiView.kanji]
	}

	get solved() {
		return !!this.answers.find(answer => answer.classList.contains("correct"))
	}

	generateAnswers() {
		let allKana = Object.values(vocabulary)
		let used = new Set<string>()

		// Add correct answer
		let correctAnswerIndex = Math.floor(Math.random() * this.answers.length)
		this.answers[correctAnswerIndex].innerText = this.correctAnswer
		used.add(this.correctAnswer)

		for(let answer of this.answers) {
			// Skip existing answers
			if(answer.innerText !== "") {
				continue
			}

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

	onAnswerClicked(answer: HTMLButtonElement) {
		if(answer.disabled) {
			return
		}

		let correctAnswer = this.correctAnswer

		if(answer.innerText === correctAnswer) {
			// If we clicked on the correctly highlighted answer,
			// simply go to the next question.
			if(answer.classList.contains("correct")) {
				this.nextQuestion()
				return
			}

			// Show answer in green
			answer.classList.add("correct")

			// Disable incorrect answer
			for(let element of this.answers) {
				if(element !== answer) {
					element.disabled = true
				}
			}
		} else {
			answer.classList.add("wrong")

			for(let element of this.answers) {
				if(element.innerText === correctAnswer) {
					element.classList.add("correct")
					break
				}
			}
		}
	}
}