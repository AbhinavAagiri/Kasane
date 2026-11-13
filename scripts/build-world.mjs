#!/usr/bin/env node
/** Turn Natural Earth land geometry into KASANE's atlas fallback and globe dots. */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const input = JSON.parse(await readFile(path.join(ROOT, 'tmp/v2/world/land.geojson'), 'utf8'));
const OUT = path.join(ROOT, 'public/map');

const W = 1600;
const H = 800;
const project = ([lng, lat]) => [
  ((lng + 180) / 360) * W,
  ((90 - lat) / 180) * H,
];

const features = input.features ?? [];
const polygons = [];
for (const feature of features) {
  const geometry = feature.geometry;
  if (!geometry) continue;
  const groups =
    geometry.type === 'Polygon'
      ? [geometry.coordinates]
      : geometry.type === 'MultiPolygon'
        ? geometry.coordinates
        : [];
  for (const group of groups) {
    const rings = group.map((ring) =>
      ring
        .filter((_, index) => index % 1 === 0)
        .map(([lng, lat]) => [Number(lng.toFixed(2)), Number(lat.toFixed(2))]),
    );
    if (rings[0]?.length > 2) polygons.push(rings);
  }
}

const toPath = (rings) =>
  rings
    .map(
      (ring) =>
        `${ring
          .map(([lng, lat], index) => {
            const [x, y] = project([lng, lat]);
            return `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
          })
          .join('')}Z`,
    )
    .join('');

const landPath = polygons.map(toPath).join('');
const graticule = [];
for (let lng = -180; lng <= 180; lng += 30) {
  const [x] = project([lng, 0]);
  graticule.push(`M${x.toFixed(1)} 0V${H}`);
}
for (let lat = -60; lat <= 60; lat += 30) {
  const [, y] = project([0, lat]);
  graticule.push(`M0 ${y.toFixed(1)}H${W}`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Stylised world map">
  <rect width="${W}" height="${H}" fill="#e7e5d9"/>
  <g fill="none" stroke="#b9b7a8" stroke-width="0.7" opacity="0.55">${graticule
    .map((d) => `<path d="${d}"/>`)
    .join('')}</g>
  <path d="${landPath}" fill="#c9c9b8" fill-rule="evenodd" stroke="#8e9181" stroke-width="0.8" stroke-linejoin="round"/>
  <g fill="none" stroke="#777b6a" stroke-width="0.5" opacity="0.28">
    <ellipse cx="${W / 2}" cy="${H / 2}" rx="${W * 0.29}" ry="${H * 0.34}"/>
    <ellipse cx="${W / 2}" cy="${H / 2}" rx="${W * 0.21}" ry="${H * 0.24}"/>
    <ellipse cx="${W / 2}" cy="${H / 2}" rx="${W * 0.13}" ry="${H * 0.15}"/>
  </g>
</svg>`;

/** Point-in-ring, ray casting. Ring is [lng, lat][]. */
const inRing = ([lng, lat], ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const onLand = (lng, lat) =>
  polygons.some((rings) => inRing([lng, lat], rings[0]) && !rings.slice(1).some((hole) => inRing([lng, lat], hole)));

const dots = [];
for (let lat = -78; lat <= 82; lat += 1.7) {
  const circumference = Math.cos((lat * Math.PI) / 180);
  const step = 1.55 / Math.max(0.24, circumference);
  for (let lng = -180; lng < 180; lng += step) {
    if (onLand(lng, lat)) dots.push([Number(lng.toFixed(2)), Number(lat.toFixed(2))]);
  }
}

await writeFile(path.join(OUT, 'world.svg'), svg);
await writeFile(
  path.join(OUT, 'world-land.json'),
  JSON.stringify({ type: 'FeatureCollection', features: polygons.map((rings) => ({ rings })) }),
);
await writeFile(path.join(OUT, 'world-dots.json'), JSON.stringify(dots));
console.log(`world.svg ${(svg.length / 1024).toFixed(0)}kb · ${polygons.length} polygons · ${dots.length} globe dots`);
