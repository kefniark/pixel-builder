## Pixel-Builder - ECS 🚀

Entity Component System for Pixel Builder.

For more informations, please check our [Pixel Builder Website](https://kefniark.github.io/pixel-builder/)

---

## Description ✈️

The goal of this ECS is to be lightweight, accessible, not verbose and fully typed.

If you are looking for something more advanced and focused on performances, I would recommend you other libraries ([Bitecs](https://github.com/NateTheGreatt/bitECS) or [Harmony-ecs](https://github.com/3mcd/harmony-ecs))

---

## Getting Started 📦

### Create a world

```ts
import { createWorld } from "@pixel-builder/ecs"

// define all your components (schema and default values)
const components = {
  position: { x: 0, y: 0 },
  sprite: { name: "default", scale: 1 },
}

// create a world with those components
const world = createWorld({}, components)
```

### Create Entities

```ts
// from there you can create entities and attach components
const ent = world.createEntity()
world.addComponent("position", { x: 5 })

// you can also do both in a one-liner
world.createEntity(["position"], { position: { x: 5 } })
```

### Create Systems and Queries

```ts
// create different system to interact with those components
world.addSystem("move", () => {
  const query = world.createQuery(["position"])
  return {
    update(dt: number) {
      const { entities } = query()
      for (const entity of entities) {
        entity.position.x += dt
      }
    },
  }
})

// ...

// update those systems
world.updateSystems("move", time)
```

---

## Extra 💥

### World Context

To make interaction with third party librairies easier (physics, networking, audio, ...), when creating a world, simply pass a context object. This will be carried over and accessible in every systems.

This context allow to avoid usage of Singleton, and keep the code testable and modular

```ts
interface WorldContext {
  app: Application // some third party library
}

const world = createWorld<WorldContext, WorldComponents>({ app }, components)

// then later in systems
export const MovementSystem = (world: World<WorldContext, WorldComponents>): System => {
  const query = world.createQuery(["input", "position"])

  return {
    update(dt) {
      const { entities } = query()
      for (const ent of entities) {
        world.context.app // <= here you can access your object
      }
    },
  }
}
```

### Component Added

When a component is added or removed, it can be useful to run some specific code.
For that, Queries allow to filter entity `added` or `removed`.

- Those are `Set<string>` containing entity id
- `added` and `removed` are per query (changed since last query call)

```ts
const query = world.createQuery(["input", "position"])

const assets = new Map<string, ASSET>()
return {
  update(dt) {
    const { entities, added, removed } = query()
    for (const ent of entities) {
      // thats a new component do something
      if (added.has(entity.__uuid)) {
        assets.set(entity.__uuid, new ASSET())
      }

      // normal update code
      const asset = assets.get(entity.__uuid)
      if (!asset) continue
    }

    // do some cleanup there
    for (const id of removed) {
      const asset = assets.get(id)
      if (!asset) continue

      asset.destroy()
      assets.delete(id)
    }
  },
}
```
