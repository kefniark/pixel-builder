import { createWorld } from "@pixel-builder/ecs"
import { test, expect, describe } from "vitest"
import { Components, WorldComponents } from "./components"

describe("Group of test", () => {
  test("Test an entity", () => {
    const world = createWorld<unknown, WorldComponents>({}, Components)

    const entity = world.createEntity(["position"], {
      position: { x: 5 },
    })

    expect(entity.position.x).toBe(5)
  })

  test("Also works with async operation", async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(true).toBeTruthy()
  })
})
