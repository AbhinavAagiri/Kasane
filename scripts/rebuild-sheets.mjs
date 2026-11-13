/** Rebuilds contact sheets strictly from the cached candidate files + manifest. */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const MANIFEST = 'assets-unprocessed/candidates.json';
const CACHE = 'assets-unprocessed/candidates';
const OUT = 'assets-unprocessed/sheets';
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
mkdirSync(OUT, { recursive: true });

const esc = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

for (const [key, items] of Object.entries(manifest)) {
  const cells = items
    .map((item, index) => ({ ...item, index, file: path.join(CACHE, `${key}-${index}.jpg`) }))
    .filter((item) => existsSync(item.file));
  if (!cells.length) continue;

  const cols = 4;
  const cellW = 280;
  const cellH = 202;
  const rows = Math.ceil(cells.length / cols);
  const composites = [];

  for (const cell of cells) {
    const image = await sharp(cell.file)
      .resize(cellW - 8, cellH - 32, { fit: 'cover' })
      .toBuffer();
    const x = (cell.index % cols) * cellW;
    const y = Math.floor(cell.index / cols) * cellH;
    composites.push({ input: image, left: x + 4, top: y + 4 });
    composites.push({
      input: Buffer.from(
        `<svg width="${cellW - 8}" height="26" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111"/><text x="6" y="17" font-family="Arial" font-size="12" fill="#f4f1ea">${cell.index + 1}. ${esc(
          (cell.alt || 'untitled').slice(0, 36),
        )}</text></svg>`,
      ),
      left: x + 4,
      top: y + cellH - 28,
    });
  }

  await sharp({
    create: {
      width: cols * cellW,
      height: Math.max(rows, 1) * cellH,
      channels: 3,
      background: '#0d0e0c',
    },
  })
    .composite(composites)
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, `${key}.jpg`));

  writeFileSync(
    path.join(OUT, `${key}.txt`),
    items.map((item, index) => `${index + 1}. ${item.alt}`).join('\n'),
  );
}

console.log('sheets rebuilt');
