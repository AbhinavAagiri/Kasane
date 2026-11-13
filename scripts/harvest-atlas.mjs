/**
 * Harvests candidate photography for the KASANE atlas from Unsplash search,
 * then builds labelled contact sheets for art direction. Nothing is published;
 * only the chosen candidates are processed into the public library.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = 'assets-unprocessed/candidates';
const SHEETS = 'assets-unprocessed/sheets';
const MANIFEST = 'assets-unprocessed/candidates.json';

const QUERIES = {
  hero: 'dolomites mountains fog',
  kyoto: 'kyoto temple garden',
  jaipur: 'jaipur palace architecture',
  barcelona: 'barcelona eixample architecture',
  florence: 'florence italy cityscape',
  reykjavik: 'reykjavik iceland',
  'new-york': 'new york city street architecture',
  lucerne: 'lucerne switzerland lake',
  lisbon: 'lisbon portugal street',
  matera: 'matera italy',
  ghent: 'ghent belgium canal',
  hydra: 'hydra greece',
  essaouira: 'essaouira morocco',
  valletta: 'valletta malta',
  'cat-architecture': 'brutalist concrete architecture',
  'cat-culture': 'india festival culture',
  'cat-nature': 'iceland waterfall landscape',
  'cat-food': 'food market stall',
  'cat-cities': 'tokyo street neighborhood',
  'cat-art': 'art gallery interior',
  'cat-history': 'ancient ruins columns',
  'story-kyoto': 'kyoto machiya wood',
  'story-rajasthan': 'jaipur courtyard architecture',
  'story-italy': 'tuscany countryside',
  'story-iceland': 'iceland highlands',
  'story-lisbon': 'lisbon azulejo tiles',
  'story-newyork': 'new york brownstone',
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const esc = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const fetchBuffer = async (url) => {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
};

const existing = (() => {
  try {
    return JSON.parse(readFileSync(MANIFEST, 'utf8'));
  } catch {
    return {};
  }
})();

const run = async () => {
  await mkdir(OUT, { recursive: true });
  await mkdir(SHEETS, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  );

  for (const [key, query] of Object.entries(QUERIES)) {
    if (existing[key]?.length >= 6) continue;
    const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}?orientation=landscape`;
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
      await new Promise((r) => setTimeout(r, 1200));
      await page.evaluate(() => window.scrollTo(0, 900));
      await new Promise((r) => setTimeout(r, 1600));

      const found = await page.evaluate(() => {
        const seen = new Set();
        const items = [];
        document.querySelectorAll('figure img').forEach((img) => {
          const match = (img.currentSrc || img.src || '').match(/photo-([0-9a-f-]+)/);
          if (!match || seen.has(match[1])) return;
          seen.add(match[1]);
          items.push({
            id: match[1],
            alt: (img.alt || '').trim(),
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        });
        return items;
      });

      const picks = found.slice(0, 8);
      if (!picks.length) {
        console.log('EMPTY', key, found.length, JSON.stringify(found.slice(0,2)));
        continue;
      }

      const cells = [];
      for (let index = 0; index < picks.length; index += 1) {
        const pick = picks[index];
        const file = path.join(OUT, `${key}-${index}.jpg`);
        try {
          const buffer = await fetchBuffer(
            `https://images.unsplash.com/photo-${pick.id}?w=520&h=340&fit=crop&q=70`,
          );
          await writeFile(file, buffer);
          cells.push({ ...pick, file, index });
        } catch (error) {
          console.log('skip', key, index, error.message);
        }
      }

      const cols = 4;
      const cellW = 280;
      const cellH = 202;
      const rows = Math.ceil(cells.length / cols);
      const composites = [];
      for (const cell of cells) {
        const x = (cell.index % cols) * cellW;
        const y = Math.floor(cell.index / cols) * cellH;
        const image = await sharp(cell.file)
          .resize(cellW - 8, cellH - 32, { fit: 'cover' })
          .toBuffer();
        composites.push({ input: image, left: x + 4, top: y + 4 });
        const label = Buffer.from(
          `<svg width="${cellW - 8}" height="26" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#111"/>
            <text x="6" y="17" font-family="Arial" font-size="12" fill="#f4f1ea">${cell.index + 1}. ${esc(
              (cell.alt || 'untitled').slice(0, 38),
            )}</text>
          </svg>`,
        );
        composites.push({ input: label, left: x + 4, top: y + cellH - 28 });
      }

      await sharp({
        create: {
          width: cols * cellW,
          height: rows * cellH,
          channels: 3,
          background: '#0d0e0c',
        },
      })
        .composite(composites)
        .jpeg({ quality: 82 })
        .toFile(path.join(SHEETS, `${key}.jpg`));

      existing[key] = picks;
      await writeFile(MANIFEST, JSON.stringify(existing, null, 2));
      console.log('harvested', key, picks.length);
    } catch (error) {
      console.log('FAIL', key, error.message);
    }
  }

  await browser.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
