/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    { type: 'doc', id: 'introduction', label: 'Introduction' },
    {
      type: 'category',
      collapsed: false,
      label: 'Getting Started',
      items: ['installation', 'authorization', 'storing-sessions', 'configuration'],
    },
    {
      type: 'category',
      collapsed: false,
      label: 'Guides',
      link: { type: 'generated-index' },
      items: ['guides/concepts-overview', 'guides/using-with-composedb-client', 'guides/upgrading-from-glazed-did-session'],
    },
  ],
  api: [
    {
      type: 'category',
      collapsed: false,
      label: 'DID module',
      items: [
        { type: 'doc', id: 'api/modules/dids', label: 'Overview' },
        { type: 'doc', id: 'api/classes/dids.DID', label: 'DID Class' },
      ],
    },
    {
      type: 'category',
      collapsed: false,
      label: 'DID-Session module',
      items: [
        { type: 'doc', id: 'api/modules/did_session', label: 'Overview' },
        { type: 'doc', id: 'api/classes/did_session.DIDSession', label: 'DIDSession Class' },
      ],
    },
  ],
};

module.exports = sidebars;
