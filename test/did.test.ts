import { RPCResponse } from 'rpc-utils'

import { DID } from '../src/did'

describe('did', () => {
  const defaultConnection = { send: jest.fn() }

  test('DID class has an `authenticated` property', () => {
    const did = new DID(defaultConnection)
    expect(did.authenticated).toBe(false)
  })

  test('DID class has a `DID` property', () => {
    const did = new DID(defaultConnection)
    expect(() => did.DID).toThrow('DID is not authenticated')
  })

  test('RPC calls throw an error if the response payload is an error', async () => {
    const connection1 = {
      send: jest.fn(async (req) => {
        return {
          jsonrpc: '2.0',
          id: req.id,
          error: { message: 'Unauthorized' },
        } as RPCResponse<any>
      }),
    }
    const did1 = new DID(connection1)
    await expect(() => did1.authenticate()).rejects.toThrow('Unauthorized')

    const connection2 = {
      send: jest.fn(async (req) => ({
        jsonrpc: '2.0',
        id: req.id,
        error: { code: 401 },
      })),
    }
    const did2 = new DID(connection2)
    await expect(() => did2.authenticate()).rejects.toThrow('Application error')
  })

  test('DID class has an `authenticate` method', async () => {
    const connection = {
      send: jest.fn(async (req) => {
        return {
          jsonrpc: '2.0',
          id: req.id,
          result: { did: '1234' },
        } as RPCResponse<any>
      }),
    }
    const did = new DID(connection)
    await did.authenticate()
    expect(connection.send).toHaveBeenCalledTimes(1)
    expect(connection.send).toHaveBeenCalledWith({
      jsonrpc: '2.0',
      id: expect.any(String),
      method: 'did_authenticate',
      params: undefined,
    })
    expect(did.authenticated).toBe(true)
    expect(did.DID).toBe('1234')
  })

  test('DID class has a `createJWS` method', async () => {
    let authCalled = false
    const connection = {
      send: jest.fn(async (req) => {
        let result
        if (authCalled) {
          result = { jws: '5678' }
        } else {
          authCalled = true
          result = { did: '1234' }
        }
        return { jsonrpc: '2.0', id: req.id, result } as RPCResponse<any>
      }),
    }
    const did = new DID(connection)

    expect(() => did.createJWS({})).rejects.toThrow('DID is not authenticated')
    await did.authenticate()

    const data = { foo: Buffer.from('foo') }
    const jws = await did.createJWS(data, { pubKeyId: 'foo' })
    expect(jws).toBe('5678')
    expect(connection.send).toHaveBeenCalledTimes(2)
    expect(connection.send.mock.calls[1][0]).toEqual({
      jsonrpc: '2.0',
      id: expect.any(String),
      method: 'did_createJWS',
      params: {
        payload: { foo: { '/': { base64: data.foo.toString('base64') } } },
        pubKeyId: 'foo',
      },
    })
  })
})
