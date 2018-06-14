import State from "scripts/State"
import WordSet from "scripts/WordSet"
import cloneTemplate from "scripts/cloneTemplate"
import Diff from "scripts/Diff"

const predefinedWordSets = [
	"people",
	"occupations",
	"body",
	"family",
	"directions",
	"time",
	"colors",
	"weather",
	"animals",
	"emotions",
	"food",
	"sea",
	"plants",
	"materials",
	"actions",
	"state",
	"jlpt/n5",
	"jlpt/n4",
	"jlpt/n3",
	"jlpt/n2",
	"jlpt/n1",
	// "grade/1",
	// "grade/2",
	// "grade/3",
	// "grade/4",
	// "grade/5",
	// "grade/6",
	// "常用漢字"
]

export default class WordSetMenu extends HTMLElement {
	connectedCallback() {
		for(let name of predefinedWordSets) {
			let wordSet = WordSet.get(name)
			let template = cloneTemplate("wordset-button-template")
			let button = template.firstElementChild as HTMLDivElement

			Diff.mutations.queue(() => {
				button.querySelector(".wordset-name").innerHTML = wordSet.name
				this.appendChild(template)
			})

			wordSet.available.then(() => {
				Diff.mutations.queue(() => {
					let filtered = wordSet.filtered()

					button.classList.remove("loading")
					button.querySelector(".wordset-count-learned").innerHTML = (wordSet.words.size - filtered.length).toString()
					button.querySelector(".wordset-count-total").innerHTML = wordSet.words.size.toString()

					if(filtered.length === 0) {
						button.classList.add("completed")
						button.querySelector(".wordset-preview").innerHTML = "Nothing to learn here! Check back later."
					} else {
						button.querySelector(".wordset-preview").innerHTML = filtered.join("、")

						button.addEventListener("click", () => {
							State.app.fade(() => State.app.navigate(`/test/${name}`))
						})
					}
				})
			})
		}
	}
}