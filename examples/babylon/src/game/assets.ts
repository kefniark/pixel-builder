import { Scene, StandardMaterial, Texture } from "babylonjs"
import sapphireDiffuse from "../assets/sapphire_color.jpg"
import sapphireBump from "../assets/sapphire_normal.jpg"
import stoneDiffuse from "../assets/stone_color.jpg"
import stoneBump from "../assets/stone_normal.jpg"
import stoneSpec from "../assets/stone_spec.jpg"

export const getMaterial = (name: string, scene: Scene) => {
  if (name === "sapphire") {
    const material = new StandardMaterial("safMat")
    material.diffuseTexture = new Texture(sapphireDiffuse, scene)
    material.bumpTexture = new Texture(sapphireBump, scene)
    material.invertNormalMapX = true
    material.invertNormalMapY = true
    return material
  }

  if (name === "stone") {
    const material = new StandardMaterial("stoneMat")
    material.diffuseTexture = new Texture(stoneDiffuse, scene)
    material.bumpTexture = new Texture(stoneBump, scene)
    material.specularTexture = new Texture(stoneSpec, scene)
    material.invertNormalMapX = true
    material.invertNormalMapY = true
    return material
  }

  throw new Error(`Unknown Material : ${name}`)
}
