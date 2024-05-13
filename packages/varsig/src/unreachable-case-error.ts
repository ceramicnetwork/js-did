export class UnreacheableCaseError extends Error {
  constructor(variant: never, kind: string) {
    super(`Unreacheable case for ${kind}: ${String(variant)}`)
  }
}
