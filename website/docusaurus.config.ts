import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import { themes } from 'prism-react-renderer'

const config: Config = {
  title: 'Decentralized Identifiers (DIDs)',
  tagline: 'A Toolkit for Decentralized Identity',
  url: 'https://did.js.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',

  organizationName: 'ceramicnetwork',
  projectName: 'js-did',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        gtag: {
          trackingID: 'G-Y8ST0EZE16',
          anonymizeIP: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options),
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        tsconfig: '../tsconfig.docs.json',
        sidebar: {
          autoConfiguration: false,
        },
      },
    ],
  ],

  themeConfig:
    ({
      algolia: {
        appId: 'RWEO3NY760',
        apiKey: 'a1aeda8c15fbbf6b5cea420bf68e19eb',
        indexName: 'did-js',
      },
      navbar: {
        title: 'Decentralized Identifiers (DIDs)',
        logo: {
          alt: 'Ceramic Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            label: 'Introduction',
          },
          {
            type: 'doc',
            docId: 'api/dids/index',
            activeBasePath: 'docs/api',
            position: 'left',
            label: 'API',
          },
          {
            href: 'https://github.com/ceramicnetwork/js-did',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Introduction',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/introduction',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Forum',
                href: 'https://forum.ceramic.network/',
              },
              {
                label: 'Discord',
                href: 'http://chat.ceramic.network/',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/ceramicnetwork',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Ceramic documentation',
                href: 'https://developers.ceramic.network',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ceramicnetwork/js-did',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 3Box Labs.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }) satisfies Preset.ThemeConfig,
}

export default config
