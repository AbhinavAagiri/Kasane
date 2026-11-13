#!/usr/bin/env node
/**
 * Build an orthographic "atlas plate" for the no-WebGL
 * fallback. It uses the same Natural Earth land and country data as the live
 * globe, so the fallback is a real map rather than a generic web graphic.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const land = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/map/world-land.json'), 'utf8'));
const countryFile = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'public/map/globe-countries.json'), 'utf8'),
);
const destinations = [
  ['Kyoto', 35.0116, 135.7681],
  ['Jaipur', 26.9124, 75.7873],
  ['Barcelona', 41.3874, 2.1686],
  ['Florence', 43.7696, 11.2558],
  ['Reykjavík', 64.1466, -21.9426],
  ['New York', 40.7128, -74.006],
  ['Lucerne', 47.0502, 8.3093],
  ['Lisbon', 38.7223, -9.1393],
  ['Matera', 40.6664, 16.6043],
  ['Ghent', 51.0543, 3.7174],
  ['Valletta', 35.8989, 14.5146],
  ['Essaouira', 31.5085, -9.7595],
  ['Paris', 48.8566, 2.3522],
  ['Seoul', 37.5665, 126.978],
];

const SIZE = 1600;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 612;
const centerLat = 20;
const centerLng = 15;
const rad = Math.PI / 180;
const sinC = Math.sin(centerLat * rad);
const cosC = Math.cos(centerLat * rad);

const project = (lat, lng) => {
  const lambda = (lng - centerLng) * rad;
  const phi = lat * rad;
  const dot = sinC * Math.sin(phi) + cosC * Math.cos(phi) * Math.cos(lambda);
  if (dot <= 0.015) return null;
  return [
    CX + R * Math.cos(phi) * Math.sin(lambda),
    CY - R * (cosC * Math.sin(phi) - sinC * Math.cos(phi) * Math.cos(lambda)),
  ];
};

const pathForRing = (ring) => {
  const runs = [];
  let current = [];
  for (const [lng, lat] of ring) {
    const point = project(lat, lng);
    if (point) {
      current.push(point);
    } else if (current.length > 1) {
      runs.push(current);
      current = [];
    } else {
      current = [];
    }
  }
  if (current.length > 1) runs.push(current);
  return runs
    .map((run) => `M${run.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}`)
    .join('');
};

const graticule = () => {
  const paths = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    let d = '';
    let pen = false;
    for (let lng = -180; lng <= 180; lng += 2) {
      const point = project(lat, lng);
      if (point) {
        d += `${pen ? 'L' : 'M'}${point[0].toFixed(1)},${point[1].toFixed(1)}`;
        pen = true;
      } else pen = false;
    }
    if (d) paths.push(d);
  }
  for (let lng = -150; lng <= 150; lng += 30) {
    let d = '';
    let pen = false;
    for (let lat = -80; lat <= 80; lat += 2) {
      const point = project(lat, lng);
      if (point) {
        d += `${pen ? 'L' : 'M'}${point[0].toFixed(1)},${point[1].toFixed(1)}`;
        pen = true;
      } else pen = false;
    }
    if (d) paths.push(d);
  }
  return paths;
};

const landPaths = land.features.flatMap((feature) =>
  feature.rings.map((ring) => pathForRing(ring)).filter(Boolean),
);
const borderPaths = countryFile.countries.flatMap((country) =>
  country.polygons.map((ring) => pathForRing(ring)).filter(Boolean),
);
const markerPaths = destinations
  .map(([name, lat, lng]) => {
    const point = project(lat, lng);
    return point
      ? `<g><circle cx="${point[0].toFixed(1)}" cy="${point[1].toFixed(1)}" r="4.2" fill="#dcc28b"/><circle cx="${point[0].toFixed(1)}" cy="${point[1].toFixed(1)}" r="9" fill="none" stroke="#dcc28b" stroke-opacity=".28" stroke-width="1.2"/><title>${name}</title></g>`
      : '';
  })
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <radialGradient id="ocean" cx="38%" cy="30%" r="78%">
      <stop offset="0" stop-color="#283027"/>
      <stop offset=".68" stop-color="#161c16"/>
      <stop offset="1" stop-color="#0d110d"/>
    </radialGradient>
    <radialGradient id="shade" cx="34%" cy="25%" r="74%">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".09"/>
      <stop offset=".74" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity=".24"/>
    </radialGradient>
    <clipPath id="sphere"><circle cx="${CX}" cy="${CY}" r="${R}"/></clipPath>
    <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <circle cx="${CX}" cy="${CY}" r="${R + 34}" fill="#d7c79c" opacity=".08" filter="url(#soft)"/>
  <circle cx="${CX}" cy="${CY}" r="${R + 10}" fill="none" stroke="#d7c79c" stroke-opacity=".17"/>
  <circle cx="${CX}" cy="${CY}" r="${R}" fill="url(#ocean)"/>
  <g clip-path="url(#sphere)">
    <g fill="none" stroke="#d8d2c0" stroke-opacity=".075" stroke-width="1">${graticule()
      .map((d) => `<path d="${d}"/>`)
      .join('')}</g>
    <g fill="#d5cfbd" fill-opacity=".94" stroke="#7a7c6b" stroke-opacity=".65" stroke-width="1.1">${landPaths
      .map((d) => `<path d="${d}"/>`)
      .join('')}</g>
    <g fill="none" stroke="#666b5c" stroke-opacity=".38" stroke-width=".7">${borderPaths
      .map((d) => `<path d="${d}"/>`)
      .join('')}</g>
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="url(#shade)"/>
    ${markerPaths}
  </g>
  <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#f3f0e6" stroke-opacity=".2"/>
</svg>`;

fs.writeFileSync(path.join(ROOT, 'public/map/globe-still.svg'), svg);
await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(path.join(ROOT, 'public/map/globe-still.webp'));
console.log('globe-still.webp built', (fs.statSync(path.join(ROOT, 'public/map/globe-still.webp')).size / 1024).toFixed(0) + 'kb');
