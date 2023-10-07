import type { AccountId } from 'caip'
import type { Cacao } from '@didtools/cacao'

interface Session {
  cacao: Cacao
  keypair: CryptoKeyPair
}

export class SessionStore {
  #db: IDBDatabase

  constructor(db: IDBDatabase) {
    this.#db = db
  }

  static async create(): Promise<SessionStore> {
    if (typeof globalThis.indexedDB === 'undefined') {
      throw new Error('SessionStore is only supported in the browser')
    }
    const request = indexedDB.open('did-session', 1)
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result
      db.createObjectStore('sessions')
    }
    const db: IDBDatabase = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    return new SessionStore(db)
  }

  async get(account: AccountId): Promise<Session | undefined> {
    const store = this.#db.transaction('sessions', 'readonly').objectStore('sessions')
    const request = store.get(account.toString())
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Session)
      request.onerror = () => reject(request.error)
    })
  }

  async set(account: AccountId, session: Session): Promise<void> {
    const store = this.#db.transaction('sessions', 'readwrite').objectStore('sessions')
    const request = store.put(session, account.toString())
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  close() {
    this.#db.close()
  }
}
