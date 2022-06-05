<template>
  <canvas class="game" ref="game" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import {
  Engine,
  Scene,
  FreeCamera,
  HemisphericLight,
  Vector3,
  CreateGround,
  CreateSphere,
  ShadowGenerator,
  DirectionalLight,
  Color3,
  Color4,
} from "babylonjs"
import { getMaterial } from "../game"

const game = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  if (game.value) initialize(game.value)
})

const initialize = (canvas: HTMLCanvasElement) => {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
  const createScene = function () {
    const scene = new Scene(engine)
    scene.clearColor = new Color4(0, 0, 0, 1)

    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene)
    camera.setTarget(Vector3.Zero())
    camera.attachControl(canvas, false)

    // Lights
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene)
    light.intensity = 0.25

    var light2 = new DirectionalLight("dir01", new Vector3(-1, -1.5, 1), scene)
    light2.position = new Vector3(0, 30, -5)
    light2.intensity = 0.75

    // Objects
    const sphere = CreateSphere("sphere1", { diameter: 4 }, scene)
    sphere.position.y = 1
    const ground = CreateGround("ground1", { width: 10, height: 10 }, scene)

    // Textures
    sphere.material = getMaterial("sapphire", scene)
    ground.material = getMaterial("stone", scene)

    // Shadows
    var shadowGenerator = new ShadowGenerator(1024, light2)
    shadowGenerator.addShadowCaster(sphere)
    shadowGenerator.useExponentialShadowMap = true
    ground.receiveShadows = true

    scene.debugLayer.show()

    return scene
  }

  const scene = createScene()
  engine.runRenderLoop(() => scene.render())
  window.addEventListener("resize", () => engine.resize())
}
</script>

<style lang="sass">
.game
  width: 100%
  height: 100%
</style>
