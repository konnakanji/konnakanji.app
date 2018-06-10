export default class QuestionStatistics {
	hit: number
	miss: number
	comboHit: number
	comboMiss: number
	lastAppearance: number

	constructor() {
		this.hit = 0
		this.miss = 0
		this.comboHit = 0
		this.comboMiss = 0
		this.lastAppearance = 0
	}
}