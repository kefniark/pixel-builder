<template>
  <canvas class="game" ref="game" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent"
import { Engine } from "@babylonjs/core/Engines/engine"
import { Scene } from "@babylonjs/core/scene"
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { Color4, Vector3 } from "@babylonjs/core/Maths/math"
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight"
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder"
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder"
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator"
import { getMaterial } from "@src/game"

const game = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  if (game.value) initialize(game.value)
})

const initialize = async (canvas: HTMLCanvasElement) => {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
  const createScene = async function () {
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

    // Show Debug Layer only in development
    if (BABYLON_DEBUG_LAYER) {
      await import("../game/debug")
      scene.debugLayer.show()
    }

    console.log(`This is my version : ${APP_VERSION}`)

    return scene
  }

  const scene = await createScene()
  engine.runRenderLoop(() => scene.render())
  window.addEventListener("resize", () => engine.resize())
}
</script>

<style lang="sass">
.game
  width: 100%
  height: 100%
</style>
