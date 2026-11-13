/** Render surface headroom around the square globe stage. */
export const CANVAS_OVERSCAN = 1.3;

const DEGREES = Math.PI / 180;

/**
 * Widen the camera frustum by the overscan factor without moving the camera.
 * The larger drawing buffer plus the wider lens leaves the central stage at
 * exactly the same pixel scale and position while exposing extra scene around
 * it, instead of clipping the globe at the stage edge.
 */
export const overscanFov = (fov: number) => {
  const half = Math.tan((fov * DEGREES) / 2) * CANVAS_OVERSCAN;
  return (2 * Math.atan(half)) / DEGREES;
};
