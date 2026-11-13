import * as THREE from 'three';

export type CountryShape = {
  code: string;
  iso2: string;
  name: string;
  polygons: Array<Array<[number, number]>>;
};

export type GlobeData = {
  countries: CountryShape[];
  landRings: Array<Array<[number, number]>>;
  checked: string;
};

type CountryFile = {
  source: string;
  url: string;
  license: string;
  converted: string;
  countries: CountryShape[];
};

type LandFile = {
  features: Array<{ rings: Array<Array<[number, number]>> }>;
};

let dataPromise: Promise<GlobeData> | null = null;

export const loadGlobeData = () => {
  if (!dataPromise) {
    dataPromise = Promise.all([
      fetch('/map/globe-countries.json').then((response) => {
        if (!response.ok) throw new Error('Country geometry unavailable');
        return response.json() as Promise<CountryFile>;
      }),
      fetch('/map/world-land.json').then((response) => {
        if (!response.ok) throw new Error('Land geometry unavailable');
        return response.json() as Promise<LandFile>;
      }),
    ]).then(([countryFile, landFile]) => ({
      countries: countryFile.countries,
      landRings: landFile.features.flatMap((feature) => feature.rings),
      checked: countryFile.converted,
    }));
  }
  return dataPromise;
};

/** The same projection used by the sphere's UVs. */
export const latLngToVector = (lat: number, lng: number, radius = 1) => {
  const phi = ((lng + 180) * Math.PI) / 180;
  const theta = ((90 - lat) * Math.PI) / 180;
  return new THREE.Vector3(
    -Math.cos(phi) * Math.sin(theta),
    Math.cos(theta),
    Math.sin(phi) * Math.sin(theta),
  ).multiplyScalar(radius);
};

/** yaw + pitch that bring a coordinate to the front of the globe. */
export const focusRotation = (lat: number, lng: number) => ({
  y: -Math.PI / 2 - (lng * Math.PI) / 180,
  x: (lat * Math.PI) / 180,
});

const project = (
  lng: number,
  lat: number,
  width: number,
  height: number,
): [number, number] => [
  ((lng + 180) / 360) * width,
  ((90 - lat) / 180) * height,
];

const ringPath = (
  ctx: CanvasRenderingContext2D,
  ring: Array<[number, number]>,
  width: number,
  height: number,
) => {
  ring.forEach(([lng, lat], index) => {
    const [x, y] = project(lng, lat, width, height);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
};

const drawGraticule = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.strokeStyle = 'rgba(220, 210, 186, 0.08)';
  ctx.lineWidth = Math.max(1, width / 2048);
  for (let lng = -150; lng <= 150; lng += 30) {
    const [x] = project(lng, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const [, y] = project(0, lat, width, height);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
};

const drawLand = (
  ctx: CanvasRenderingContext2D,
  landRings: Array<Array<[number, number]>>,
  width: number,
  height: number,
) => {
  ctx.beginPath();
  landRings.forEach((ring) => ringPath(ctx, ring, width, height));
  ctx.fillStyle = '#dad5c6';
  ctx.fill('evenodd');
  ctx.strokeStyle = 'rgba(84, 91, 76, 0.7)';
  ctx.lineWidth = Math.max(0.7, width / 2200);
  ctx.stroke();
};

const drawCountryBorders = (
  ctx: CanvasRenderingContext2D,
  countries: CountryShape[],
  width: number,
  height: number,
) => {
  ctx.save();
  ctx.strokeStyle = 'rgba(72, 81, 69, 0.42)';
  ctx.lineWidth = Math.max(0.7, width / 2600);
  countries.forEach((country) => {
    country.polygons.forEach((ring) => {
      ctx.beginPath();
      ringPath(ctx, ring, width, height);
      ctx.stroke();
    });
  });
  ctx.restore();
};

const drawTopographicHatching = (
  ctx: CanvasRenderingContext2D,
  landRings: Array<Array<[number, number]>>,
  width: number,
  height: number,
) => {
  ctx.save();
  ctx.beginPath();
  landRings.forEach((ring) => ringPath(ctx, ring, width, height));
  ctx.clip('evenodd');
  ctx.strokeStyle = 'rgba(95, 91, 75, 0.075)';
  ctx.lineWidth = Math.max(0.7, width / 2600);
  for (let index = 0; index < 46; index += 1) {
    const y = (index / 46) * height;
    ctx.beginPath();
    for (let x = -20; x <= width + 20; x += 24) {
      const offset = Math.sin(x / 92 + index * 1.7) * 5 + Math.cos(x / 37 + index) * 1.8;
      if (x < 0) ctx.moveTo(x, y + offset);
      else ctx.lineTo(x, y + offset);
    }
    ctx.stroke();
  }
  ctx.restore();
};

export const makeGlobeTexture = (data: GlobeData, width = 3072) => {
  const height = width / 2;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#0d110d';
  ctx.fillRect(0, 0, width, height);
  drawGraticule(ctx, width, height);
  drawLand(ctx, data.landRings, width, height);
  drawTopographicHatching(ctx, data.landRings, width, height);
  drawCountryBorders(ctx, data.countries, width, height);

  // A restrained paper-grain wash, only on the surface, so the sphere does not
  // read as a flat vector poster when it comes close to the camera.
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  for (let index = 0; index < 2600; index += 1) {
    const x = (index * 73.41) % width;
    const y = (index * 131.77) % height;
    ctx.fillStyle = index % 3 === 0 ? 'rgba(255,255,255,0.045)' : 'rgba(0,0,0,0.045)';
    ctx.fillRect(x, y, 1.4, 1.4);
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
};

export const makeHighlightTexture = (
  data: GlobeData,
  countryCodes: string[],
  width = 2048,
) => {
  if (!countryCodes.length) return null;
  const height = width / 2;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const wanted = new Set(countryCodes);

  ctx.save();
  ctx.lineJoin = 'round';
  data.countries.forEach((country) => {
    if (!wanted.has(country.code)) return;
    country.polygons.forEach((ring) => {
      ctx.beginPath();
      ringPath(ctx, ring, width, height);
      ctx.fillStyle = 'rgba(196, 160, 100, 0.4)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(236, 204, 143, 0.98)';
      ctx.lineWidth = Math.max(1.5, width / 700);
      ctx.stroke();
    });
  });
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

export const makeBoundaryGeometry = (
  data: GlobeData,
  countryCodes: string[] | null,
  radius = 1.003,
) => {
  const wanted = countryCodes ? new Set(countryCodes) : null;
  const positions: number[] = [];
  data.countries.forEach((country) => {
    if (wanted && !wanted.has(country.code)) return;
    country.polygons.forEach((ring) => {
      for (let index = 1; index < ring.length; index += 1) {
        const previous = ring[index - 1];
        const current = ring[index];
        if (!previous || !current) continue;
        const a = latLngToVector(previous[1], previous[0], radius);
        const b = latLngToVector(current[1], current[0], radius);
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    });
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
};

export const iso3ForDestination = (data: GlobeData, iso2: string | undefined) => {
  if (!iso2) return null;
  return (
    data.countries.find((country) => country.iso2 === iso2)?.code ??
    data.countries.find((country) => country.name.toLowerCase().startsWith(iso2.toLowerCase()))
      ?.code ??
    null
  );
};

export const countryCodesForDestinations = (
  data: GlobeData,
  destinations: Array<{ countryCode: string }>,
) =>
  Array.from(
    new Set(
      destinations
        .map((destination) => iso3ForDestination(data, destination.countryCode))
        .filter((code): code is string => Boolean(code)),
    ),
  );
