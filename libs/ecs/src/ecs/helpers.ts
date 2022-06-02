export const intersects = (data: Set<string>[]) => {
  if (data.length === 0) return []
  const [first, ...others] = data
  return [...first].filter((x) => {
    for (const set of others) {
      if (!set.has(x)) return false
    }
    return true
  })
}

export const union = (data: Set<string>[]) => {
  const entries = new Set(data.map((x) => [...x]).flat())
  return [...entries]
}

const genIdPrefix = () => Date.now()
let gen = 0
let prefix = genIdPrefix()

export function genId() {
  gen++
  if (gen === Number.MAX_SAFE_INTEGER) {
    gen = 0
    prefix = genIdPrefix()
  }
  return `${prefix.toString(16)}-${gen.toString(16)}`
}
