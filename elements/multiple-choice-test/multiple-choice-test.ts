import AppView from "../app-view/app-view"
import KanjiView from "../kanji-view/kanji-view"
import randomItem from "scripts/randomItem"

export default class MultipleChoiceTest extends HTMLElement {
	appView: AppView
	kanjiView: KanjiView
	questionsInTest: string[]
	questionIndex: number
	question: HTMLDivElement
	answers: HTMLButtonElement[]

	constructor(questions: string[]) {
		super()
		this.setAttribute("questions", JSON.stringify(questions))
	}

	async connectedCallback() {
		this.question = document.createElement("div")
		this.question.classList.add("question")
		this.appendChild(this.question)

		this.kanjiView = new KanjiView()
		this.question.appendChild(this.kanjiView)

		let answersContainer = document.createElement("div")
		answersContainer.classList.add("answers")
		this.appendChild(answersContainer)

		for(let i = 0; i < 4; i++) {
			let answer = document.createElement("button")
			answer.classList.add("answer")
			answersContainer.appendChild(answer)
		}

		this.appView = document.getElementsByTagName("app-view")[0] as AppView
		this.answers = [...this.getElementsByClassName("answer")] as HTMLButtonElement[]
		this.questionsInTest = JSON.parse(this.getAttribute("questions")) as string[] || []

		this.startTest()

		// Bind event listeners at the end
		for(let answer of this.answers) {
			answer.addEventListener("click", e => this.onAnswerClicked(e.target as HTMLButtonElement))
		}

		this.question.addEventListener("click", e => this.onQuestionClicked(e))
	}

	startTest() {
		if(this.questionsInTest.length === 0) {
			console.error("No questions")
			return
		}

		this.questionIndex = -1
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
		this.questionIndex++

		if(this.questionIndex >= this.questionsInTest.length) {
			this.onFinishTest()
			return
		}

		let nextKanji = this.questionsInTest[this.questionIndex]
		this.kanjiView.kanji = nextKanji
		this.clearAnswers()
		this.generateAnswers()
	}

	onFinishTest() {
		this.parentElement.removeChild(this)
		this.appView.menuActivated = true
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
		return this.appView.words.get(this.kanjiView.kanji).hiragana
	}

	get solved() {
		return !!this.answers.find(answer => answer.classList.contains("correct"))
	}

	generateAnswers() {
		let allKana = [...this.appView.words.values()]
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

			let text = randomItem(allKana).hiragana

			// Avoid duplicate answers
			if(allKana.length >= this.answers.length) {
				while(used.has(text)) {
					text = randomItem(allKana).hiragana
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