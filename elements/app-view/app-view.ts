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

		// Decide what to do based on the route
		this.route(window.location.pathname)

		// Loading finished
		this.loading = false
	}

	route(uri: string) {
		if(!uri || uri === "/") {
			// Main menu
			this.createMainMenu()
		}
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