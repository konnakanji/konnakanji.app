// pack:ignore
// This is the service worker for konnakanji.app.

// MyServiceWorker is the process that controls all the tabs in a browser.
class MyServiceWorker {
	cache: MyCache

	constructor() {
		this.cache = new MyCache("v-1")

		self.addEventListener("install", (evt: InstallEvent) => evt.waitUntil(this.onInstall(evt)))
		self.addEventListener("activate", (evt: any) => evt.waitUntil(this.onActivate(evt)))
		self.addEventListener("fetch", (evt: FetchEvent) => evt.waitUntil(this.onRequest(evt)))
		self.addEventListener("message", (evt: any) => evt.waitUntil(this.onMessage(evt)))
		self.addEventListener("push", (evt: PushEvent) => evt.waitUntil(this.onPush(evt)))
		self.addEventListener("pushsubscriptionchange", (evt: any) => evt.waitUntil(this.onPushSubscriptionChange(evt)))
		self.addEventListener("notificationclick", (evt: NotificationEvent) => evt.waitUntil(this.onNotificationClick(evt)))
	}

	async onInstall(evt: InstallEvent) {
		console.log("service worker install")

		await self.skipWaiting()
		await this.installCache()
	}

	async onActivate(evt: any) {
		console.log("service worker activate")

		// Only keep current version of the cache and delete old caches
		let cacheWhitelist = [this.cache.name]
		let keyList = await caches.keys()

		await Promise.all(keyList.map(key => {
			if(cacheWhitelist.indexOf(key) === -1) {
				return caches.delete(key)
			}
		}))

		// Immediate claim helps us gain control over a new client immediately
		await self.clients.claim()
	}

	// onRequest intercepts all browser requests.
	// Simply returning, without calling evt.respondWith(),
	// will let the browser deal with the request normally.
	onRequest(evt: FetchEvent) {
		let request = evt.request as Request

		// If it's not a GET request, fetch it normally.
		// Let the browser handle XHR upload requests via POST,
		// so that we can receive upload progress events.
		if(request.method !== "GET") {
			return
		}

		// DevTools opening will trigger these "only-if-cached" requests.
		// https://bugs.chromium.org/p/chromium/issues/detail?id=823392
		if((request.cache as string) === "only-if-cached" && request.mode !== "same-origin") {
			return
		}

		return evt.respondWith(this.networkFirst(request))
	}

	async networkFirst(request: Request) {
		let response: Response

		try {
			response = await fetch(request)

			if(!response.ok) {
				throw "Invalid response"
			}

			// Store in cache
			let clone = response.clone()
			this.cache.store(request, clone)
		} catch(err) {
			response = await this.cache.serve(request)
		}

		return response
	}

	// installCache is called when the service worker is installed for the first time.
	async installCache() {
		let urls = [
			"/",
			"/scripts",
			"/styles",
			"/manifest.json",
			"/images/brand/192.png",
			"/words/people.txt",
			"/words/occupations.txt",
			"/words/family.txt",
			"/words/body.txt",
			"/words/animals.txt",
			"/words/actions.txt",
			"/words/jlpt/n5.txt",
			"/words/jlpt/n4.txt",
			"/words/jlpt/n3.txt",
			"/words/jlpt/n2.txt",
			"/words/jlpt/n1.txt",
		]

		let fetches = urls.map(url => {
			let request = new Request(url, {
				credentials: "same-origin",
				mode: "cors"
			})

			return fetch(request).then(response => this.cache.store(request, response))
		})

		return Promise.all(fetches)
	}

	// onMessage is called when the service worker receives a message from a client (browser tab).
	async onMessage(evt: ServiceWorkerMessageEvent) {
		// ...
	}

	// onPush is called on push events and requires the payload to contain JSON information about the notification.
	async onPush(evt: PushEvent) {
		// ...
	}

	// onPushSubscriptionChange is called when the push subscription is updated.
	async onPushSubscriptionChange(evt: any) {
		// ...
	}

	// onNotificationClick is called when the user clicks on a notification.
	async onNotificationClick(evt: NotificationEvent) {
		// ...
	}
}


// MyCache is the cache used by the service worker.
class MyCache {
	name: string

	constructor(name: string) {
		this.name = name
	}

	clear() {
		return caches.delete(this.name)
	}

	async store(request: RequestInfo, response: Response) {
		try {
			// This can fail if the disk space quota has been exceeded.
			let cache = await caches.open(this.name)
			await cache.put(request, response)
		} catch(err) {
			console.log("Disk quota exceeded, can't store in cache:", request, response, err)
		}
	}

	async serve(request: RequestInfo): Promise<Response> {
		let cache = await caches.open(this.name)
		let response = await cache.match(request)

		if(response) {
			return response
		}

		return Promise.reject(null)
	}
}

// Initialize the service worker
const serviceWorker = new MyServiceWorker()
