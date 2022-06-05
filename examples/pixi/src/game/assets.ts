import { Spritesheet, Texture } from "pixi.js"

import carSpritesheet from "../assets/car_spritesheet.json"
import carSpritesheetImg from "../assets/car_spritesheet.png"

export function loadSpritesheets() {
  const car_spritesheet = new Spritesheet(Texture.from(carSpritesheetImg), carSpritesheet)
  car_spritesheet.parse(() => {})

  return { car_spritesheet }
}
