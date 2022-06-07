import { createWorld } from "@pixel-builder/ecs"

// create convas
const canvas = document.createElement("canvas")
canvas.width = 1280
canvas.height = 720
canvas.style.background = "transparent"

const ctx = canvas.getContext("2d")
document.getElementById("app")?.appendChild(canvas)
if (!ctx) throw new Error("")

function randomHexColor() {
  let val = "#"
  for (let i = 0; i < 3; i++) {
    val += Math.floor(Math.random() * 255)
      .toString(16)
      .padStart(2, "0")
  }
  return val
}

function getGradient(colors: string[]) {
  const gradient = (ctx as CanvasRenderingContext2D).createLinearGradient(0, 0, 1000, 1000)
  const t = colors.length
  let i = 0
  for (let color of colors) {
    gradient.addColorStop(i / (t - 1), color)
    i++
  }
  return gradient
}

// create components
const components = {
  rect: { x: 0, y: 0, w: 100, h: 100, colors: ["#FFFFFF", "#000000"] },
  disc: { x: 0, y: 0, r: 50, colors: ["#FFFFFF", "#000000"] },
  move: { dx: 0, dy: 0 },
}

// create world & system
const world = createWorld({}, components)

world.addSystem("move", () => {
  const queryRect = world.createQuery(["rect", "move"])
  const queryDisc = world.createQuery(["disc", "move"])
  return {
    name: "",
    update(dt) {
      for (const entity of queryRect.entities()) {
        entity.rect.x += entity.move.dx * dt
        entity.rect.y += entity.move.dy * dt
        if (entity.rect.x < 0 || entity.rect.x > 1280 - entity.rect.w) entity.move.dx *= -1
        if (entity.rect.y < 0 || entity.rect.y > 720 - entity.rect.h) entity.move.dy *= -1
      }
      for (const entity of queryDisc.entities()) {
        entity.disc.x += entity.move.dx * dt
        entity.disc.y += entity.move.dy * dt
        if (entity.disc.x < 0 || entity.disc.x > 1280 - entity.disc.r) entity.move.dx *= -1
        if (entity.disc.y < 0 || entity.disc.y > 720 - entity.disc.r) entity.move.dy *= -1
      }
    },
  }
})

world.addSystem("render", () => {
  const query = world.createQuery(["rect"])
  return {
    name: "",
    update() {
      for (const entity of query.entities()) {
        ctx.beginPath()
        ctx.fillStyle = getGradient(entity.rect.colors)
        ctx.fillRect(entity.rect.x, entity.rect.y, entity.rect.w, entity.rect.h)
        ctx.stroke()
      }
    },
  }
})

world.addSystem("render", () => {
  const query = world.createQuery(["disc"])
  return {
    name: "",
    update() {
      for (const entity of query.entities()) {
        ctx.beginPath()
        ctx.fillStyle = getGradient(entity.disc.colors)
        ctx.arc(entity.disc.x, entity.disc.y, entity.disc.r, 0, 2 * Math.PI)
        ctx.fill()
      }
    },
  }
})

const colors = () => [randomHexColor(), randomHexColor(), randomHexColor(), randomHexColor(), randomHexColor()]
const pos = () => Math.random() * 250 + 200

for (let i = 0; i < 50; i++) {
  world.createEntity(["rect", "move"], {
    rect: { x: pos(), y: pos(), colors: colors() },
    move: { dx: Math.random() - 0.5, dy: Math.random() - 0.5 },
  })
  world.createEntity(["disc", "move"], {
    disc: { x: pos(), y: pos(), r: Math.random() * 60 + 10, colors: colors() },
    move: { dx: Math.random() - 0.5, dy: Math.random() - 0.5 },
  })
}

// update loop
let lasttime = 0
const update = (time: number) => {
  const dt = time - lasttime
  lasttime = time
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  world.updateSystems(["move", "render"], dt)
  requestAnimationFrame(update)
}

update(0)
