import Word from "./Word"
import User from "./User"

export default class State {
	static words: Map<string, Word>
	static wordSets: Array<Set<string>>
	static user: User
}