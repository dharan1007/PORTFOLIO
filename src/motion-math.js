const dot = (a, b) => a.reduce((s, n, i) => s + n * b[i], 0);
const normalize = (a) => {
  const length = Math.hypot(...a) || 1;
  return a.map((n) => n / length);
};
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export function projectRoute(tiles, assign, itemCount, first) {
  const route = [first];
  for (let item = 1; item < itemCount; item++) {
    let chosen = -1,
      best = -Infinity;
    tiles.forEach((tile, i) => {
      if (assign[i] !== item) return;
      const score = dot(tiles[route[item - 1]], tile);
      if (score > best) {
        best = score;
        chosen = i;
      }
    });
    route.push(chosen < 0 ? first : chosen);
  }
  return route;
}
export function projectOrientation(tiles, route, position) {
  if (!route.length) return [0, 0, 0, 1];
  const value = clamp(position, 0, route.length - 1),
    lo = Math.floor(value),
    hi = Math.min(lo + 1, route.length - 1),
    f = value - lo;
  const pose = (index) => {
    const [x, y, z] = tiles[route[index]];
    const angle = Math.acos(clamp(z, -1, 1));
    const axis = normalize([y, -x, 0]);
    if (Math.hypot(x, y) < 1e-8) return z < 0 ? [0, 1, 0, 0] : [0, 0, 0, 1];
    const sine = Math.sin(angle / 2);
    return [...axis.map((n) => n * sine), Math.cos(angle / 2)];
  };
  const a = pose(lo),
    b = pose(hi),
    sign = dot(a, b) < 0 ? -1 : 1;
  return normalize(a.map((n, i) => n * (1 - f) + b[i] * sign * f));
}
export function barHeight(index, total, time, minH, maxH) {
  const norm = total > 1 ? index / (total - 1) : 0.5;
  const arch = Math.sin(norm * Math.PI);
  const wave =
    0.5 +
    0.25 * Math.sin(time * 1.1 + (index / total) * Math.PI * 2) +
    0.25 * Math.sin(time * 0.7 + (index / total) * Math.PI * 5.3);
  return minH + (arch * 0.65 + wave * 0.35) * (maxH - minH);
}
