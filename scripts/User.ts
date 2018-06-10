import Statistics from "./Statistics"

export default class User {
	id: string
	statistics: Statistics

	constructor(id: string) {
		this.id = id
		this.statistics = new Statistics()
	}
}