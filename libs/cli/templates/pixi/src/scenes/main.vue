<template>
  <div class="game" ref="game"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import {
  loadSpritesheets,
  Components,
  WorldComponents,
  WorldContext,
  InputSystem,
  SpriteRendererSystem,
  MovementSystem,
} from "../game"
import { createWorld } from "@pixel-builder/ecs"
import { Application } from "pixi.js"

// load assets
const spritesheets = loadSpritesheets()

// create pixi application
const app = new Application({ width: 1280, height: 720 })

// mount pixi in DOM
const game = ref<HTMLElement | null>(null)
onMounted(() => game.value?.appendChild(app.view))

// create game world
const world = createWorld<WorldContext, WorldComponents>({ app, spritesheets }, Components)
world.addSystem("input", InputSystem)
world.addSystem("input", MovementSystem)
world.addSystem("frame", SpriteRendererSystem)

for (let i = 0; i < 150; i++) {
  world.createEntity(["input", "position", "velocity", "sprite"], {
    position: { x: Math.random() * 1000, y: Math.random() * 1000, rotation: Math.random() * Math.PI * 2 },
    sprite: {
      spritesheet: "car_spritesheet",
      name: "",
      frames: Array.from(Array(16).keys()).map((x) =>
        x + 1 >= 10 ? `car_topdown00${x + 1}` : `car_topdown000${x + 1}`
      ),
    },
  })
}

setInterval(() => {
  world.createEntity(["input", "position", "velocity", "sprite"], {
    position: { x: Math.random() * 1000, y: Math.random() * 1000, rotation: Math.random() * Math.PI * 2 },
    sprite: {
      spritesheet: "car_spritesheet",
      name: "",
      frames: Array.from(Array(16).keys()).map((x) =>
        x + 1 >= 10 ? `car_topdown00${x + 1}` : `car_topdown000${x + 1}`
      ),
    },
  })
}, 100)

const query = world.createQuery(["position"])
setInterval(() => {
  const { entities } = query()
  const first = entities.shift()
  if (first) {
    world.removeEntity(first)
  }
}, 1000)

app.ticker.add((time) => {
  world.updateSystems(["input", "frame"], time * 16)
  world.cleanup()
})
</script>

<style lang="sass">
.game
    width: 100%
    height: 100%

    canvas
        width: 100%
        height: 100%
</style>
