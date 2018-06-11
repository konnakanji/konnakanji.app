import Statistics from "./Statistics"

const version = "beta-1"

export default class User {
	id: string
	statistics: Statistics

	constructor(id: string) {
		this.id = id
		this.statistics = new Statistics()
		this.load()
	}

	save() {
		let start = performance.now()
		let json = JSON.stringify(this, replacer)
		localStorage.setItem("User:" + this.id, json)
		// console.log("save user", performance.now() - start)
	}

	load() {
		const savedVersion = localStorage.getItem("version")

		if(savedVersion !== version) {
			localStorage.clear()
			localStorage.setItem("version", version)
			return
		}

		let start = performance.now()
		let json = localStorage.getItem("User:" + this.id)

		if(!json) {
			return
		}

		let parsed = JSON.parse(json, reviver) as User
		this.statistics = parsed.statistics
		// console.log("load user", performance.now() - start)
	}
}

function replacer(key, value) {
	if(value && value.__proto__ === Map.prototype) {
		return {
			_type: "map",
			map: [...value]
		}
	}

	return value
}

function reviver(key, value) {
	if(value && value._type === "map") {
		return new Map(value.map)
	}

	return value
}