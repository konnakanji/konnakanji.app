import Word from "./Word"
import User from "./User"
import AppView from "elements/app-view/app-view"

export default class State {
	static app: AppView
	static words: Map<string, Word>
	static user: User
}