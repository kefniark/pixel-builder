export interface Entity {
  __uuid: string
}

export interface Query {
  __uuid: string
  names: string[]
  changed: boolean
  entity_ids: Set<string>
  entity_added: Set<string>
  entity_removed: Set<string>
  filters: Record<string, Set<string>>
  filters_added: Record<string, Set<string>>
  // filters_updated: Record<string, Set<string>>
  filters_removed: Record<string, Set<string>>
}

export interface Component {}

export interface System {
  name: string
  data?: any
  priority?: number
  mounted?: () => void
  unmounted?: () => void
  update?: (dt: number) => void
}
