import assert from "node:assert/strict";
import { Vector3, Quaternion } from "three";
import {
  projectRoute,
  projectOrientation,
  barHeight,
} from "../src/motion-math.js";
const tiles = Array.from({ length: 42 }, (_, i) => {
  const y = 1 - (2 * i) / 41,
    r = Math.sqrt(1 - y * y),
    a = i * Math.PI * (3 - Math.sqrt(5));
  return [Math.cos(a) * r, y, Math.sin(a) * r];
});
const assign = tiles.map((_, i) => i % 6),
  first = assign.indexOf(0),
  route = projectRoute(tiles, assign, 6, first);
assert.deepEqual(
  route.map((i) => assign[i]),
  [0, 1, 2, 3, 4, 5],
);
for (let i = 0; i < 6; i++) {
  const q = projectOrientation(tiles, route, i);
  const front = new Vector3(...tiles[route[i]]).applyQuaternion(
    new Quaternion(...q),
  );
  assert.ok(front.distanceTo(new Vector3(0, 0, 1)) < 1e-7);
  if (i > 0) {
    const before = projectOrientation(tiles, route, i - 1e-7);
    assert.ok(Math.abs(before.reduce((s, n, k) => s + n * q[k], 0)) > 0.99999);
  }
}
for (let p = 0; p <= 5; p += 0.01) {
  const q = projectOrientation(tiles, route, p);
  assert.ok(Math.abs(Math.hypot(...q) - 1) < 1e-10);
  assert.deepEqual(q, projectOrientation(tiles, route, p));
}
assert.deepEqual(projectOrientation([[0, 0, -1]], [0], 0), [0, 1, 0, 0]);
for (const count of [1, 24, 28])
  for (let i = 0; i < count; i++)
    for (let t = 0; t < 30; t += 0.5) {
      const h = barHeight(i, count, t, 0.18, 0.92);
      assert.ok(h >= 0.18 && h <= 0.92);
    }
console.log(
  "Verified ordered project sphere poses, quaternion continuity and normalization, reverse poses, and Aurora bar bounds.",
);
