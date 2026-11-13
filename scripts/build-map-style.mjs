#!/usr/bin/env node
/** Build a KASANE map style on top of OpenFreeMap's open vector tiles. */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const style = JSON.parse(await readFile(path.join(ROOT, 'tmp/v2/world/ofm-style.json'), 'utf8'));

style.name = 'KASANE Atlas';
style.metadata = {
  ...style.metadata,
  'kasane:source': 'OpenFreeMap / OpenMapTiles / OpenStreetMap',
  'kasane:note': 'Custom editorial styling. Tile source can be replaced in one place.',
};

const palette = {
  paper: '#e9e6da',
  paperDeep: '#dedacd',
  water: '#bcc8c3',
  waterLine: '#a6b6b0',
  park: '#d9ddc9',
  wood: '#cdd4bd',
  grass: '#dde0d1',
  building: '#e2ddcf',
  road: '#f2eee4',
  roadCasing: '#d6d0c1',
  rail: '#c6c1b3',
  boundary: '#8b8d7c',
  text: '#464a40',
  halo: '#f1eee3',
  minorText: '#6f7266',
};

const idOf = (layer) => layer.id;

for (const layer of style.layers) {
  const id = idOf(layer);
  const paint = (layer.paint ??= {});
  const layout = (layer.layout ??= {});

  if (id === 'background') paint['background-color'] = palette.paper;
  if (id === 'water') paint['fill-color'] = palette.water;
  if (id === 'park') paint['fill-color'] = palette.park;
  if (id === 'landcover_wood') paint['fill-color'] = palette.wood;
  if (id === 'landcover_grass') paint['fill-color'] = palette.grass;
  if (id === 'landcover_ice_shelf' || id === 'landcover_glacier') paint['fill-color'] = '#eeeade';
  if (id === 'landuse_residential') paint['fill-color'] = '#e6e1d4';
  if (id === 'building') paint['fill-color'] = palette.building;
  if (id === 'waterway') paint['line-color'] = palette.waterLine;
  if (id.startsWith('road_') && layer.type === 'fill') {
    paint['fill-color'] = palette.road;
  }
  if (id.startsWith('road_') && layer.type === 'line') {
    paint['line-color'] = palette.road;
  }
  if (id.includes('highway') && layer.type === 'line') {
    paint['line-color'] = id.includes('casing') ? palette.roadCasing : palette.road;
  }
  if (id.includes('railway')) {
    paint['line-color'] = palette.rail;
    paint['line-opacity'] = 0.55;
  }
  if (id.startsWith('boundary')) {
    paint['line-color'] = palette.boundary;
    paint['line-opacity'] = 0.6;
  }
  if (layer.type === 'symbol') {
    paint['text-color'] = palette.text;
    paint['text-halo-color'] = palette.halo;
    paint['text-halo-width'] = 1.1;
    paint['text-halo-blur'] = 0.4;
    if (Array.isArray(layout['text-font'])) {
      layout['text-font'] = ['Noto Sans Regular'];
    }
    if (layout['icon-image']) delete layout['icon-image'];
  }
}

// Drop the shaded-relief raster: the atlas uses open vector land only.
delete style.sources.ne2_shaded;

// An atlas, not a navigation app: drop retail POIs, airports, shields and
// dense street names. Keep water, settlements, regions and countries.
style.layers = style.layers.filter((layer) => {
  const id = layer.id;
  if (['airport', 'label_other', 'label_village', 'label_state'].includes(id)) return false;
  if (id.startsWith('highway-name') || id.startsWith('highway-shield') || id === 'road_shield_us')
    return false;
  if (id.startsWith('aeroway') || id.startsWith('tunnel_')) return false;
  if (layer.source === 'ne2_shaded') return false;
  return true;
});

// Add a very quiet hillshade-free contour field: a sparse graticule makes the
// map read as an atlas even at world zoom.
style.layers.unshift({
  id: 'kasane-graticule',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'boundary',
  filter: ['==', ['get', 'admin_level'], 2],
  paint: {
    'line-color': palette.boundary,
    'line-opacity': 0.12,
    'line-width': 0.5,
    'line-dasharray': [2, 6],
  },
});

await writeFile(path.join(ROOT, 'public/map/kasane-style.json'), JSON.stringify(style, null, 2));
console.log(`kasane-style.json · ${style.layers.length} layers`);
