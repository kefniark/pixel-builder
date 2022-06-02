import { genId, intersects, union } from "./helpers"
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
  // componentAdd: Record<string, Set<string>> = {}
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
      // this.componentAdd[name] = new Set()
      this.componentRemove[name] = new Set()
      this.componentQueries[name] = new Set()
    }
  }

  createEntity<N extends keyof C>(
    components?: N[],
    values?: Partial<{ [P in N]: Partial<C[P]> }>,
    tags?: string[]
  ): Entity & { [P in N]: C[P] } {
    const id = genId()
    const entity = { __uuid: id, __tags: tags ?? [], components: [] } as Entity
    if (components) {
      components.forEach((x) => this.addComponent(entity, x, values ? values[x] : undefined))
    }
    this.entities[id] = entity
    return entity as any
  }

  addComponent<N extends keyof C>(entity: Entity, name: N, value?: Partial<C[N]>): Entity & { [P in N]: C[P] } {
    const component = Object.assign({}, this.components[name], value ?? {})
    ;(entity as any)[name] = component
    // (entity as any)[name] = new Proxy(component, {
    //     set: (target: any, property, value, receiver) => {
    //         if (target[property] !== value) this.updateComponents(name, entity.__uuid, 'updated')
    //         return Reflect.set(target, property, value);
    //     }
    // })
    // this.componentAdd[name as string].add(entity.__uuid)
    // this.componentAdd[name as string].add(entity.__uuid)
    this.componentAll[name as string].add(entity.__uuid)
    this.updateComponents(name, entity.__uuid, "added")
    return entity as any
  }

  createQuery<N extends keyof C>(names: N[]): (event?: "added" | "removed") => (Entity & { [P in N]: C[P] })[] {
    const id = genId()
    const query: Query = {
      __uuid: id,
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

    return (event) => {
      if (query.changed) {
        this.updateQuery(query)
        query.changed = false
      }
      let entityIds = [...query.entity_ids]
      if (event === "added") {
        entityIds = [...query.entity_added]
      } else if (event === "removed") {
        entityIds = [...query.entity_removed]
      }

      return entityIds.map((x) => this.entities[x]) as any
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

    // add element for next frames
    // for (const name in this.components) {
    //     if (this.componentAdd[name].size === 0) continue
    //     this.updateComponents(name, this.componentAdd[name], 'added')
    //     this.componentAdd[name].clear()
    // }

    // update queries data for next frame
    for (const id of this.updatedQueries) {
      this.updateQuery(this.queries[id])
    }
  }
}

export function createWorld<X, C>(context: X, comps: C) {
  return new World<X, C>(context, comps)
}
