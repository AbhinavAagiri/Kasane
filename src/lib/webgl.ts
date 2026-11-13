/**
 * WebGL is optional in KASANE: every enhancement has a photographic or CSS
 * fallback. These probes are deliberately conservative and never throw.
 */

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
};

export const canUseWebGL = () => {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ??
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false });

    if (!gl) return false;

    // Release the probe context immediately; browsers cap live contexts.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
};

/**
 * True for phones, small tablets and low-memory machines, where a full 3D
 * scene should wait for an explicit tap rather than mount on scroll.
 */
export const isConstrainedDevice = () => {
  if (typeof window === 'undefined') return true;

  const nav = navigator as NavigatorWithMemory;
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2;
  const lowCpu = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2;
  const smallTouch =
    window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1024;

  return lowMemory || lowCpu || smallTouch;
};

/** Fine pointer + hover: the only place a magnetic cursor effect makes sense. */
export const hasFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;
