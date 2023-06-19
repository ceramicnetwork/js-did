import { AccountId } from 'caip'
import { EthereumNodeAuth } from "../src/authmethod"

describe('Ethereum PKH - Node Auth', () => {
  test('throw error when no app name given', async () => {
    const accountId = new AccountId("eip155:1:0xab16a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb")
    // @ts-ignore
    expect(() => EthereumNodeAuth.getAuthMethod({}, accountId, undefined)).rejects.toThrow("Node Auth method requires an application name")
  })
})
