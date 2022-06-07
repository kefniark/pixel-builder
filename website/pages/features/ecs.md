# Entity Component System (ECS)

## Description

Entity-Component–System (ECS) is an architectural pattern and a functional approach widely used in game application development.
ECS follows the composition over the inheritance principle, which offers better flexibility and helps you to identify entities where all objects in a game’s scene are considered an entity.

- Entity:
  - An entity is a distinct object representing an actor in a simulated space (Equivalent of a class instance)
  - In most ECS system, entity has no properties or just a unique ID
  - Example: Player, Cat, Tree, ...
- Component:
  - Components are pure data, representing and store properties for one specific behavior
  - Components are attached to entities, which make them reusable and composable
  - Example: PositionComponent, InputComponent, PhysicsComponent
- System:
  - System are pure logic, a function which will often run at a predefined pace (each frame, each second, ...)
  - System will query set of specific components and do apply some logic on them
  - Example: `PhysicsSystem` will use `PhysicsComponent` data to calculate and update `PositionComponent`

## Pixel Builder

Pixel Builder comes with his own Entity Component System, simple and fully typed.

Which makes it easy to get started for small games or prototypes

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
  const queryEntities = world.createQuery(["position"])
  return {
    update(dt: number) {
      for (const entity of queryEntities()) {
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
  const queryEntities = world.createQuery(["input", "position"])

  return {
    update(dt) {
      for (const ent of queryEntities()) {
        world.context.app // <= here you can access your object
      }
    },
  }
}
```

### Component Added

When a component is added or removed, it can be useful to run some specific code.
For that, Query allow to filter entity `added` or `removed` in the same frame.

```ts
const queryEntities = world.createQuery(["input", "position"])

return {
  update(dt) {
    for (const ent of queryEntities("added")) {
      // only new components
    }

    for (const ent of queryEntities()) {
      // all components
    }

    for (const ent of queryEntities("removed")) {
      // only removed components
    }
  },
}
```

P.S. `added` and `removed` are only available in the same update loop, so it depends on the system execution order.
