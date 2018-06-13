import State from "./State"
import shuffle from "./shuffle"

const minute = 60000
const hour = 60 * minute
const day = 24 * hour

const spacedRepetitionDelay = [
	// 0 combo: Always included
	0,

	// 1 combo: 5 minutes
	5 * minute,

	// 2 combo: 12 hours
	12 * hour,

	// 3 combo: 3 days
	3 * day,

	// 4 combo: 1 week
	7 * day,

	// 5+ combo: 1 month
	30 * day,
]

export default function filterQuestions(questions: string[]) {
	const now = Date.now()

	questions = questions.filter(question => {
		let stats = State.user.statistics.questions.get(question)

		// Questions with no stats are always included
		if(!stats) {
			return true
		}

		let multiplier = 1.0

		// If the user has never ever made a mistake with that question yet,
		// double the allowed downtime. This helps the user get past the
		// boring questions quicker.
		if(stats.comboMisses === 0 && stats.comboHits > 1) {
			multiplier = 2.0
		}

		// Allowed downtime since last answering that question
		const cappedCombo = Math.min(stats.comboHits, spacedRepetitionDelay.length - 1)
		const allowedDownTime = spacedRepetitionDelay[cappedCombo] * multiplier

		// Include the question if the allowed downtime has passed
		return now - stats.lastSeen > allowedDownTime
	})

	return shuffle(questions)
}