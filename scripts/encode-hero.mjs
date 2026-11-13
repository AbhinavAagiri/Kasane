#!/usr/bin/env node
/**
 * Rebuild the KASANE hero film from the original high-resolution Pexels
 * masters in tmp/v2/hero-src. Presentation masters are 1080p H.264; mobile
 * cuts are 720p. Posters are taken from the same master frame so the still
 * and the film agree.
 *
 * Usage: node scripts/encode-hero.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'tmp/v2/hero-src');
const OUT = path.join(ROOT, 'public/media/hero');
mkdirSync(OUT, { recursive: true });

const clips = [
  { id: 'kyoto', source: 'kyoto.mp4', start: 0.5, seconds: 12 },
  // The original rajasthan.mp4 turned out to be a Jaisalmer aerial. This
  // alternate master is the verified Jal Mahal/Jaipur clip used by the chapter.
  { id: 'rajasthan', source: 'rajasthan-alt.mp4', start: 0.2, seconds: 9.2 },
  { id: 'italy', source: 'italy.mp4', start: 3, seconds: 12 },
  { id: 'iceland', source: 'iceland.mp4', start: 5, seconds: 12 },
  { id: 'switzerland', source: 'switzerland.mp4', start: 12, seconds: 12 },
  { id: 'seoul', source: 'seoul-night.mp4', start: 4, seconds: 12 },
];

const run = (args) => execFileSync(ffmpeg.path, args, { stdio: 'inherit' });

for (const clip of clips) {
  const input = path.join(SRC, clip.source);
  const base = path.join(OUT, clip.id);
  console.log(`\n→ ${clip.id} from ${clip.source} @ ${clip.start}s`);

  run([
    '-hide_banner', '-loglevel', 'warning', '-y',
    '-ss', String(clip.start), '-t', String(clip.seconds), '-i', input,
    '-an', '-vf', 'scale=1920:1080:flags=lanczos,fps=30',
    '-c:v', 'libx264', '-profile:v', 'high', '-level:v', '4.1', '-preset', 'medium',
    '-crf', '26', '-maxrate', '4M', '-bufsize', '8M', '-g', '60',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    `${base}.mp4`,
  ]);

  run([
    '-hide_banner', '-loglevel', 'warning', '-y',
    '-ss', String(clip.start), '-t', String(clip.seconds), '-i', input,
    '-an', '-vf', 'scale=1280:720:flags=lanczos,fps=30',
    '-c:v', 'libx264', '-profile:v', 'high', '-level:v', '4.0', '-preset', 'medium',
    '-crf', '26', '-maxrate', '2200k', '-bufsize', '4400k', '-g', '60',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    `${base}-mobile.mp4`,
  ]);

  run([
    '-hide_banner', '-loglevel', 'warning', '-y',
    '-ss', String(clip.start + 2), '-i', input,
    '-frames:v', '1', '-vf', 'scale=1920:1080:flags=lanczos',
    '-q:v', '2', `${base}-poster.jpg`,
  ]);

  // Posters are only shown while a film is loading or when motion is
  // reduced, so a 1280px WebP is ample and much lighter than the old JPEG.
  await sharp(`${base}-poster.jpg`)
    .resize({ width: 1280, height: 720, fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(`${base}-poster.webp`);
}

console.log('\nHero masters rebuilt: 1080p desktop / 720p mobile.');
