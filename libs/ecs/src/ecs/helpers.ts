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
