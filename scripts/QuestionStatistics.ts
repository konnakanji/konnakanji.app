export default class QuestionStatistics {
	hits: number
	misses: number
	comboHits: number
	comboMisses: number
	lastSeen: number

	constructor() {
		this.hits = 0
		this.misses = 0
		this.comboHits = 0
		this.comboMisses = 0
		this.lastSeen = 0
	}

	static accuracy(stats: QuestionStatistics) {
		if(stats.hits === 0) {
			return 0
		}

		if(stats.misses === 0) {
			return 1
		}

		return stats.hits / (stats.hits + stats.misses)
	}
}