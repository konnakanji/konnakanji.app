import State from "scripts/State"
import User from "scripts/User"
import Word from "scripts/Word"
import WordSet from "scripts/WordSet"
import WordSetMenu from "../wordset-menu/wordset-menu"
import MultipleChoiceTest from "../multiple-choice-test/multiple-choice-test"

export default class AppView extends HTMLElement {
	connectedCallback() {
		State.app = this
		State.user = new User("guest")
		State.words = new Map<string, Word>()

		// Decide what to do based on the route
		this.navigate(location.pathname)

		// When we press the back button,
		// navigate to the given route.
		window.onpopstate = () => {
			this.fade(() => this.navigate(location.pathname))
		}

		// Loading finished
		this.loading = false
	}

	navigate(uri: string) {
		this.innerHTML = ""

		if(!uri || uri === "/") {
			// Main menu
			this.createWordSetMenu()
		} else if(uri.startsWith("/test/")) {
			// Test
			this.createMultipleChoiceTest(uri.slice("/test/".length))
		}

		if(location.pathname !== uri) {
			history.pushState(null, null, uri)
		}
	}

	async createWordSetMenu() {
		await customElements.whenDefined("wordset-menu")

		let wordSetMenu = new WordSetMenu()
		this.appendChild(wordSetMenu)
	}

	async createMultipleChoiceTest(name: string) {
		await customElements.whenDefined("multiple-choice-test")

		let wordSet = WordSet.get(name)
		await wordSet.available

		let test = new MultipleChoiceTest(wordSet.filtered())
		this.appendChild(test)
	}

	fade(callback: Function) {
		this.classList.add("fade-out")

		setTimeout(() => {
			callback()
			this.classList.remove("fade-out")
		}, 250)
	}

	get loading() {
		return this.hasAttribute("loading")
	}

	set loading(value: boolean) {
		if(value) {
			this.setAttribute("loading", "true")
		} else {
			this.removeAttribute("loading")
		}
	}
}