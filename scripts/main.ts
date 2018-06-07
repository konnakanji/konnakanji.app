import AppView from "./AppView"
import KanjiView from "./KanjiView"

// Custom element names must have a dash in their name
const elements = new Map<string, Function>([
	["app-view", AppView],
	["kanji-view", KanjiView]
])

// Register all custom elements
for(const [tag, definition] of elements.entries()) {
	window.customElements.define(tag, definition)
}