import Word from "scripts/Word"
import MainMenu from "../main-menu/main-menu"
import State from "scripts/State"
import User from "scripts/User"

export default class AppView extends HTMLElement {
	mainMenu: MainMenu

	connectedCallback() {
		State.app = this
		State.user = new User("guest")
		State.words = new Map<string, Word>()

		// Main menu
		this.createMainMenu()

		// Loading finished
		this.loading = false
	}

	createMainMenu() {
		this.mainMenu = document.createElement("main-menu") as MainMenu
		this.appendChild(this.mainMenu)
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