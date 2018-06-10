import Word from "scripts/Word"
import MainMenu from "../main-menu/main-menu"
import State from "scripts/State"

export default class AppView extends HTMLElement {
	mainMenu: MainMenu

	connectedCallback() {
		State.words = new Map<string, Word>()

		// Main menu
		this.mainMenu = document.createElement("main-menu") as MainMenu
		this.appendChild(this.mainMenu)

		// Loading finished
		this.loading = false
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