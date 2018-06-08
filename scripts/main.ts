import AppView from "elements/app-view/app-view"
import KanjiView from "elements/kanji-view/kanji-view"
import MultipleChoiceQuestion from "elements/multiple-choice-question/multiple-choice-question"

// Error message if browser is too old
if(!("customElements" in window)) {
	alert("Your browser is too old and doesn't support web components!")
}

// Custom element names must have a dash in their name
const elements = new Map<string, Function>([
	["app-view", AppView],
	["kanji-view", KanjiView],
	["multiple-choice-question", MultipleChoiceQuestion]
])

// Register all custom elements
for(const [tag, definition] of elements.entries()) {
	window.customElements.define(tag, definition)
}