export default class ServiceWorkerManager {
	uri: string
	registration: ServiceWorkerRegistration

	constructor(uri: string) {
		this.uri = uri
	}

	async register() {
		if(!("serviceWorker" in navigator)) {
			console.warn("service worker not supported, skipping registration")
			return
		}

		// Register service worker
		try {
			this.registration = await navigator.serviceWorker.register(this.uri)
		} catch(err) {
			console.error(err)
			return
		}

		// Listen to messages
		navigator.serviceWorker.addEventListener("message", evt => this.onMessage(evt))
	}

	postMessage(message: any) {
		navigator.serviceWorker.controller.postMessage(JSON.stringify(message))
	}

	onMessage(evt: ServiceWorkerMessageEvent) {
		const message = JSON.parse(evt.data)

		switch(message.type) {
			// ...
		}
	}
}