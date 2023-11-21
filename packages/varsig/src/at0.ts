export enum SIGNING {
  RSA = 0x1205,
  SECP256K1 = 0xe7,
}

export enum HASHING {
  SHA2_256 = 0x12,
  SHA2_512 = 0x13,
  KECCAK256 = 0x1b,
}

export enum CANONICALIZATION {
  EIP712 = 0xe712,
  EIP191 = 0xe191,
}
