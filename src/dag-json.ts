import CID from 'cids'
import isCircular from 'is-circular'

export type DagJson = Record<string, any>

export function encodeDagJson(obj: DagJson): DagJson {
  if (isCircular(obj)) {
    throw new Error('Object contains circular references.')
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (CID.isCID(value)) {
      acc[key] = { '/': value.toString() }
    } else if (Buffer.isBuffer(value)) {
      acc[key] = { '/': { base64: value.toString('base64') } }
    } else if (typeof value === 'object' && value !== null) {
      acc[key] = encodeDagJson(value)
    } else {
      acc[key] = value
    }
    return acc
  }, {} as DagJson)
}
