#!/usr/bin/env node
/**
 * Build the responsive image set used by SmartImage.
 *
 * Sources live in assets/originals so an image can be re-cropped or re-encoded
 * without going back to the web. Metadata is written into
 * public/images/attribution.json; that file is the public record of every
 * photograph, its creator, licence and source page.
 *
 *   node scripts/images.mjs            # build everything described below
 *   node scripts/images.mjs kyoto-b    # rebuild one key
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCES = path.join(ROOT, 'assets/originals');
const OUT = path.join(ROOT, 'public/images');
const ATTRIBUTION = path.join(OUT, 'attribution.json');
const WIDTHS = [640, 1000, 1600, 2200];

/** key → source file and public credit. */
const IMAGES = [
  {
    key: 'dest-kyoto-b',
    file: 'kyoto-b.jpg',
    source: 'Pexels',
    creator: 'AXP Photography',
    licence: 'Pexels License',
    sourceUrl: 'https://www.pexels.com/photo/hashin-tei-garden-in-kyoto-japan-18848760/',
    subject: 'Hashin-tei garden, Kyoto',
    usage: 'Kyoto destination detail',
    alt: 'Raked gravel and clipped pines in a Kyoto temple garden',
  },
  {
    key: 'dest-lisbon',
    file: 'lisbon-hero.jpg',
    source: 'Pexels',
    creator: 'Pexels contributor',
    licence: 'Pexels License',
    sourceUrl: 'https://www.pexels.com/photo/rooftop-view-of-lisbon-s-historic-alfama-district-31762629/',
    subject: 'Alfama, Lisbon',
    usage: 'Lisbon destination hero',
    alt: 'Terracotta rooftops and white houses stepping down toward the Tagus in Alfama',
  },
  {
    key: 'dest-lisbon-b',
    file: 'lisbon-detail.jpg',
    source: 'Pexels',
    creator: 'Pexels contributor',
    licence: 'Pexels License',
    sourceUrl: 'https://www.pexels.com/photo/scenic-view-of-lisbon-s-historic-alfama-district-28962467/',
    subject: 'Alfama, Lisbon',
    usage: 'Lisbon destination detail',
    alt: 'A dense roofscape of terracotta tiles above Lisbon',
  },
  {
    key: 'dest-reykjavik',
    file: 'reykjavik-hero.jpg',
    source: 'Pexels',
    creator: 'Pexels contributor',
    licence: 'Pexels License',
    sourceUrl: 'https://www.pexels.com/photo/aerial-view-of-hallgrimskirkja-in-reykjavik-iceland-29877249/',
    subject: 'Hallgrímskirkja, Reykjavík',
    usage: 'Reykjavík destination hero',
    alt: 'Hallgrímskirkja rising above the low rooftops of Reykjavík',
  },
  {
    key: 'dest-reykjavik-b',
    file: 'reykjavik-detail.jpg',
    source: 'Pexels',
    creator: 'Pexels contributor',
    licence: 'Pexels License',
    sourceUrl: 'https://www.pexels.com/photo/colorful-street-leading-to-hallgrimskirkja-37958318/',
    subject: 'Rainbow Street, Reykjavík',
    usage: 'Reykjavík destination detail',
    alt: 'A rainbow-painted street leading toward Hallgrímskirkja',
  },
  {
    key: 'dest-paris',
    file: 'paris-hero.jpg',
    source: 'Pexels',
    creator: 'Vinícius Araújo',
    licence: 'Pexels License',
    sourceUrl: 'https://www.pexels.com/photo/a-view-of-the-city-of-paris-6496932/',
    subject: 'Paris rooftops and the Eiffel Tower',
    usage: 'Paris destination hero',
    alt: 'Zinc rooftops and chimney pots with the Eiffel Tower against a pale evening sky',
  },
  {
    key: 'dest-paris-b',
    file: 'paris-detail.jpg',
    source: 'Pexels',
    creator: 'Pexels contributor',
    licence: 'Pexels License',
    sourceUrl: 'https://www.pexels.com/photo/paris-rooftops-with-eiffel-tower-in-view-31925199/',
    subject: 'Paris rooftops',
    usage: 'Paris destination detail',
    alt: 'A close view of Parisian zinc roofs and the Eiffel Tower',
  },
  {
    key: 'dest-seoul',
    file: 'seoul-hero.jpg',
    source: 'Pexels',
    creator: 'Pexels contributor',
    licence: 'Pexels License',
    sourceUrl: 'https://www.pexels.com/photo/36679865/',
    subject: 'Gyeongbokgung, Seoul',
    usage: 'Seoul destination hero',
    alt: 'A traditional Korean palace pavilion in Seoul under a wide sky',
  },
  {
    key: 'dest-seoul-b',
    file: 'seoul-detail.jpg',
    source: 'Pexels',
    creator: 'Pexels contributor',
    licence: 'Pexels License',
    sourceUrl: 'https://www.pexels.com/photo/roofs-of-traditional-korean-houses-in-bukchon-hanok-village-20325767/',
    subject: 'Bukchon Hanok Village, Seoul',
    usage: 'Seoul destination detail',
    alt: 'Dark curved hanok roofs layered above Bukchon',
  },
  {
    key: 'dest-essaouira-b',
    file: 'essaouira-detail.jpg',
    source: 'Pexels',
    creator: 'Pexels contributor',
    licence: 'Pexels License',
    sourceUrl: 'https://www.pexels.com/photo/blue-fishing-boats-at-essaouira-harbor-37442059/',
    subject: 'Essaouira harbour',
    usage: 'Essaouira destination detail',
    alt: 'Blue fishing boats packed into the harbour at Essaouira',
  },
  {
    key: 'dest-matera-b',
    file: 'matera-detail.jpg',
    source: 'Pexels',
    creator: 'Pexels contributor',
    licence: 'Pexels License',
    sourceUrl: 'https://www.pexels.com/photo/scenic-view-of-matera-s-historic-sassi-38015361',
    subject: 'Sassi di Matera',
    usage: 'Matera destination detail',
    alt: 'The stone terraces and cave dwellings of the Sassi di Matera',
  },
  {
    key: 'dest-marrakech',
    file: 'marrakech-hero.jpg',
    source: 'Wikimedia Commons',
    creator: 'Unknown (Wikimedia Commons)',
    licence: 'Public domain',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Koutoubia_Mosque_1.jpg',
    subject: 'Koutoubia Mosque, Marrakech',
    usage: 'Marrakech destination hero',
    alt: 'The Koutoubia minaret rising above palms and low red buildings in Marrakech',
  },
  {
    key: 'dest-marrakech-b',
    file: 'marrakech-detail.jpg',
    source: 'Wikimedia Commons',
    creator: 'Parsifall',
    licence: 'CC BY-SA 3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Marrakech,_Medersa_Ben_Youssef_02.jpg',
    subject: 'Ben Youssef Madrasa, Marrakech',
    usage: 'Marrakech destination detail',
    alt: 'Carved stucco arch and zellige tilework in the Ben Youssef Madrasa, Marrakech',
  },
  {
    key: 'dest-istanbul',
    file: 'istanbul-hero.jpg',
    source: 'Wikimedia Commons',
    creator: 'Arild Vågen',
    licence: 'CC BY-SA 3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hagia_Sophia_Mars_2013.jpg',
    subject: 'Hagia Sophia, Istanbul',
    usage: 'Istanbul destination hero',
    alt: 'Hagia Sophia’s domes and minarets seen across the square in Istanbul',
  },
  {
    key: 'dest-istanbul-b',
    file: 'istanbul-detail.jpg',
    source: 'Wikimedia Commons',
    creator: 'Moonik',
    licence: 'CC BY-SA 3.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Sultanahmet_ferry_on_the_Bosphorus_in_Istanbul,_Turkey_001.jpg',
    subject: 'Bosphorus, Istanbul',
    usage: 'Istanbul destination detail',
    alt: 'A ferry crossing the Bosphorus with the Istanbul skyline and minarets behind',
  },
  {
    key: 'dest-hanoi',
    file: 'hanoi-hero.jpg',
    source: 'Wikimedia Commons',
    creator: 'Daderot',
    licence: 'CC0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Hoan_Kiem_Lake_-_Hanoi,_Vietnam_-_DSC03695.JPG',
    subject: 'Hoan Kiem Lake, Hanoi',
    usage: 'Hanoi destination hero',
    alt: 'Hoan Kiem Lake ringed by trees and the lakeside walk in central Hanoi',
  },
  {
    key: 'dest-hanoi-b',
    file: 'hanoi-detail.jpg',
    source: 'Wikimedia Commons',
    creator: 'Richard Mortel',
    licence: 'CC BY 2.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Old_Quarter,_Hanoi_(38464361292).jpg',
    subject: 'Old Quarter, Hanoi',
    usage: 'Hanoi destination detail',
    alt: 'A shopfront of bags and street life in Hanoi’s Old Quarter',
  },
  {
    key: 'dest-bangkok',
    file: 'bangkok-hero.jpg',
    source: 'Wikimedia Commons',
    creator: 'Diego Delso',
    licence: 'CC BY-SA 3.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Templo_Wat_Arun,_Bangkok,_Tailandia,_2013-08-22,_DD_05.jpg',
    subject: 'Wat Arun, Bangkok',
    usage: 'Bangkok destination hero',
    alt: 'The ornate central prang of Wat Arun against a cloudy Bangkok sky',
  },
  {
    key: 'dest-bangkok-b',
    file: 'bangkok-detail.jpg',
    source: 'Wikimedia Commons',
    creator: 'Diego Delso',
    licence: 'CC BY-SA 3.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Wat_Pho,_Bangkok,_Tailandia,_2013-08-22,_DD_02.jpg',
    subject: 'Wat Pho, Bangkok',
    usage: 'Bangkok destination detail',
    alt: 'The gilded reclining Buddha inside Wat Pho, Bangkok',
  },
  {
    key: 'dest-ubud',
    file: 'ubud-hero.jpg',
    source: 'Wikimedia Commons',
    creator: 'Nepomuk',
    licence: 'CC BY-SA 3.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Pura_Taman_Saraswati_(Ubud,_Bali,_Indonesia).jpg',
    subject: 'Pura Taman Saraswati, Ubud',
    usage: 'Ubud destination hero',
    alt: 'The split gate and lotus pond of Pura Taman Saraswati in Ubud, Bali',
  },
  {
    key: 'dest-ubud-b',
    file: 'ubud-detail.jpg',
    source: 'Wikimedia Commons',
    creator: 'Pinterpandai',
    licence: 'CC BY-SA 3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tegallalang_Rice_Terrace.jpg',
    subject: 'Tegallalang rice terraces, Bali',
    usage: 'Ubud destination detail',
    alt: 'Terraced rice fields stepped into the hills at Tegallalang near Ubud',
  },
  {
    key: 'dest-mexico-city',
    file: 'mexico-city-hero.jpg',
    source: 'Wikimedia Commons',
    creator: 'Daniel Case',
    licence: 'CC BY-SA 3.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Palaco_de_Bellas_Artes,_Mexico_City,_from_across_Eje_Central_Lazaro_Cardenas_in_evening.jpg',
    subject: 'Palacio de Bellas Artes, Mexico City',
    usage: 'Mexico City destination hero',
    alt: 'The Palacio de Bellas Artes lit at dusk, seen across Avenida Juárez in Mexico City',
  },
  {
    key: 'dest-mexico-city-b',
    file: 'mexico-city-detail.jpg',
    source: 'Wikimedia Commons',
    creator: 'Diego Delso',
    licence: 'CC BY-SA 3.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Palacio_de_Bellas_Artes,_M%C3%A9xico_D.F.,_M%C3%A9xico,_2013-10-13,_DD_40.jpg',
    subject: 'Palacio de Bellas Artes interior',
    usage: 'Mexico City destination detail',
    alt: 'The stained-glass dome and gilded interior of the Palacio de Bellas Artes',
  },
  {
    key: 'dest-cusco',
    file: 'cusco-hero.jpg',
    source: 'Wikimedia Commons',
    creator: 'Diego Delso',
    licence: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Catedral,_Plaza_de_Armas,_Cusco,_Per%C3%BA,_2015-07-31,_DD_73.JPG',
    subject: 'Plaza de Armas, Cusco',
    usage: 'Cusco destination hero',
    alt: 'The cathedral on the Plaza de Armas in Cusco, Peru',
  },
  {
    key: 'dest-cusco-b',
    file: 'cusco-detail.jpg',
    source: 'Wikimedia Commons',
    creator: 'Diego Delso',
    licence: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Sacsayhuam%C3%A1n,_Cusco,_Per%C3%BA,_2015-07-31,_DD_27.JPG',
    subject: 'Sacsayhuamán, Cusco',
    usage: 'Cusco destination detail',
    alt: 'The fitted stone walls of Sacsayhuamán above Cusco',
  },
  {
    key: 'dest-cape-town',
    file: 'cape-town-hero.jpg',
    source: 'Wikimedia Commons',
    creator: 'South African Tourism',
    licence: 'CC BY 2.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Table_Mountain_from_Blouberg,_South_Africa_(4028515275).jpg',
    subject: 'Table Mountain from Bloubergstrand',
    usage: 'Cape Town destination hero',
    alt: 'Table Mountain rising beyond the surf at Bloubergstrand, Cape Town',
  },
  {
    key: 'dest-cape-town-b',
    file: 'cape-town-detail.jpg',
    source: 'Wikimedia Commons',
    creator: 'Martinvl',
    licence: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Dorp_Street,_Bo-Kaap,_Cape_Town.JPG',
    subject: 'Bo-Kaap, Cape Town',
    usage: 'Cape Town destination detail',
    alt: 'Pastel houses along Dorp Street in Bo-Kaap, Cape Town',
  },
  {
    key: 'dest-athens',
    file: 'athens-hero.jpg',
    source: 'Wikimedia Commons',
    creator: 'A.Savin',
    licence: 'CC BY-SA 3.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Attica_06-13_Athens_50_View_from_Philopappos_-_Acropolis_Hill.jpg',
    subject: 'Acropolis from Philopappos Hill, Athens',
    usage: 'Athens destination hero',
    alt: 'The Acropolis and Parthenon seen from Philopappos Hill, Athens',
  },
  {
    key: 'dest-athens-b',
    file: 'athens-detail.jpg',
    source: 'Wikimedia Commons',
    creator: 'Spyrosdrakopoulos',
    licence: 'CC0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Plaka_district-Athens_22.JPG',
    subject: 'Plaka, Athens',
    usage: 'Athens destination detail',
    alt: 'A quiet lane of neoclassical houses in Plaka, Athens',
  },
  {
    key: 'dest-queenstown',
    file: 'queenstown-hero.jpg',
    source: 'Wikimedia Commons',
    creator: 'Lawrence Murray',
    licence: 'CC BY 2.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Queenstown_from_Bob%27s_Peak.jpg',
    subject: 'Queenstown from Bob’s Peak',
    usage: 'Queenstown destination hero',
    alt: 'Queenstown and Lake Wakatipu at dusk from Bob’s Peak',
  },
  {
    key: 'dest-queenstown-b',
    file: 'queenstown-detail.jpg',
    source: 'Wikimedia Commons',
    creator: 'Krzysztof Golik',
    licence: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lake_Wakatipu_13.jpg',
    subject: 'Lake Wakatipu, Queenstown',
    usage: 'Queenstown destination detail',
    alt: 'Lake Wakatipu and the Remarkables from the Queenstown waterfront',
  },
];

const requested = new Set(process.argv.slice(2));
const selected = requested.size ? IMAGES.filter((image) => requested.has(image.key)) : IMAGES;

await mkdir(OUT, { recursive: true });

for (const image of selected) {
  const sourcePath = path.join(SOURCES, image.file);
  if (!existsSync(sourcePath)) {
    console.warn(`skip ${image.key}: missing ${sourcePath}`);
    continue;
  }

  const input = sharp(sourcePath).rotate().withMetadata({ orientation: 1 });
  const meta = await input.metadata();
  if (!meta.width || meta.width < 1600) {
    throw new Error(`${image.key} is only ${meta.width}px wide; use a larger source`);
  }

  for (const width of WIDTHS) {
    const targetWidth = Math.min(width, meta.width);
    const base = sharp(sourcePath)
      .rotate()
      .resize({ width: targetWidth, withoutEnlargement: true })
      .withMetadata({ orientation: 1 });

    await base
      .clone()
      .webp({ quality: width >= 1600 ? 82 : 78, effort: 5 })
      .toFile(path.join(OUT, `${image.key}-${width}.webp`));
    await base
      .clone()
      .jpeg({ quality: width >= 1600 ? 84 : 80, mozjpeg: true })
      .toFile(path.join(OUT, `${image.key}-${width}.jpg`));
  }

  console.log(`built ${image.key} (${meta.width}×${meta.height})`);
}

if (!requested.size) {
  const attribution = JSON.parse(await readFile(ATTRIBUTION, 'utf8'));
  const byKey = new Map(attribution.images.map((entry) => [entry.key, entry]));
  for (const image of IMAGES) {
    byKey.set(image.key, {
      ...byKey.get(image.key),
      key: image.key,
      source: image.source,
      creator: image.creator,
      sourceUrl: image.sourceUrl,
      subject: image.subject,
      usage: image.usage,
      alt: image.alt,
      license: image.licence,
    });
  }
  attribution.images = [...byKey.values()].sort((a, b) => a.key.localeCompare(b.key));
  attribution.note =
    'Photography licensed via Unsplash, Pexels and Wikimedia Commons. Destinations are depicted editorially; KASANE is not affiliated with any place shown. Every asset is recorded with its creator, licence and source page.';
  await writeFile(ATTRIBUTION, `${JSON.stringify(attribution, null, 2)}\n`);
  console.log(`updated ${path.relative(ROOT, ATTRIBUTION)}`);
}
