/**
 * Builds the KASANE atlas photography library.
 * Each chosen frame is downloaded at 2400px, given one restrained grade so the
 * whole atlas reads as a single commission, and emitted as 640/1000/1600/2200
 * WebP + JPEG derivatives.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const MANIFEST = JSON.parse(await readFile('assets-unprocessed/candidates.json', 'utf8'));
const RAW = 'assets-unprocessed/final';
const PUBLIC = 'public/images';
const WIDTHS = [640, 1000, 1600, 2200];

/** final asset key -> [sheet key, candidate index] */
const SELECTION = {
  'atlas-hero': ['hero', 3],
  'atlas-closing': ['hero', 1],

  'dest-kyoto': ['kyoto', 0],
  'dest-kyoto-b': ['kyoto', 1],
  'dest-jaipur': ['jaipur', 1],
  'dest-jaipur-b': ['jaipur', 3],
  'dest-barcelona': ['barcelona', 3],
  'dest-barcelona-b': ['barcelona', 1],
  'dest-florence': ['florence', 5],
  'dest-florence-b': ['florence', 3],
  'dest-reykjavik': ['reykjavik', 2],
  'dest-reykjavik-b': ['reykjavik', 1],
  'dest-new-york': ['new-york', 6],
  'dest-new-york-b': ['new-york', 3],
  'dest-lucerne': ['lucerne', 1],
  'dest-lucerne-b': ['lucerne', 6],
  'dest-lisbon': ['lisbon', 1],
  'dest-lisbon-b': ['lisbon', 7],
  'dest-matera': ['matera', 3],
  'dest-matera-b': ['matera', 5],
  'dest-ghent': ['ghent', 7],
  'dest-ghent-b': ['ghent', 5],
  'dest-valletta': ['valletta', 4],
  'dest-valletta-b': ['valletta', 5],
  'dest-essaouira': ['essaouira', 4],
  'dest-essaouira-b': ['essaouira', 5],

  'interest-architecture': ['cat-architecture', 6],
  'interest-culture': ['cat-culture', 1],
  'interest-nature': ['cat-nature', 3],
  'interest-food': ['cat-food', 6],
  'interest-cities': ['cat-cities', 1],
  'interest-art': ['cat-art', 3],
  'interest-history': ['cat-history', 1],

  'story-kyoto': ['story-kyoto', 3],
  'story-kyoto-b': ['story-kyoto', 5],
  'story-rajasthan': ['story-rajasthan', 3],
  'story-rajasthan-b': ['story-rajasthan', 7],
  'story-italy': ['story-italy', 7],
  'story-italy-b': ['story-italy', 5],
  'story-iceland': ['story-iceland', 2],
  'story-iceland-b': ['story-iceland', 5],
  'story-lisbon': ['story-lisbon', 6],
  'story-lisbon-b': ['story-lisbon', 3],
  'story-new-york': ['story-newyork', 1],
  'story-new-york-b': ['story-newyork', 7],
};

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

const download = async (url, dest) => {
  try {
    await readFile(dest);
    return;
  } catch {
    /* not cached */
  }
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
};

const grade = (input) =>
  sharp(input)
    .rotate()
    .modulate({ saturation: 0.9, brightness: 1.01 })
    .linear(1.03, -4)
    .sharpen({ sigma: 0.55, m1: 0.5, m2: 1.2 });

const emit = async (pipeline, key) => {
  const base = await pipeline.jpeg({ quality: 92, mozjpeg: true }).toBuffer();
  for (const width of WIDTHS) {
    await sharp(base)
      .resize({ width, fit: 'inside' })
      .webp({ quality: 78, effort: 4 })
      .toFile(path.join(PUBLIC, `${key}-${width}.webp`));
    await sharp(base)
      .resize({ width, fit: 'inside' })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(path.join(PUBLIC, `${key}-${width}.jpg`));
  }
};

await mkdir(RAW, { recursive: true });
await mkdir(PUBLIC, { recursive: true });

const attribution = [];
const failures = [];

for (const [asset, [sheet, index]] of Object.entries(SELECTION)) {
  const candidate = MANIFEST[sheet]?.[index];
  if (!candidate) {
    failures.push(`${asset}: no candidate ${sheet}[${index}]`);
    continue;
  }
  const raw = path.join(RAW, `${asset}.jpg`);
  try {
    await download(
      `https://images.unsplash.com/photo-${candidate.id}?w=2400&q=88&fm=jpg&fit=max`,
      raw,
    );
    await emit(grade(raw), asset);
    attribution.push({
      key: asset,
      source: 'Unsplash',
      photoId: candidate.id,
      alt: candidate.alt,
      license: 'Unsplash License',
    });
    console.log('processed', asset);
  } catch (error) {
    failures.push(`${asset}: ${error.message}`);
  }
}

await sharp(path.join(RAW, 'atlas-hero.jpg'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .modulate({ saturation: 0.88, brightness: 0.97 })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(PUBLIC, 'og-kasane.jpg'));

await writeFile(
  path.join(PUBLIC, 'attribution.json'),
  JSON.stringify(
    {
      note: 'Photography licensed via Unsplash. Destinations are depicted editorially; KASANE is not affiliated with any place shown.',
      images: attribution,
    },
    null,
    2,
  ),
);

console.log(`done ${attribution.length} images, ${failures.length} failures`);
failures.forEach((failure) => console.log('FAIL', failure));
