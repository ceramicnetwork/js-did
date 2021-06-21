import { parse } from 'did-resolver'
import * as qs from 'query-string'

/**
 * Change `version-id` parameter id DID URL.
 */
export function changeVersion(kid: string, nextVersionId: string): string {
  const parsed = parse(kid)
  if (!parsed) {
    throw new Error(`Invalid DID URL: ${kid}`)
  }
  const query = qs.parse(parsed.query || '')
  query['version-id'] = nextVersionId
  const nextQuery = qs.stringify(query)
  let result = `${parsed.did}?${nextQuery}`
  if (parsed.fragment) {
    result = `${result}#${parsed.fragment}`
  }
  return result
}
