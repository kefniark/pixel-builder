export interface Entity {
  __uuid: string
}

export interface Component {}

export interface Query {
  __uuid: string
  add(entityId: string, componentName: string): void
  remove(entityId: string, componentName: string): void
}

export interface System {
  data?: any
  priority?: number
  mounted?: () => void
  unmounted?: () => void
  update?: (dt: number) => void
}
