import Word from "./Word"

export default class State {
	static words: Map<string, Word>
	static wordSets: Array<Set<string>>
}