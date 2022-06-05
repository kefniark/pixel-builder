import { genId, intersects, random, union } from "./helpers"
import { Entity, Query, System } from "./interfaces"
export * from "./interfaces"

export class World<X, C> {
  //
  public context: X
  private components: C

  // map
  private entities: { [key: string]: Entity } = {}
  private componentAll: Record<string, Set<string>> = {}
  private systems: { [key: string]: System[] } = {}

  // temporary
  private entityRemove: Set<string> = new Set()
  private componentRemove: Record<string, Set<string>> = {}

  // queries
  private componentQueries: Record<string, Set<string>> = {}
  private queries: Record<string, Query> = {}
  private updatedQueries = new Set<string>()

  constructor(context: X, comps: C) {
    this.context = context
    this.components = comps
    for (const name in comps) {
      this.componentAll[name] = new Set()
      this.componentRemove[name] = new Set()
      this.componentQueries[name] = new Set()
    }
  }

  createEntity<N extends keyof C>(
    components?: N[],
    values?: Partial<{ [P in N]: Partial<C[P]> }>
  ): Entity & { [P in N]: C[P] } {
    const id = genId()
    const entity = { __uuid: id } as Entity
    if (components) {
      components.forEach((x) => this.addComponent(entity, x, values ? values[x] : undefined))
    }
    this.entities[id] = entity
    return entity as any
  }

  removeEntity(entity: Entity | undefined) {
    if (!entity) return
    this.entityRemove.add(entity.__uuid)
    for (const componentName of Object.keys(entity)) {
      if (componentName === "__uuid") continue
      this.removeComponent(entity, componentName as any)
    }
  }

  addComponent<N extends keyof C>(entity: Entity, name: N, value?: Partial<C[N]>): Entity & { [P in N]: C[P] } {
    const component = Object.assign({}, this.components[name], value ?? {})
    ;(entity as any)[name] = component
    this.componentAll[name as string].add(entity.__uuid)
    this.updateComponents(name, entity.__uuid, "added")
    return entity as any
  }

  removeComponent<N extends keyof C>(entity: Entity, name: N) {
    this.componentAll[name as string].delete(entity.__uuid)
    this.componentRemove[name as string].add(entity.__uuid)
    this.updateComponents(name, entity.__uuid, "removed")
  }

  createQuery<N extends keyof C>(names: N[]): { added: () => Set<string>, removed: () => Set<string>, random: (n: number) => (Entity & { [P in N]: C[P] })[], entities: () => (Entity & { [P in N]: C[P] })[] } {
    const id = genId()
    const query: Query = {
      __uuid: id,
      executed: false,
      changed: true,
      names: names as string[],
      entity_ids: new Set(),
      entity_added: new Set(),
      entity_removed: new Set(),
      filters: {},
      filters_added: {},
      filters_removed: {},
    }

    for (const n of names) {
      query.filters[n as string] = new Set()
      query.filters_added[n as string] = new Set()
      query.filters_removed[n as string] = new Set()

      this.componentAll[n as string].forEach((x) => {
        query.filters[n as string].add(x)
        query.filters_added[n as string].add(x)
      })
    }

    this.queries[id] = query
    names.forEach((x) => this.componentQueries[x as string].add(id))

    const refresh = () => {
      query.executed = true
      if (query.changed) {
        this.updateQuery(query)
        query.changed = false
      }
    }

    return {
      added: () => {
        refresh()
        return query.entity_added
      },
      removed: () => {
        refresh()
        return query.entity_removed
      },
      entities: () => {
        refresh()
        return [...query.entity_ids].map((x) => this.entities[x]) as any
      },
      random: (num) => {
        refresh()
        return random(num, [...query.entity_ids]).map((x) => this.entities[x]) as any
      }
    }
  }

  addSystem(key: string, system: (world: World<X, C>) => System) {
    const s = system(this)
    if (s.mounted) s.mounted()
    if (!this.systems[key]) this.systems[key] = []
    this.systems[key].push(s)
    this.systems[key].sort((a, b) => (a.priority || 1) - (b.priority || 1))
    return system
  }

  updateSystems(keys: string | string[], dt: number) {
    const arr = Array.isArray(keys) ? keys : [keys]
    const systems = arr.map((x) => this.systems[x]).flat()
    for (const s of systems) {
      if (s.update) s.update(dt)
    }
  }

  private updateQuery(query: Query) {
    query.entity_ids = new Set(intersects(Object.values(query.filters)))
    query.entity_added = new Set(union(Object.values(query.filters_added)).filter((x) => query.entity_ids.has(x)))
    query.entity_removed = new Set(union(Object.values(query.filters_removed)).filter((x) => query.entity_ids.has(x)))
  }

  private updateComponents(componentName: keyof C, entityIds: string | Set<string>, event: "added" | "removed" | "") {
    const set = entityIds instanceof Set ? entityIds : new Set([entityIds])
    if (set.size === 0) return
    const name = componentName as string
    for (const queryId of this.componentQueries[name]) {
      const query = this.queries[queryId]
      for (const entityId of set) {
        query.filters[name].add(entityId)
        if (event === "added") {
          query.filters_added[name].add(entityId)
          this.updatedQueries.add(queryId)
          query.changed = true
        } else if (event === "removed") {
          query.filters_removed[name].add(entityId)
          this.updatedQueries.add(queryId)
          query.changed = true
        }
      }
    }
  }

  cleanup() {
    // cleanup
    this.updatedQueries.clear()
    for (const query of Object.values(this.queries)) {
      if (!query.executed) continue
      Object.values(query.filters_added).forEach((x) => {
        if (x.size === 0) return
        this.updatedQueries.add(query.__uuid)
        x.clear()
      })
      Object.values(query.filters_removed).forEach((x) => {
        if (x.size === 0) return
        this.updatedQueries.add(query.__uuid)
        x.clear()
      })
    }

    // cleanup components
    for (const name in this.components) {
      const comp = this.componentRemove[name as string]
      if (comp.size === 0) continue
      comp.forEach((x) => {
        this.componentQueries[name as string].forEach((queryId) => {
          this.queries[queryId].filters[name as string].delete(x)
          this.updatedQueries.add(queryId)
        })
        const ent = this.entities[x] as any
        delete ent[name as string]
      })
      comp.clear()
    }

    // cleanup entities
    if (this.entityRemove.size > 0) {
      for (const entityId of this.entityRemove) {
        delete this.entities[entityId]
      }
      this.entityRemove.clear()
    }

    // update queries data for next frame
    for (const id of this.updatedQueries) {
      this.updateQuery(this.queries[id])
    }
  }
}

export function createWorld<X, C>(context: X, comps: C) {
  return new World<X, C>(context, comps)
}
