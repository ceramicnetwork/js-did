import * as uint8arrays from 'uint8arrays'
import { Cacao } from '@didtools/cacao'
import { getEIP191Verifier } from '@didtools/pkh-ethereum'
import { DateTime } from 'luxon'

// 2022-08-20T16:25:24.000Z
const LEGACY_CHAIN_ID_CACAO = uint8arrays.fromString(
  'o2FooWF0Z2VpcDQzNjFhcKhjYXVkeDhkaWQ6a2V5Ono2TWtyQmROZHdVUG5YRFZEMURDeGVkelZWQnBhR2k4YVNtb1hGQWVLTmd0QWVyOGNpYXR4GDIwMjItMDgtMjBUMTY6MjU6MjQuMDAwWmNpc3N4O2RpZDpwa2g6ZWlwMTU1OjE6MHhiZDlkOWM3ZGMzODk3MTVhODlmYzgxNDllNGE1YmU5MTMzNmIyNzk2ZW5vbmNlaDMyODkxNzU3ZmRvbWFpbmtzZXJ2aWNlLm9yZ2d2ZXJzaW9uYTFpcmVzb3VyY2VzgXhIY2VyYW1pYzovL2sydDZ3eWZzdTRwZzA0MGRwanBibGExeWJ4b2Y2NWJhbGRiN2Z2bWVhbTRtM243MXEwdzFuc2x6NjA5dTJkaXN0YXRlbWVudHhBSSBhY2NlcHQgdGhlIFNlcnZpY2VPcmcgVGVybXMgb2YgU2VydmljZTogaHR0cHM6Ly9zZXJ2aWNlLm9yZy90b3Nhc6Jhc3iEMHgyMjVlMWY5OWU1Mzc5OTc1MTkxMGEzNzZiMzcxMGQ1YmY1NTI4ZDdmODgwNzNjOTVlYmE2MTMwNTFmNmJjMjViMzg0Y2RlYTY5YzUzYzIxNjYxMDJhZWEwZTZlNDAxNGQ1MzY1ZWFkMTBjNmEwYWZmOWRiYTg1NjQ5MmU0MTNlYTFiYXRmZWlwMTkx',
  'base64url'
)

// 2022-09-22T16:25:24.000Z
const LEGACY_CHAIN_ID_CACAO_IAT_AFTER_THRESHOLD = uint8arrays.fromString(
  'o2FooWF0Z2VpcDQzNjFhcKhjYXVkeDhkaWQ6a2V5Ono2TWtyQmROZHdVUG5YRFZEMURDeGVkelZWQnBhR2k4YVNtb1hGQWVLTmd0QWVyOGNpYXR4GDIwMjItMDktMjJUMTY6MjU6MjQuMDAwWmNpc3N4O2RpZDpwa2g6ZWlwMTU1OjE6MHhiZDlkOWM3ZGMzODk3MTVhODlmYzgxNDllNGE1YmU5MTMzNmIyNzk2ZW5vbmNlaDMyODkxNzU3ZmRvbWFpbmtzZXJ2aWNlLm9yZ2d2ZXJzaW9uYTFpcmVzb3VyY2VzgXhIY2VyYW1pYzovL2sydDZ3eWZzdTRwZzA0MGRwanBibGExeWJ4b2Y2NWJhbGRiN2Z2bWVhbTRtM243MXEwdzFuc2x6NjA5dTJkaXN0YXRlbWVudHhBSSBhY2NlcHQgdGhlIFNlcnZpY2VPcmcgVGVybXMgb2YgU2VydmljZTogaHR0cHM6Ly9zZXJ2aWNlLm9yZy90b3Nhc6Jhc3iEMHg5ZDAzNjg3MmZlZTI2N2Q3ZmYyNjM3YjQ0YzhkOThhOWRlN2NhYzA5ZDk2NmE1ZmQ3NzU2MzRjYWYzYzVhYTFhMDBhNjE2MThiNGY3YzU3ZjM5MjAwYWFjMTQ5NjYxNGZlYmU3MTJjZTdiYzhiMDY4NjlkZWQ2ZTYwYzU4MmFiMjFjYXRmZWlwMTkx',
  'base64url'
)

const verifiers = {...getEIP191Verifier()}

test('ok: verify legacy chainId cacao issued before threshold', async () => {
  const legacy = await Cacao.fromBlockBytes(LEGACY_CHAIN_ID_CACAO)
  const issuedAt = DateTime.fromISO(legacy.p.iat)
  // After issuedAt
  expect(() => {
    Cacao.verify(legacy, { atTime: issuedAt.plus({ minute: 1 }).toJSDate(), verifiers })
  }).not.toThrow()
  // A year from when issuedAt
  expect(() => {
    Cacao.verify(legacy, { atTime: issuedAt.plus({ year: 1 }).toJSDate(), verifiers })
  }).not.toThrow()
})

test('reject: verify legacy chainId cacao issued after threshold', async () => {
  // Issued after the threshold date
  const legacyAfterThreshold = await Cacao.fromBlockBytes(LEGACY_CHAIN_ID_CACAO_IAT_AFTER_THRESHOLD)
  const issuedAtAfterThreshold = DateTime.fromISO(legacyAfterThreshold.p.iat)
  const validatedAt = issuedAtAfterThreshold.plus({ minute: 1 })
  await expect(async () =>
    Cacao.verify(await Cacao.fromBlockBytes(LEGACY_CHAIN_ID_CACAO_IAT_AFTER_THRESHOLD), {
      atTime: validatedAt.toJSDate(),
      verifiers
    })
  ).rejects.toThrow(/Signature does not belong to issuer/)
})
