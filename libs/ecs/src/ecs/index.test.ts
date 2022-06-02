import { expect, test } from "vitest"
import { createWorld } from "."

test("World Creation", () => {
  const world = createWorld({}, {})
  expect(world).toBeDefined()
})

test("Component Create", () => {
  const world = createWorld({}, { test: { a: 1, b: 0 } })

  const entity = world.createEntity(["test"])
  expect(entity.test.a).toBe(1)
  expect(entity.test.b).toBe(0)

  const entity2 = world.createEntity(["test"], { test: { a: 5 } })
  expect(entity2.test.a).toBe(5)
  expect(entity2.test.b).toBe(0)
})

test("Create Query", () => {
  const world = createWorld({}, { test: { a: 1, b: 0 }, test2: { a: 0 } })

  const q1 = world.createQuery(["test"])
  const q2 = world.createQuery(["test2"])

  const a = world.createEntity(["test"])
  const b = world.createEntity(["test2"])
  const c = world.createEntity(["test", "test2"])

  expect(q1("added")).toEqual([a, c])
  expect(q1()).toEqual([a, c])
  expect(q2()).toEqual([b, c])

  world.cleanup()

  expect(q1("added")).toEqual([])
  expect(q1()).toEqual([a, c])

  const d = world.createEntity(["test"])

  expect(q1("added")).toEqual([d])
  expect(q1()).toEqual([a, c, d])

  world.cleanup()

  expect(q1("added")).toEqual([])
  expect(q1()).toEqual([a, c, d])
})

test("Create Query After", () => {
  const world = createWorld({}, { test: { a: 1, b: 0 }, test2: { a: 0 } })

  const a = world.createEntity(["test"])
  const b = world.createEntity(["test2"])
  const c = world.createEntity(["test", "test2"])

  const q1 = world.createQuery(["test"])
  const q2 = world.createQuery(["test2"])

  expect(q1("added")).toEqual([a, c])
  expect(q1()).toEqual([a, c])
  expect(q2()).toEqual([b, c])

  world.cleanup()

  expect(q1("added")).toEqual([])
  expect(q1()).toEqual([a, c])

  const d = world.createEntity(["test"])

  expect(q1("added")).toEqual([d])
  expect(q1()).toEqual([a, c, d])

  world.cleanup()

  expect(q1("added")).toEqual([])
  expect(q1()).toEqual([a, c, d])
})
