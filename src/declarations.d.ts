declare module 'ipld-dag-cbor' {
  import CID from 'cids'

  export type UserOptions = { cidVersion?: number; hashAlg?: number }

  export namespace util {
    function cid(binaryBlob: any, userOptions?: UserOptions): Promise<CID>
    function serialize(node: any): Buffer
  }
}
