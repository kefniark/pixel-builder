import { describe, expect, test } from "vitest"
import { createWorld } from "."

test("World Creation", () => {
  const world = createWorld({}, {})
  expect(world).toBeDefined()
})

describe("Entity & Components", () => {
  test("Component Create", () => {
    const world = createWorld({}, { test: { a: 1, b: 0 } })

    const entity = world.createEntity(["test"])
    expect(entity.test.a).toBe(1)
    expect(entity.test.b).toBe(0)

    const entity2 = world.createEntity(["test"], { test: { a: 5 } })
    expect(entity2.test.a).toBe(5)
    expect(entity2.test.b).toBe(0)
  })

  test("Component Remove", () => {
    const world = createWorld({}, { test: { a: 1, b: 0 } })
    const query = world.createQuery(["test"])

    const entity = world.createEntity(["test"])

    // after creation
    expect([...query.added()]).toEqual([entity.__uuid])
    expect(query.entities()).toEqual([entity])
    expect([...query.removed()]).toEqual([])

    world.cleanup()
    world.removeComponent(entity, "test")

    // after deletion
    expect([...query.added()]).toEqual([])
    expect(query.entities()).toEqual([entity])
    expect([...query.removed()]).toEqual([entity.__uuid])

    world.cleanup()

    // one frame later
    expect([...query.added()]).toEqual([])
    expect(query.entities()).toEqual([])
    expect([...query.removed()]).toEqual([])
  })

  test("Component Entity", () => {
    const world = createWorld({}, { test: { a: 1, b: 0 } })
    const query = world.createQuery(["test"])

    const entity = world.createEntity(["test"])

    // after creation
    expect([...query.added()]).toEqual([entity.__uuid])
    expect(query.entities()).toEqual([entity])
    expect([...query.removed()]).toEqual([])

    world.cleanup()
    world.removeEntity(entity)

    // after deletion
    expect([...query.added()]).toEqual([])
    expect(query.entities()).toEqual([entity])
    expect([...query.removed()]).toEqual([entity.__uuid])

    world.cleanup()

    // one frame later
    expect([...query.added()]).toEqual([])
    expect(query.entities()).toEqual([])
    expect([...query.removed()]).toEqual([])
  })
})

describe("Queries", () => {
  test("Create Query", () => {
    const world = createWorld({}, { test: { a: 1, b: 0 }, test2: { a: 0 } })

    const q1 = world.createQuery(["test"])
    const q2 = world.createQuery(["test2"])

    const a = world.createEntity(["test"])
    const b = world.createEntity(["test2"])
    const c = world.createEntity(["test", "test2"])

    expect([...q1.added()]).toEqual([a.__uuid, c.__uuid])
    expect(q1.entities()).toEqual([a, c])
    expect(q2.entities()).toEqual([b, c])

    world.cleanup()

    expect([...q1.added()]).toEqual([])
    expect(q1.entities()).toEqual([a, c])

    const d = world.createEntity(["test"])

    expect([...q1.added()]).toEqual([d.__uuid])
    expect(q1.entities()).toEqual([a, c, d])

    world.cleanup()

    expect([...q1.added()]).toEqual([])
    expect(q1.entities()).toEqual([a, c, d])
  })

  test("Create Query After", () => {
    const world = createWorld({}, { test: { a: 1, b: 0 }, test2: { a: 0 } })

    const a = world.createEntity(["test"])
    const b = world.createEntity(["test2"])
    const c = world.createEntity(["test", "test2"])

    const q1 = world.createQuery(["test"])
    const q2 = world.createQuery(["test2"])

    expect([...q1.added()]).toEqual([a.__uuid, c.__uuid])
    expect(q1.entities()).toEqual([a, c])
    expect(q2.entities()).toEqual([b, c])

    world.cleanup()

    expect([...q1.added()]).toEqual([])
    expect(q1.entities()).toEqual([a, c])

    const d = world.createEntity(["test"])

    expect([...q1.added()]).toEqual([d.__uuid])
    expect(q1.entities()).toEqual([a, c, d])

    world.cleanup()

    expect([...q1.added()]).toEqual([])
    expect(q1.entities()).toEqual([a, c, d])
  })
})

describe("System", () => {
  test("Create Query", () => {
    const world = createWorld({}, { test: { a: 1, b: 0 }, test2: { a: 0 } })

    let total = 0

    world.addSystem("input", () => {
      return {
        update(dt) {
          total += dt
        },
      }
    })

    world.addSystem("test", () => {
      return {
        update(dt) {
          total += dt
        },
      }
    })

    world.updateSystems(["input"], 12)
    expect(total).toBe(12)
  })
})
