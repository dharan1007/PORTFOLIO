import assert from "node:assert/strict";
import {
  chapters,
  shots,
  featuredIds,
  storyAt,
  totalPages,
  updateContactSpan,
} from "../src/story.js";
import { existsSync } from "node:fs";
assert.deepEqual(
  shots.filter((s) => s.kind === "project").map((s) => s.id),
  featuredIds,
);
assert.deepEqual(
  [...new Set(shots.map((s) => s.chapter))],
  chapters.map((c) => c[0]),
);
assert.equal(storyAt(-1).index, 0);
assert.equal(storyAt(totalPages + 1).active, shots.length - 1);
let last = -1;
for (let page = 0; page <= totalPages; page += 0.005) {
  const state = storyAt(page);
  assert.ok(Number.isFinite(state.position));
  assert.ok(state.position >= last - 1e-9, "Forward camera continuity");
  assert.ok(state.active >= 0 && state.active < shots.length);
  assert.deepEqual(state, storyAt(page), "Reverse visits return the same pose");
  last = state.position;
}
for (const shot of shots) {
  assert.equal(storyAt(shot.start).index, shot.index);
  if (shot.index)
    assert.ok(
      Math.abs(storyAt(shot.start - 0.000001).position - shot.index) < 0.00001,
      "Portal boundary continuity",
    );
  for (const path of [shot.background, shot.detail, shot.preview].filter(
    Boolean,
  )) {
    assert.ok(
      existsSync(new URL(`../public${path}`, import.meta.url)),
      `Missing story asset ${path}`,
    );
  }
}
console.log(
  `Verified ${shots.length} story shots, featured order, reversible timeline positions, continuous boundaries and all story assets.`,
);

const contactShot = shots.find((s) => s.id === "contact");
const originalSpan = contactShot.span;
const originalStart = shots.at(-1).start;
assert.equal(updateContactSpan(originalSpan + 0.75), true);
assert.ok(Math.abs(shots.at(-1).start - originalStart - 0.75) < 1e-8);
assert.equal(storyAt(shots.at(-1).start).index, shots.length - 1);
assert.equal(updateContactSpan(NaN), false);
updateContactSpan(originalSpan);
console.log(
  "Verified measured Contact height updates the shared timeline without breaking Aphelion navigation.",
);
