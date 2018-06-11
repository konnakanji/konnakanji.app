import State from "./State"
import shuffle from "./shuffle"

export default function filterQuestions(questions: string[]) {
	const now = Date.now()

	questions = questions.filter(question => {
		let stats = State.user.statistics.questions.get(question)

		// Questions with no stats are always included
		if(!stats || stats.comboHit === 0) {
			return true
		}

		// Time since last answering that question
		const since = now - stats.lastAppearance

		// 1 combo: 5 minutes
		if(stats.comboHit === 1 && since > 5 * 60000) {
			return true
		}

		// 2 combo: 60 minutes
		if(stats.comboHit === 2 && since > 60 * 60000) {
			return true
		}

		// 3 combo: 24 hours
		if(stats.comboHit === 3 && since > 24 * 60 * 60000) {
			return true
		}

		// 4 combo: 1 week
		if(stats.comboHit === 4 && since > 7 * 24 * 60 * 60000) {
			return true
		}

		// 5+ combo: 1 month
		if(stats.comboHit >= 5 && since > 30 * 24 * 60 * 60000) {
			return true
		}

		return false
	})

	return shuffle(questions)
}