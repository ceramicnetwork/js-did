import { Wallet } from '@ethersproject/wallet'
import { Cacao, CacaoBlock, SiweMessage } from '@didtools/cacao'
import { getEIP191Verifier } from '@didtools/pkh-ethereum'
import { DateTime } from 'luxon'

const ISSUED_AT = DateTime.fromISO('2021-10-14T07:18:41Z').toUTC()
const EXPIRATION_TIME = ISSUED_AT.plus({ seconds: 5 })

const WALLET_MNEMONIC =
  'despair voyage estate pizza main slice acquire mesh polar short desk lyrics'
const ETHEREUM_WALLET = Wallet.fromMnemonic(WALLET_MNEMONIC)
const ETHEREUM_ADDRESS = ETHEREUM_WALLET.address
const SIWE_MESSAGE_PARAMS = {
  domain: 'service.org',
  address: ETHEREUM_ADDRESS,
  statement: 'I accept the ServiceOrg Terms of Service: https://service.org/tos',
  uri: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
  version: '1',
  nonce: '32891757',
  issuedAt: ISSUED_AT.toISO(),
  chainId: '1',
  resources: [
    'ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu',
    'https://example.com/my-web2-claim.json',
  ],
}

const verifiers = {...getEIP191Verifier()}

test('create and verify Cacao Block for Ethereum', async () => {
  const msg = new SiweMessage(SIWE_MESSAGE_PARAMS)
  msg.signature = await ETHEREUM_WALLET.signMessage(msg.signMessage())

  const cacao = Cacao.fromSiweMessage(msg)
  const block = await CacaoBlock.fromCacao(cacao)
  expect(block).toMatchSnapshot()

  expect(() => Cacao.verify(cacao, { verifiers })).not.toThrow()
})

test('convert between Cacao and SiweMessage', () => {
  const msg = new SiweMessage(SIWE_MESSAGE_PARAMS)

  const cacao = Cacao.fromSiweMessage(msg)
  const siwe = SiweMessage.fromCacao(cacao)
  expect(siwe).toEqual(msg)
})

test('ok after expiration if within phase out period', async () => {
  const msg = new SiweMessage({
    ...SIWE_MESSAGE_PARAMS,
    expirationTime: EXPIRATION_TIME.toISO(),
  })
  msg.signature = await ETHEREUM_WALLET.signMessage(msg.toMessage())

  const cacao = Cacao.fromSiweMessage(msg)
  const expiredTime = EXPIRATION_TIME.plus({ seconds: 5 })
  expect(() =>
    Cacao.verify(cacao, {
      atTime: expiredTime.toJSDate(),
      revocationPhaseOutSecs: 20,
      clockSkewSecs: 0,
      verifiers
    })
  ).not.toThrow()
})

test('fail after expiration if after phase out period', async () => {
  const msg = new SiweMessage({
    ...SIWE_MESSAGE_PARAMS,
    expirationTime: EXPIRATION_TIME.toISO(),
  })

  msg.signature = await ETHEREUM_WALLET.signMessage(msg.signMessage())

  const cacao = Cacao.fromSiweMessage(msg)
  const expiredTime = EXPIRATION_TIME.plus({ seconds: 5 })
  expect(() =>
    Cacao.verify(cacao, {
      atTime: expiredTime.toJSDate(),
      revocationPhaseOutSecs: 1,
      clockSkewSecs: 0,
      verifiers
    })
  ).rejects.toThrow(`CACAO has expired`)
})

test('ok before issued-at if within the clock skew', async () => {
  const msg = new SiweMessage(SIWE_MESSAGE_PARAMS)

  msg.signature = await ETHEREUM_WALLET.signMessage(msg.toMessage())

  const cacao = Cacao.fromSiweMessage(msg)
  const beforeIssuedAt = ISSUED_AT.minus({ minute: 1 })
  expect(() => Cacao.verify(cacao, { atTime: beforeIssuedAt.toJSDate(), verifiers })).not.toThrow()
})

test('ok after expiration if disableTimecheck option', async () => {
  const msg = new SiweMessage({
    ...SIWE_MESSAGE_PARAMS,
    expirationTime: EXPIRATION_TIME.toISO(),
  })

  msg.signature = await ETHEREUM_WALLET.signMessage(msg.toMessage())

  const cacao = Cacao.fromSiweMessage(msg)
  expect(() =>
    Cacao.verify(cacao, {
      disableExpirationCheck: true,
      revocationPhaseOutSecs: 20,
      clockSkewSecs: 0,
      verifiers
    })
  ).not.toThrow()
})
