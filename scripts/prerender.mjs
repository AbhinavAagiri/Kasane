import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  publicRoutes,
  staticRoutes,
  notFoundMeta,
  render,
  site,
} from '../dist-server/entry-server.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const SEO_START = '<!--KASANE_SEO_START-->';
const SEO_END = '<!--KASANE_SEO_END-->';
const APP_MARKER = '<!--KASANE_APP-->';

if (!template.includes(SEO_START) || !template.includes(SEO_END)) {
  throw new Error('SEO markers are missing from the built index.html');
}
if (!template.includes(APP_MARKER)) {
  throw new Error('App marker is missing from the built index.html');
}

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const absolute = (value) => (value.startsWith('http') ? value : `${site.url}${value}`);

const serialiseJsonLd = (jsonLd) =>
  jsonLd.length
    ? JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonLd }).replace(/</g, '\\u003c')
    : '';

const headFor = (meta) => {
  const canonical = meta.path === '/' ? `${site.url}/` : `${site.url}${meta.path}`;
  const image = absolute(meta.image);
  const jsonLd = serialiseJsonLd(meta.jsonLd);
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    '<meta name="author" content="KASANE" />',
    `<meta name="robots" content="${meta.noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    ...(meta.noindex ? [] : [`<link rel="canonical" href="${escapeHtml(canonical)}" />`]),
    `<meta property="og:type" content="${meta.type}" />`,
    '<meta property="og:site_name" content="KASANE" />',
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(meta.imageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    ...(jsonLd ? [`<script type="application/ld+json" id="kasane-jsonld">${jsonLd}</script>`] : []),
  ].join('\n    ');
};

const renderPage = (meta) => {
  const body = render(meta.path);
  return template
    .replace(new RegExp(`${SEO_START}[\\s\\S]*?${SEO_END}`), `${SEO_START}\n    ${headFor(meta)}\n    ${SEO_END}`)
    .replace(APP_MARKER, body);
};

const writePage = (meta) => {
  const html = renderPage(meta);
  const target =
    meta.path === '/'
      ? path.join(dist, 'index.html')
      : path.join(dist, meta.path.replace(/^\/+/, ''), 'index.html');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html, 'utf8');
  return target;
};

const written = staticRoutes.map(writePage);
const notFound = renderPage(notFoundMeta('/404'));
fs.writeFileSync(path.join(dist, '404.html'), notFound, 'utf8');
written.push(path.join(dist, '404.html'));

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...publicRoutes.map((route) => {
    const loc = route.path === '/' ? `${site.url}/` : `${site.url}${route.path}`;
    return `  <url><loc>${escapeHtml(loc)}</loc><changefreq>${route.changefreq}</changefreq><priority>${route.priority.toFixed(1)}</priority></url>`;
  }),
  '</urlset>',
  '',
].join('\n');

const robots = `# Search engines: public content is crawlable; only browser-local tools are excluded.
User-agent: *
Allow: /
Disallow: /my-world
Disallow: /plan/new
Disallow: /plan/trip-
Disallow: /collections/collection-

# Answer engines and user-triggered fetchers: allowed.
User-agent: OAI-SearchBot
Allow: /
Disallow: /my-world
Disallow: /plan/new
Disallow: /plan/trip-
Disallow: /collections/collection-

User-agent: ChatGPT-User
Allow: /
Disallow: /my-world
Disallow: /plan/new
Disallow: /plan/trip-
Disallow: /collections/collection-

User-agent: PerplexityBot
Allow: /
Disallow: /my-world
Disallow: /plan/new
Disallow: /plan/trip-
Disallow: /collections/collection-

# Model-training crawlers: intentionally not allowed. This is a robots.txt
# preference, not access control; the editorial content remains public.
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: ${site.url}/sitemap.xml
`;

const countryLinks = publicRoutes
  .filter((route) => route.path.startsWith('/countries/'))
  .map((route) => {
    const name = route.title.match(/^Explore (.*?) —/)?.[1] ?? route.path;
    return `- [${name}](${site.url}${route.path})`;
  });
const destinationLinks = publicRoutes
  .filter((route) => route.path.startsWith('/destinations/'))
  .map((route) => {
    const name = route.title.match(/^Explore (.*?) —/)?.[1] ?? route.path;
    return `- [${name}](${site.url}${route.path})`;
  });
const storyLinks = publicRoutes
  .filter((route) => route.path.startsWith('/journal/'))
  .map((route) => {
    const title = route.title.replace(/ \| KASANE Journal$/, '');
    return `- [${title}](${site.url}${route.path})`;
  });

const llms = `# KASANE

> KASANE is an independent editorial atlas of living culture: ${destinationLinks.length} places in ${countryLinks.length} countries, read through architecture, culture, landscape, food and the calendar.

## What this site is

KASANE is a static editorial publication and a browser-based travel planner. It does not take bookings, sell trips or publish rankings. Places are described editorially; event dates are checked against official sources and should be confirmed with the organiser.

## Main sections

- [The atlas](${site.url}/explore): search and filter every destination.
- [Journal](${site.url}/journal): essays on places, architecture, culture and nature.
- [Culture](${site.url}/culture): beliefs, rituals, food, craft and local life.
- [Events](${site.url}/events): a checked calendar of cultural festivals and gatherings.
- [Collections](${site.url}/collections): curated routes through the atlas.
- [Plan a journey](${site.url}/plan): a local, day-by-day itinerary tool.
- [About](${site.url}/about): what KASANE is and how it is made.

## Countries

${countryLinks.join('\n')}

## Destinations

${destinationLinks.join('\n')}

## Editorial

${storyLinks.join('\n')}

## Usage and attribution

Editorial text is © KASANE. Photography and film are licensed from the creators credited at [${site.url}/credits](${site.url}/credits); do not re-host them without checking the underlying licence. When quoting or citing KASANE, link to the relevant page.

## Machine-readable

- [Sitemap](${site.url}/sitemap.xml)
- [Robots policy](${site.url}/robots.txt)
`;

for (const [name, contents] of [
  ['sitemap.xml', sitemap],
  ['robots.txt', robots],
  ['llms.txt', llms],
]) {
  fs.writeFileSync(path.join(dist, name), contents, 'utf8');
  fs.writeFileSync(path.join(root, 'public', name), contents, 'utf8');
}

console.log(`prerendered ${written.length} HTML routes`);
console.log(`sitemap: ${publicRoutes.length} public URLs`);
