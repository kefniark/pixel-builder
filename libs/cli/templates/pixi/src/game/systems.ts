import { WorldComponents, WorldContext } from "./components"
import { System, World } from "@pixel-builder/ecs"
import { Sprite } from "pixi.js"

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

export const InputSystem = (world: World<WorldContext, WorldComponents>): System => {
  let driver_throttle = 0
  let driver_break = 0
  let driver_turn = 0

  const pushKey = (evt: KeyboardEvent) => {
    if (evt.key === "ArrowLeft") driver_turn = -1
    if (evt.key === "ArrowRight") driver_turn = 1
    if (evt.key === "ArrowUp") driver_throttle = 1
    if (evt.key === "ArrowDown") driver_break = 1
  }

  const releaseKey = (evt: KeyboardEvent) => {
    if (evt.key === "ArrowLeft") driver_turn = 0
    if (evt.key === "ArrowRight") driver_turn = 0
    if (evt.key === "ArrowUp") driver_throttle = 0
    if (evt.key === "ArrowDown") driver_break = 0
  }

  const query = world.createQuery(["input"])
  return {
    mounted() {
      document.addEventListener("keydown", pushKey)
      document.addEventListener("keyup", releaseKey)
    },
    unmounted() {
      document.removeEventListener("keydown", pushKey)
      document.removeEventListener("keyup", releaseKey)
    },
    update() {
      const { entities } = query()
      for (const ent of entities) {
        ent.input.throttle = driver_throttle
        ent.input.break = driver_break
        ent.input.turn = driver_turn
      }
    },
  }
}

export const MovementSystem = (world: World<WorldContext, WorldComponents>): System => {
  const query = world.createQuery(["input", "position", "velocity"])

  return {
    update(dt) {
      const { entities } = query()
      for (const ent of entities) {
        const forceTraction = ent.input.throttle * 50
        const forceBreak = ent.input.break * -50
        const forceDrag = ent.velocity.speed * Math.abs(ent.velocity.speed) * -0.005
        const forceFriction = ent.velocity.speed * -0.25

        const acc = forceTraction + forceBreak + forceDrag + forceFriction

        ent.velocity.speed += dt * acc * 0.001
        if (ent.velocity.speed > 0.25) {
          ent.position.x += ent.velocity.speed * Math.cos(ent.position.rotation) * dt * 0.01
          ent.position.y += ent.velocity.speed * -Math.sin(ent.position.rotation) * dt * 0.01
        }

        if (ent.input.turn > 0) {
          ent.position.rotation = mod(ent.position.rotation - 0.001 * dt, Math.PI * 2)
        } else if (ent.input.turn < 0) {
          ent.position.rotation = mod(ent.position.rotation + 0.001 * dt, Math.PI * 2)
        }
      }
    },
  }
}

export const SpriteRendererSystem = (world: World<WorldContext, WorldComponents>): System => {
  const sprites = new Map<string, Sprite>()
  const query = world.createQuery(["position", "sprite"])

  return {
    update() {
      const { app, spritesheets } = world.context
      const { added, entities, removed } = query()
      for (const entity of entities) {
        if (added.has(entity.__uuid)) {
          const sheet = spritesheets[entity.sprite.spritesheet]
          if (!sheet) continue

          const name =
            !entity.sprite.name && entity.sprite.frames.length > 0 ? entity.sprite.frames[0] : entity.sprite.name
          const sprite = new Sprite(sheet.textures[name])
          sprites.set(entity.__uuid, sprite)
          sprite.anchor.set(0.5)

          app.stage.addChild(sprite)
        }

        const sprite = sprites.get(entity.__uuid)
        if (!sprite) continue

        sprite.x = entity.position.x
        sprite.y = entity.position.y

        const sheet = spritesheets[entity.sprite.spritesheet]
        if (!sheet) continue

        const idx = Math.round((entity.position.rotation / 2 / Math.PI) * 16) % 16
        const spriteName = entity.sprite.frames[idx]
        if (sprite.texture != sheet.textures[spriteName]) sprite.texture = sheet.textures[spriteName]
      }

      for (const entId of removed) {
        const sprite = sprites.get(entId)
        if (!sprite) continue
        sprite.destroy()
        sprites.delete(entId)
      }
    },
  }
}
