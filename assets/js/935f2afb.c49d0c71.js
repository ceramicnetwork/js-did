"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[53],{1109:e=>{e.exports=JSON.parse('{"pluginId":"default","version":"current","label":"Next","banner":null,"badge":false,"className":"docs-version-current","isLast":true,"docsSidebars":{"docs":[{"type":"link","label":"Introduction","href":"/docs/introduction","docId":"introduction"},{"type":"category","collapsed":false,"label":"Getting Started","items":[{"type":"link","label":"Installation","href":"/docs/installation","docId":"installation"},{"type":"link","label":"Authorization","href":"/docs/authorization","docId":"authorization"},{"type":"link","label":"Configuration","href":"/docs/configuration","docId":"configuration"},{"type":"link","label":"Managing Sessions","href":"/docs/managing-sessions","docId":"managing-sessions"}],"collapsible":true},{"type":"category","collapsed":false,"label":"Guides","items":[{"type":"link","label":"Concepts overview","href":"/docs/guides/concepts-overview","docId":"guides/concepts-overview"},{"type":"link","label":"Using With ComposeDB Client","href":"/docs/guides/using-with-composedb-client","docId":"guides/using-with-composedb-client"},{"type":"link","label":"Add Support for a Blockchain","href":"/docs/guides/add-chain-support","docId":"guides/add-chain-support"},{"type":"link","label":"Upgrading DID Session","href":"/docs/guides/upgrading-did-session","docId":"guides/upgrading-did-session"}],"collapsible":true}],"api":[{"type":"category","collapsed":false,"label":"DID module","items":[{"type":"link","label":"Overview","href":"/docs/api/modules/dids","docId":"api/modules/dids"},{"type":"link","label":"DID Class","href":"/docs/api/classes/dids.DID","docId":"api/classes/dids.DID"}],"collapsible":true},{"type":"category","collapsed":false,"label":"DID-Session module","items":[{"type":"link","label":"Overview","href":"/docs/api/modules/did_session","docId":"api/modules/did_session"},{"type":"link","label":"DIDSession Class","href":"/docs/api/classes/did_session.DIDSession","docId":"api/classes/did_session.DIDSession"}],"collapsible":true},{"type":"link","label":"DID:PKH Ethereum","href":"/docs/api/modules/pkh_ethereum","docId":"api/modules/pkh_ethereum"},{"type":"link","label":"DID:PKH Solana","href":"/docs/api/modules/pkh_solana","docId":"api/modules/pkh_solana"},{"type":"link","label":"DID:KEY ED25519","href":"/docs/api/modules/key_did_provider_ed25519","docId":"api/modules/key_did_provider_ed25519"}]},"docs":{"api/classes/did_session.DIDSession":{"id":"api/classes/did_session.DIDSession","title":"Class: DIDSession","description":"did-session.DIDSession","sidebar":"api"},"api/classes/dids.DID":{"id":"api/classes/dids.DID","title":"Class: DID","description":"dids.DID","sidebar":"api"},"api/classes/key_did_provider_ed25519.Ed25519Provider":{"id":"api/classes/key_did_provider_ed25519.Ed25519Provider","title":"Class: Ed25519Provider","description":"key-did-provider-ed25519.Ed25519Provider"},"api/index":{"id":"api/index","title":"DIDs API","description":"Modules"},"api/modules/did_session":{"id":"api/modules/did_session","title":"Module: did-session","description":"Manages user account DIDs in web based environments.","sidebar":"api"},"api/modules/dids":{"id":"api/modules/dids","title":"Module: dids","description":"A simple library to interact with DIDs that conform to the DID-provider interface.","sidebar":"api"},"api/modules/key_did_provider_ed25519":{"id":"api/modules/key_did_provider_ed25519","title":"Module: key-did-provider-ed25519","description":"This is a DID Provider which implements EIP2844 for did using ed25519. It also supports decryption using x25519.","sidebar":"api"},"api/modules/pkh_ethereum":{"id":"api/modules/pkh_ethereum","title":"Module: pkh-ethereum","description":"Implements support to authenticate, authorize and verify with Ethereum accounts as a did:pkh with SIWE(X) and CACAO.","sidebar":"api"},"api/modules/pkh_solana":{"id":"api/modules/pkh_solana","title":"Module: pkh-solana","description":"Implements support to authenticate, authorize and verify with Solana accounts as a did:pkh with SIWS(X) and CACAO.","sidebar":"api"},"api/namespaces/pkh_ethereum.EthereumNodeAuth":{"id":"api/namespaces/pkh_ethereum.EthereumNodeAuth","title":"Namespace: EthereumNodeAuth","description":"pkh-ethereum.EthereumNodeAuth"},"api/namespaces/pkh_ethereum.EthereumWebAuth":{"id":"api/namespaces/pkh_ethereum.EthereumWebAuth","title":"Namespace: EthereumWebAuth","description":"pkh-ethereum.EthereumWebAuth"},"api/namespaces/pkh_solana.SolanaNodeAuth":{"id":"api/namespaces/pkh_solana.SolanaNodeAuth","title":"Namespace: SolanaNodeAuth","description":"pkh-solana.SolanaNodeAuth"},"api/namespaces/pkh_solana.SolanaWebAuth":{"id":"api/namespaces/pkh_solana.SolanaWebAuth","title":"Namespace: SolanaWebAuth","description":"pkh-solana.SolanaWebAuth"},"authorization":{"id":"authorization","title":"Authorization","description":"Authorize and then use DIDs where needed. At the moment, Ethereum and Solana accounts","sidebar":"docs"},"configuration":{"id":"configuration","title":"Configuration","description":"When creating a DID session, you need to pass an array of string identifiers for resources you want to authorize","sidebar":"docs"},"guides/add-chain-support":{"id":"guides/add-chain-support","title":"Add Support for a Blockchain","description":"The standard use of SIWX, CACAO and DID:PKH allows anyone to implement support for another blockchain or account type to authenticate and authorize writes to the Ceramic Network. Additionally a few standard interfaces enables you to implement an auth and verification library that allows anyone to use it with did-session, the primary library to use DID based accounts with Ceramic. There is just a few steps you have to take, outlined below.","sidebar":"docs"},"guides/concepts-overview":{"id":"guides/concepts-overview","title":"Concepts overview","description":"Ceramic uses the Decentralized Identifier (DID) standard for users accounts. DIDs require no central authority - users control their data and whom they share it with.","sidebar":"docs"},"guides/upgrading-did-session":{"id":"guides/upgrading-did-session","title":"Upgrading DID Session","description":"Upgrading from did-session@0.x.x to did-session@1.x.x","sidebar":"docs"},"guides/using-with-composedb-client":{"id":"guides/using-with-composedb-client","title":"Using With ComposeDB Client","description":"ComposeDB is a set of TypeScript libraries and tools to interact with the Dataverse using the Ceramic network.","sidebar":"docs"},"installation":{"id":"installation","title":"Installation","description":"did-session","sidebar":"docs"},"introduction":{"id":"introduction","title":"Welcome to Decentralized Identifiers","description":"A suite of tools and APIs to interact with and manage decentralized identifiers (DIDs).","sidebar":"docs"},"managing-sessions":{"id":"managing-sessions","title":"Managing Sessions","description":"You can serialize a session to store for later and then re-initialize. Currently sessions are valid","sidebar":"docs"}}}')}}]);