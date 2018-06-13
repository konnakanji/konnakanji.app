import QuestionStatistics from "./QuestionStatistics"

export default class Statistics {
	hits: number
	misses: number
	comboHits: number
	comboMisses: number
	highestCombo: number
	questions: Map<string, QuestionStatistics>

	constructor() {
		this.hits = 0
		this.misses = 0
		this.comboHits = 0
		this.comboMisses = 0
		this.highestCombo = 0
		this.questions = new Map<string, QuestionStatistics>()
	}

	static hit(self: Statistics) {
		self.hits++
		self.comboHits++
		self.comboMisses = 0

		if(self.comboHits > self.highestCombo) {
			self.highestCombo = self.comboHits
		}
	}

	static miss(self: Statistics) {
		self.misses++
		self.comboHits = 0
		self.comboMisses++
	}
}