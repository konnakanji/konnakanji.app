import QuestionStatistics from "./QuestionStatistics"

export default class Statistics {
	hit: number
	miss: number
	comboHit: number
	comboMiss: number
	questions: Map<string, QuestionStatistics>

	constructor() {
		this.comboHit = 0
		this.comboMiss = 0
		this.questions = new Map<string, QuestionStatistics>()

	}
}