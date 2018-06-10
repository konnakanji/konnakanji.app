import QuestionStatistics from "./QuestionStatistics"

export default class Statistics {
	comboHit: number
	comboMiss: number
	questions: Map<string, QuestionStatistics>

	constructor() {
		this.comboHit = 0
		this.comboMiss = 0
		this.questions = new Map<string, QuestionStatistics>()

	}
}