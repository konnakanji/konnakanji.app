import QuestionStatistics from "./QuestionStatistics"

export default class Statistics {
	hits: number
	misses: number
	comboHits: number
	comboMisses: number
	questions: Map<string, QuestionStatistics>

	constructor() {
		this.comboHits = 0
		this.comboMisses = 0
		this.questions = new Map<string, QuestionStatistics>()
	}
}