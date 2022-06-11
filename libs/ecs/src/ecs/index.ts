import { genId } from "./helpers"
import { Entity, Query, System } from "./interfaces"
export * from "./interfaces"

export class World<X, C> {
  //
  readonly context: X
  private _components: C

  // map
  private _entities: { [key: string]: Entity } = {}
  private _componentAll: Record<string, Set<string>> = {}
  private _systems: { [key: string]: System[] } = {}

  // temporary
  private _entityRemove: Set<string> = new Set()
  private _componentRemove: Record<string, Set<string>> = {}

  // queries
  private _componentQueries: Record<string, Set<string>> = {}
  private _queries: Record<string, Query> = {}

  constructor(context: X, comps: C) {
    this.context = context
    this._components = comps
    for (const name in comps) {
      this._componentAll[name] = new Set()
      this._componentRemove[name] = new Set()
      this._componentQueries[name] = new Set()
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
    this._entities[id] = entity
    return entity as any
  }

  removeEntity(entity: Entity | undefined) {
    if (!entity) return
    this._entityRemove.add(entity.__uuid)
    for (const componentName of Object.keys(entity)) {
      if (componentName === "__uuid") continue
      this.removeComponent(entity, componentName as any)
    }
  }

  addComponent<N extends keyof C>(entity: Entity, name: N, value?: Partial<C[N]>): Entity & { [P in N]: C[P] } {
    const component = Object.assign({}, this._components[name], value ?? {})
    ;(entity as any)[name] = component
    this._componentAll[name as string].add(entity.__uuid)
    this.updateComponents(name, entity.__uuid, true)
    return entity as any
  }

  removeComponent<N extends keyof C>(entity: Entity, name: N) {
    this._componentAll[name as string].delete(entity.__uuid)
    this._componentRemove[name as string].add(entity.__uuid)
    this.updateComponents(name, entity.__uuid, false)
  }

  createQuery<N extends keyof C>(
    names: N[]
  ): () => {
    added: Set<string>
    removed: Set<string>
    entities: (Entity & { [P in N]: C[P] })[]
  } {
    const id = genId()

    const entity_ids = new Set<string>()
    const entity_added = new Set<string>()
    const entity_removed = new Set<string>()
    const filters_comp: Record<string, Set<string>> = {}

    // create query
    const query: Query = {
      __uuid: id,
      add(id, name) {
        if (!filters_comp[name]) return
        filters_comp[name].add(id)

        if (!entity_ids.has(id) && names.every((x) => filters_comp[x as string].has(id))) {
          entity_ids.add(id)
          entity_added.add(id)
        }
      },
      remove(id, name) {
        if (!filters_comp[name]) return
        filters_comp[name].delete(id)

        if (entity_ids.has(id) && !names.every((x) => filters_comp[x as string].has(id))) {
          entity_ids.delete(id)
          if (entity_added.has(id)) {
            entity_added.delete(id)
          } else {
            entity_removed.add(id)
          }
        }
      },
    }

    // initialize
    for (const n of names) {
      filters_comp[n as string] = new Set()
      this._componentAll[n as string].forEach((id) => query.add(id, n as string))
    }
    this._queries[id] = query
    names.forEach((x) => this._componentQueries[x as string].add(id))

    // return query user object
    return () => {
      const data = {
        added: new Set([...entity_added]),
        removed: new Set([...entity_removed]),
        entities: [...entity_ids].map((x) => this._entities[x]) as any,
      }

      entity_added.clear()
      entity_removed.clear()
      return data
    }
  }

  addSystem(key: string, system: (world: World<X, C>) => System) {
    const s = system(this)
    if (s.mounted) s.mounted()
    if (!this._systems[key]) this._systems[key] = []
    this._systems[key].push(s)
    this._systems[key].sort((a, b) => (a.priority || 1) - (b.priority || 1))
    return system
  }

  updateSystems(keys: string | string[], dt: number) {
    const arr = Array.isArray(keys) ? keys : [keys]
    const systems = arr.map((x) => this._systems[x]).flat()
    for (const s of systems) {
      if (s.update) s.update(dt)
    }
  }

  private updateComponents(componentName: keyof C, entityIds: string | Set<string>, added: boolean) {
    const set = entityIds instanceof Set ? entityIds : new Set([entityIds])
    if (set.size === 0) return
    const name = componentName as string
    for (const queryId of this._componentQueries[name]) {
      const query = this._queries[queryId]
      for (const entityId of set) {
        if (added) {
          query.add(entityId, name)
        } else {
          query.remove(entityId, name)
        }
      }
    }
  }

  cleanup() {
    // cleanup components
    for (const name in this._components) {
      const comp = this._componentRemove[name as string]
      if (comp.size === 0) continue
      comp.forEach((x) => {
        const ent = this._entities[x] as any
        delete ent[name as string]
      })
      comp.clear()
    }

    // cleanup entities
    if (this._entityRemove.size > 0) {
      for (const entityId of this._entityRemove) {
        delete this._entities[entityId]
      }
      this._entityRemove.clear()
    }
  }
}

export function createWorld<X, C>(context: X, comps: C) {
  return new World<X, C>(context, comps)
}
