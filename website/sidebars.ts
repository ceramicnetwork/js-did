/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  docs: [
    { type: 'doc', id: 'introduction', label: 'Introduction' }
  ],
  api: [
    {
      type: 'category',
      collapsed: false,
      label: 'DID module',
      items: [
        { type: 'doc', id: 'api/dids/index', label: 'Overview' },
        { type: 'doc', id: 'api/dids/classes/DID', label: 'DID Class' },
      ],
    },
    {
      type: 'category',
      collapsed: false,
      label: 'DID-Session module',
      items: [
        { type: 'doc', id: 'api/did-session/index', label: 'Overview' },
        { type: 'doc', id: 'api/did-session/classes/DIDSession', label: 'DIDSession Class' },
      ],
    },
    { type: 'doc', id: 'api/pkh-ethereum/index', label: 'DID:PKH Ethereum' },
    { type: 'doc', id: 'api/pkh-solana/index', label: 'DID:PKH Solana' },
    { type: 'doc', id: 'api/pkh-tezos/index', label: 'DID:PKH Tezos' },
    { type: 'doc', id: 'api/pkh-stacks/index', label: 'DID:PKH Stacks' },
    { type: 'doc', id: 'api/key-did-provider-ed25519/index', label: 'DID:KEY ED25519' },
    { type: 'doc', id: 'api/key-did-resolver/index', label: 'DID:KEY Resolver' },
    { type: 'doc', id: 'api/pkh-did-resolver/index', label: 'DID:PKH Resolver' },
    { type: 'doc', id: 'api/key-did/index', label: 'DID:KEY utilities' },
    { type: 'doc', id: 'api/codecs/index', label: 'Codecs' }
  ],
};

export default sidebars
