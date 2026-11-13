export const site = {
  name: 'KASANE',
  tagline: 'See the world in layers.',
  description:
    'KASANE is an independent editorial atlas of living culture — the beliefs, kitchens, landscapes and festivals that make a place itself, with the tools to keep what matters and plan a quieter journey.',
  url: __SITE_URL__,
  copyright: '© 2026 KASANE. All rights reserved.',
  disclosure:
    'KASANE is an independent editorial project. Places are described editorially; photography and film are licensed and credited. Event details are checked against official sources but can change — always confirm with the organiser. No bookings are taken here.',
  nav: [
    { label: 'Discover', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'Journal', href: '/journal' },
    { label: 'Culture', href: '/culture' },
    { label: 'Events', href: '/events' },
    { label: 'Plan', href: '/plan' },
    { label: 'My World', href: '/my-world' },
  ],
  footer: {
    explore: [
      { label: 'The atlas', href: '/explore' },
      { label: 'The journal', href: '/journal' },
      { label: 'Culture', href: '/culture' },
      { label: 'Events', href: '/events' },
      { label: 'Plan a journey', href: '/plan' },
      { label: 'Collections', href: '/collections' },
    ],
    about: [
      { label: 'About KASANE', href: '/about' },
      { label: 'Credits', href: '/credits' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
} as const;
