import { SiweMessage, SignatureType } from '@didtools/cacao'
import { Wallet } from '@ethersproject/wallet'

const SIWE_MESSAGE_PARAMS = {
  domain: 'service.org',
  address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  statement: 'I accept the ServiceOrg Terms of Service: https://service.org/tos',
  uri: 'https://service.org/login',
  version: '1',
  nonce: '32891757',
  issuedAt: '2021-09-30T16:25:24.000Z',
  chainId: '1',
  resources: [
    'ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu',
    'https://example.com/my-web2-claim.json',
  ],
}

describe('Message Generation', () => {
  test('create and validate eip191 string representation', () => {
    const msg = new SiweMessage(SIWE_MESSAGE_PARAMS)
    const asString = msg.toMessage()
    const recovered = new SiweMessage(asString)
    expect(recovered).toEqual(msg)
  })

  test('With optional fields', () => {
    const msg = new SiweMessage(SIWE_MESSAGE_PARAMS)
    expect(msg.toMessage()).toMatchSnapshot()
  })

  test('No optional field', () => {
    const msg = new SiweMessage({
      ...SIWE_MESSAGE_PARAMS,
      resources: [],
    })

    expect(msg.toMessage()).toMatchSnapshot()
  })

  test('Timestamp without microseconds', () => {
    const msg = new SiweMessage({
      ...SIWE_MESSAGE_PARAMS,
      issuedAt: '2021-09-30T16:25:24Z',
    })

    expect(msg.toMessage()).toMatchSnapshot()
  })
})

describe('Ocap', () => {
  const wallet = Wallet.fromMnemonic(
    'despair voyage estate pizza main slice acquire mesh polar short desk lyrics'
  )

  test('Sign message using SiweMessage object', async () => {
    const address = wallet.address
    const fixedDate = new Date('2021-10-14T07:18:41Z')
    const msg = new SiweMessage({
      domain: 'self.id',
      statement: 'Give this app access to your streams',
      nonce: '12345678',
      type: SignatureType.PERSONAL_SIGNATURE,
      address: address,
      chainId: '1',
      issuedAt: fixedDate.toISOString(),
      resources: ['ceramic://bagcqcerakszw2vsovxznyp5gfnpdj4cqm2xiv76yd24wkjewhhykovorwo6a'],
      uri: `did:pkh:eip155:1:${address}`,
      version: '0.1',
    })
    expect(msg.toMessage()).toMatchSnapshot()

    const signature = await wallet.signMessage(msg.toMessage())
    expect(signature).toMatchSnapshot()
  })
})
