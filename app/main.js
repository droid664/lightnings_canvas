import './style.css'

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const circles = []
const mouse = {
	x: 0,
	y: 0,
}

class Circle {
	constructor(canvas, context, mouseControl = false, mouseCoords) {
		this.canvas = canvas
		this.ctx = context
		this.width = 50
		this.height = 50
		this.size = 50
		this.x = getRandomInt(this.size, this.canvas.width - this.size)
		this.y = getRandomInt(this.size, this.canvas.height - this.size)
		this.mouseControl = mouseControl
		this.mouseCoords = mouseCoords
	}
	draw() {
		if (this.mouseControl) {
			this.update()
		}

		this.ctx.beginPath()
		this.ctx.strokeStyle = 'red'
		this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
		this.ctx.stroke()
		this.ctx.closePath()
		this.ctx.beginPath()
		this.ctx.fillStyle = 'white'
		this.ctx.arc(this.x, this.y, this.size * 0.2, 0, 2 * Math.PI)
		this.ctx.fill()
		this.ctx.closePath()

		return this
	}
	update() {
		this.x = this.mouseCoords.x
		this.y = this.mouseCoords.y

		return this
	}
}

class Lightnings {
	constructor(canvas, context) {
		this.canvas = canvas
		this.context = context
		this.maxDistance = 800
		this.stepLength = 2
		this.maxOffset = 6

		this.init()
	}
	init() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
	}
	near() {
		for (let i = 0; i < circles.length; i++) {
			for (let j = 0; j < circles.length; j++) {
				const bodyA = circles[i]
				const bodyB = circles[j]

				if (bodyA === bodyB) continue

				const dist = getDistance(bodyA, bodyB)

				if (dist <= this.maxDistance) {
					this.createLight(bodyA, bodyB, dist)
				}
			}
		}

		return this
	}
	createLight(bodyA, bodyB, dist) {
		let steps = Math.floor(dist / this.stepLength)
		let chance = Math.random() > dist / this.maxDistance

		if (chance) {
			let dx = bodyA.x
			let dy = bodyA.y

			this.context.beginPath()
			this.context.lineWidth = 3
			this.context.strokeStyle = `rgba(0, 0, 255, ${this.maxDistance - dist / this.maxDistance})`
			for (let i = steps; i > 1; i--) {
				const pathLength = getDistance(bodyA, {
					x: dx,
					y: dy,
				})
				const offset = Math.sin((pathLength / dist) * Math.PI) * this.maxOffset

				dx += (bodyB.x - dx) / i + offset * Math.random() * 2 - offset
				dy += (bodyB.y - dy) / i + offset * Math.random() * 2 - offset

				this.context.lineTo(dx, dy)
			}
			this.context.stroke()
			this.context.closePath()
		}
	}
}

const lightnings = new Lightnings(canvas, context)

function getDistance(bodyA, bodyB) {
	let a = bodyA.x - bodyB.x
	let b = bodyA.y - bodyB.y

	return Math.sqrt(a ** 2 + b ** 2)
}

function tick() {
	context.clearRect(0, 0, canvas.width, canvas.height)
	lightnings.near()
	circles.forEach((circle) => circle.draw())

	requestAnimationFrame(tick)
}
tick()

function init() {
	// TODO: создаем шары
	circles.push(
		new Circle(canvas, context),
		new Circle(canvas, context),
		new Circle(canvas, context),
		new Circle(canvas, context, true, mouse),
	)
}
init()

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

window.addEventListener('mousemove', (e) => {
	mouse.x = e.clientX
	mouse.y = e.clientY
})
