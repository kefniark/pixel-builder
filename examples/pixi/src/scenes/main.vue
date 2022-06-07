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

for (let i = 0; i < 200; i++) {
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

for (let i = 0; i < 200; i++) {
  world.createEntity(["position", "animatedsprite"], {
    position: { x: Math.random() * 2000, y: Math.random() * 2000, rotation: Math.random() * Math.PI * 2 },
    animatedsprite: {
      spritesheet: "field_spritesheet",
      name: "tree96x96transparentanimated",
      speed: 0.167,
    },
  })
}

for (let i = 0; i < 200; i++) {
  world.createEntity(["position", "animatedsprite"], {
    position: { x: Math.random() * 2000, y: Math.random() * 1000 },
    animatedsprite: {
      spritesheet: "dungeon_spritesheet",
      name: "torch_anim_f",
      scale: 3,
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
}, 1000)

const q = world.createQuery(["position"])
setInterval(() => {
  console.log()
  q.random(1).forEach((x) => world.removeEntity(x))
}, 250)

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
