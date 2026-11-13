export function wrap(value, count) {
  return ((value % count) + count) % count;
}

export function smoothstep(value) {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
}

export function shelfOffset(r, ws, gap, d) {
  const spread =
    Math.abs(r) < 1
      ? (r + Math.sin(Math.PI * r) / Math.PI) / 2
      : Math.sign(r) / 2;
  return r * (ws + gap) + (d - ws + 1.6 * gap) * spread;
}

export function tapePose(r, H, ws, gap, d, tiltX = 0, tiltY = 0, lift = 0) {
  const openness = smoothstep(1 - Math.abs(r));
  return {
    x: shelfOffset(r, ws, gap, d),
    y: -openness * 0.025 * H - lift * 0.045 * H,
    z: openness * 0.2 * H,
    rotateX: tiltX * openness,
    rotateY: (-90 + tiltY) * openness,
    rotateZ: -4.5 * openness,
    openness,
    spineShade: openness * 0.55,
    coverShade: (1 - openness) * 0.5,
    zIndex: Math.round(100 - Math.abs(r) * 4),
  };
}

export function shortestTarget(current, index, count) {
  return Math.round(
    current + wrap(index - current + count / 2, count) - count / 2,
  );
}
