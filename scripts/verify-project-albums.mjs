import assert from "node:assert/strict";
import { albumPose } from "../src/project-album-math.js";

assert.deepEqual(albumPose(0), { x: 0, rotateY: 0, rotateZ: 0, scale: 1, z: 0, dim: 0 });
for (const distance of [0.2, 0.5, 1, 2, 4, 10]) {
  const left = albumPose(-distance), right = albumPose(distance);
  assert.equal(left.x, -right.x);
  assert.equal(left.rotateY, -right.rotateY);
  assert.equal(left.rotateZ, -right.rotateZ);
  assert.equal(left.scale, right.scale);
  assert.equal(left.z, right.z);
  assert.equal(left.dim, right.dim);
  assert.ok(left.scale >= 0.62 && left.scale <= 1);
  assert.ok(Math.abs(left.rotateY) <= 52 && Math.abs(left.rotateZ) <= 9);
  assert.ok(left.dim >= 0 && left.dim <= 0.6);
}
for (let relative = 0; relative < 6; relative += 0.1) {
  const a = albumPose(relative), b = albumPose(relative + 0.1);
  assert.ok(b.x > a.x);
  assert.ok(b.scale <= a.scale && b.z <= a.z && b.dim >= a.dim);
  assert.ok(Math.abs(b.x - a.x) < 7 && Math.abs(b.rotateY - a.rotateY) < 3);
}
console.log("Verified original project-album fan symmetry, active focus, continuous positions and bounded scale/tilt/shading.");
