export default class TouchController {
	x: number
	y: number

	threshold: number

	leftSwipe: Function
	rightSwipe: Function
	upSwipe: Function
	downSwipe: Function

	touchStartListener: (evt: any) => void
	touchMoveListener: (evt: any) => void

	constructor() {
		this.touchStartListener = evt => this.handleTouchStart(evt)
		this.touchMoveListener = evt => this.handleTouchMove(evt)

		document.addEventListener("touchstart", this.touchStartListener, false)
		document.addEventListener("touchmove", this.touchMoveListener, false)

		this.downSwipe = this.upSwipe = this.rightSwipe = this.leftSwipe = () => null
		this.threshold = 3
	}

	unregister() {
		document.removeEventListener("touchstart", this.touchStartListener)
		document.removeEventListener("touchmove", this.touchMoveListener)
	}

	handleTouchStart(evt) {
		this.x = evt.touches[0].clientX
		this.y = evt.touches[0].clientY
	}

	handleTouchMove(evt) {
		if(!this.x || !this.y) {
			return
		}

		let xUp = evt.touches[0].clientX
		let yUp = evt.touches[0].clientY

		let xDiff = this.x - xUp
		let yDiff = this.y - yUp

		if(Math.abs(xDiff) > Math.abs(yDiff)) {
			if(xDiff > this.threshold) {
				this.leftSwipe()
			} else if(xDiff < -this.threshold) {
				this.rightSwipe()
			}
		} else {
			if(yDiff > this.threshold) {
				this.upSwipe()
			} else if(yDiff < -this.threshold) {
				this.downSwipe()
			}
		}

		this.x = undefined
		this.y = undefined
	}
}