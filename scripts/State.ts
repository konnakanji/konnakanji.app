import Word from "./Word"
import WordSet from "./WordSet"
import User from "./User"
import AppView from "elements/app-view/app-view"

export default class State {
	static app: AppView
	static words: Map<string, Word>
	static wordSets: Array<WordSet>
	static user: User
}