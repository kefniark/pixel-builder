export interface Entity {
  __uuid: string
}

export interface Component {}

export interface Query {
  __uuid: string
  names: string[]
  executed: boolean
  changed: boolean
  entity_ids: Set<string>
  entity_added: Set<string>
  entity_removed: Set<string>
  filters: Record<string, Set<string>>
  filters_added: Record<string, Set<string>>
  filters_removed: Record<string, Set<string>>
}

export interface System {
  data?: any
  priority?: number
  mounted?: () => void
  unmounted?: () => void
  update?: (dt: number) => void
}
