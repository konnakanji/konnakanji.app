export default class MultipleChoiceQuestion extends HTMLElement {
	answers: Element[]

	connectedCallback() {
		this.answers = [...this.getElementsByClassName("answer")]
		
		for(let answer of this.answers) {
			answer.addEventListener("click", e => this.onAnswerClicked(e.target as HTMLElement))
		}
	}

	onAnswerClicked(answer: HTMLElement) {
		console.log("Clicked answer", answer)
	}
}