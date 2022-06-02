import { createWorld } from "@pixel-builder/ecs"

// create convas
const canvas = document.createElement("canvas")
canvas.width = 1280
canvas.height = 720
const ctx = canvas.getContext("2d")
document.getElementById("app")?.appendChild(canvas)
if (!ctx) throw new Error("")

// create components
const components = {
  pos: { x: 0, y: 0 },
  move: { dx: 0, dy: 0 },
}

// create world & system
const world = createWorld({}, components)

world.addSystem("move", () => {
  const query = world.createQuery(["pos"])
  return {
    name: "",
    update() {
      for (const entity of query()) {
        ctx.beginPath()
        ctx.rect(entity.pos.x, entity.pos.y, 150, 100)
        ctx.stroke()
      }
    },
  }
})

world.addSystem("move", () => {
  const query = world.createQuery(["pos", "move"])
  return {
    name: "",
    update(dt) {
      for (const entity of query()) {
        entity.pos.x += entity.move.dx * dt
        entity.pos.y += entity.move.dy * dt
        if (entity.pos.x < 0 || entity.pos.x > 1280) entity.move.dx *= -1
        if (entity.pos.y < 0 || entity.pos.y > 720) entity.move.dy *= -1
      }
    },
  }
})

world.addSystem("render", () => {
  const query = world.createQuery(["pos"])
  return {
    name: "",
    update() {
      for (const entity of query()) {
        ctx.beginPath()
        ctx.rect(entity.pos.x, entity.pos.y, 150, 100)
        ctx.stroke()
      }
    },
  }
})

world.createEntity(["pos", "move"], {
  pos: { x: 10 },
  move: { dx: Math.random() - 0.5, dy: Math.random() - 0.5 },
})
world.createEntity(["pos"], { pos: { x: 150, y: 250 } })

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
