export enum SigningKind {
  RSASSA_PKCS1_v1_5 = 0x1205,
  SECP256K1 = 0xe7,
}

export type SigningSecp256k1 = {
  kind: SigningKind.SECP256K1
  recoveryBit: number | undefined
}

export type SigningAlgo = SigningSecp256k1
