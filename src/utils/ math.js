// utils/math.js

/** Smoothstep within a [start, end] range */
export function smoothstepRange(t, start, end) {
    const x = Math.min(Math.max((t - start) / (end - start), 0), 1);
    return x * x * (3 - 2 * x);
  }
  