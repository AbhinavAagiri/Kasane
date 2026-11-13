#!/usr/bin/env node
/**
 * Refresh KASANE's optional event listings from Ticketmaster's public
 * Discovery API. The curated calendar is never replaced: generated entries are
 * merged at build time and deduplicated against it.
 *
 * Missing key or API failure is not a build failure. The site is designed to
 * work with the curated list alone.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const WATCHLIST = path.join(ROOT, 'src/data/events/watchlist.json');
const GENERATED = path.join(ROOT, 'src/data/events/generated.json');
const KEY = process.env.TICKETMASTER_API_KEY;
const now = new Date();
const today = now.toISOString().slice(0, 10);
const horizon = new Date(now);
horizon.setDate(horizon.getDate() + 400);
const horizonDate = horizon.toISOString().slice(0, 10);

const watchlist = JSON.parse(await readFile(WATCHLIST, 'utf8'));
const previous = JSON.parse(await readFile(GENERATED, 'utf8').catch(() => '{"events":[]}'));

const write = async (payload) => {
  await writeFile(GENERATED, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `Wrote ${payload.events.length} generated events · source=${payload.source} · ${payload.checkedAt}`,
  );
};

if (!KEY) {
  console.log('TICKETMASTER_API_KEY is not set. Curated calendar retained; nothing to update.');
  process.exit(0);
}

const categoryMap = {
  Music: 'music',
  Arts: 'arts',
  'Food & Drink': 'food',
  Festival: 'festival',
  'Cultural': 'ritual',
  'Fairs & Festivals': 'festival',
};

const normalise = (value) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const fetchCity = async (city) => {
  const params = new URLSearchParams({
    apikey: KEY,
    latlong: `${city.lat},${city.lng}`,
    radius: '35',
    unit: 'km',
    countryCode: city.countryCode,
    startDateTime: `${today}T00:00:00Z`,
    endDateTime: `${horizonDate}T23:59:59Z`,
    size: '30',
    sort: 'date,asc',
    includeTBA: 'no',
    includeTBD: 'no',
    locale: '*',
  });
  const endpoint = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;
  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json', 'User-Agent': 'KASANE-editorial-atlas/1.0' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Ticketmaster ${city.city}: HTTP ${response.status}`);
  const data = await response.json();
  return data?._embedded?.events ?? [];
};

const normaliseEvent = (raw, city) => {
  const date = raw?.dates?.start?.localDate;
  const end = raw?.dates?.end?.localDate ?? date;
  if (!date || !end || date < today || date > horizonDate) return null;
  if (raw?.dates?.start?.dateTBA || raw?.dates?.start?.dateTBD) return null;
  if (!raw.name || !raw.url) return null;

  const classification = raw.classifications?.[0] ?? {};
  const venue = raw._embedded?.venues?.[0];
  const location = venue?.location;
  const latitude = Number(location?.latitude ?? city.lat);
  const longitude = Number(location?.longitude ?? city.lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const category =
    categoryMap[classification.segment?.name] ??
    categoryMap[classification.genre?.name] ??
    'festival';

  const info = raw.info?.trim() || raw.pleaseNote?.trim() || '';
  const summary = raw.description?.trim()
    ? raw.description.trim().slice(0, 240)
    : `A listed ${String(category).replace('-', ' ')} in ${city.city}, verified through Ticketmaster. Check the official listing for the final programme.`;

  return {
    slug: `tm-${raw.id}`,
    name: raw.name.slice(0, 120),
    destinationSlug: city.slug,
    city: city.city,
    country: venue?.country?.name ?? city.countryCode,
    venue: venue?.name ?? city.city,
    coordinates: { lat: latitude, lng: longitude },
    startDate: date,
    endDate: end,
    category,
    dateStatus: 'confirmed',
    summary,
    body: [
      info ||
        `This listing is supplied by Ticketmaster's public event directory and checked against the destination watchlist. It is included because the date and venue are confirmed by the source, not because KASANE has reviewed the programme.`,
      'Listings can change after publication. Use the official link for the current line-up, accessibility information and ticket terms.',
    ],
    whyGo:
      'A current listing in one of the places covered by the atlas. Treat it as a starting point, then check the organiser’s own programme before building a journey around it.',
    etiquette: [
      'Check the organiser’s current entry and accessibility rules.',
      'Buy tickets only through the official listing or the venue.',
      'If the event takes place in a neighbourhood or place of worship, follow local guidance and keep the route clear.',
    ],
    tickets: {
      status:
        raw.priceRanges?.length || raw.ticket?.url ? 'ticketed' : 'mixed',
      note: raw.priceRanges?.length
        ? 'Ticket prices are listed on the official source. Currency, fees and availability can change.'
        : 'Check the official listing for ticket status and entry conditions.',
      url: raw.ticket?.url ?? raw.url,
    },
    source: {
      label: 'Ticketmaster event listing',
      url: raw.url,
      checkedAt: now.toISOString(),
    },
    tags: [
      classification.segment?.name,
      classification.genre?.name,
      venue?.city?.name,
    ].filter(Boolean),
    generated: true,
  };
};

try {
  const rawEvents = [];
  for (const city of watchlist) {
    try {
      rawEvents.push(...(await fetchCity(city)).map((event) => ({ event, city })));
    } catch (error) {
      console.warn(String(error));
    }
  }

  if (!rawEvents.length) {
    console.warn('No events returned. Keeping the previous generated list.');
    process.exit(0);
  }

  const seen = new Set();
  const events = [];
  for (const { event, city } of rawEvents) {
    const normalised = normaliseEvent(event, city);
    if (!normalised) continue;
    const key = `${normalise(normalised.name)}-${normalised.startDate}`;
    if (seen.has(key)) continue;
    seen.add(key);
    events.push(normalised);
  }

  if (!events.length) {
    console.warn('All returned events failed validation. Keeping the previous generated list.');
    process.exit(0);
  }

  events.sort((a, b) => a.startDate.localeCompare(b.startDate));
  await write({
    checkedAt: now.toISOString(),
    source: 'Ticketmaster Discovery API',
    events: events.slice(0, 80),
  });
} catch (error) {
  console.error('Event refresh failed. Curated calendar and previous generated list retained.');
  console.error(error instanceof Error ? error.message : String(error));
  // A scheduled refresh should not turn a working static site red.
  process.exit(0);
}
