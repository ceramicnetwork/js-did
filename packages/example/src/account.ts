import type { AccountId } from 'caip'
import { map } from 'nanostores'

export type $Account =
  | {
      kind: 'ready'
      accountId: AccountId
      siwe: string
      disconnect: () => Promise<void>
    }
  | { kind: 'absent' }

export const $account = map<$Account>({ kind: 'absent' })
