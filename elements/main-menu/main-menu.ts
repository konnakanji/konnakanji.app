import MultipleChoiceTest from "../multiple-choice-test/multiple-choice-test"
import State from "scripts/State"
import WordSet from "scripts/WordSet"
import cloneTemplate from "scripts/cloneTemplate"
import filterQuestions from "scripts/filterQuestions"

const predefinedWordSets = [
	"people",
	"occupations",
	"body",
	"family",
	"animals",
	"actions",
	"emotions",
	"state",
	"food",
	"time",
	"jlpt/n5",
	"jlpt/n4",
	"jlpt/n3",
	"jlpt/n2",
	"jlpt/n1"
]

export default class MainMenu extends HTMLElement {
	async connectedCallback() {
		for(let name of predefinedWordSets) {
			let wordSet = new WordSet(name)
			let template = cloneTemplate("wordset-button-template")
			let button = template.firstElementChild as HTMLDivElement
			button.querySelector(".wordset-name").innerHTML = wordSet.name
			button.classList.add("loading")
			this.appendChild(template)

			wordSet.parse(`/words/${name}.txt`).then(() => {
				let questions = [...wordSet.words.values()]
				let questionsLeft = filterQuestions(questions)

				button.classList.remove("loading")
				button.querySelector(".wordset-count-learned").innerHTML = (questions.length - questionsLeft.length).toString()
				button.querySelector(".wordset-count-total").innerHTML = wordSet.words.size.toString()

				if(questionsLeft.length === 0) {
					button.classList.add("completed")
					button.querySelector(".wordset-preview").innerHTML = "Nothing to learn here! Check back later."
				} else {
					button.querySelector(".wordset-preview").innerHTML = questionsLeft.join("、")

					button.addEventListener("click", () => {
						State.app.fade(() => this.testWordSet(questionsLeft))
					})
				}
			})
		}
	}

	testWordSet(questions: string[]) {
		let multiTest = new MultipleChoiceTest(questions)
		this.parentElement.appendChild(multiTest)

		// Delete this main menu
		this.parentElement.removeChild(this)
	}
}