export default class StatusMessages extends HTMLElement {
	post(text: string) {
		let message = document.createElement("div")
		message.classList.add("status-message")
		message.innerText = text
		this.appendChild(message)

		setTimeout(() => this.removeChild(message), 1000)
	}
}