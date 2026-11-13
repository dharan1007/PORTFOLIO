import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { shots, updateSectionSpan, totalPages, storyAt } from "../src/story.js";
for (const id of ["about", "experience", "education", "certifications"]) {
  const shot = shots.find((s) => s.id === id),
    span = shot.span,
    after = shots[shot.index + 1],
    start = after.start;
  assert.equal(updateSectionSpan(id, span + 0.625), true);
  assert.ok(Math.abs(after.start - start - 0.625) < 1e-8);
  assert.equal(storyAt(after.start).index, after.index);
  assert.equal(updateSectionSpan(id, span + 0.625), false);
  updateSectionSpan(id, span);
}
assert.equal(updateSectionSpan("unknown", 1), false);
assert.equal(updateSectionSpan("education", NaN), false);
assert.equal(updateSectionSpan("education", 0), false);
const hero = readFileSync(new URL("../public/hero/index.html",import.meta.url),"utf8");
const wrapper = readFileSync(new URL("../src/SignalHero.jsx",import.meta.url),"utf8");
for(const identity of ["PODUVU","DHARANTEJ","REDDY"])assert.ok(hero.toUpperCase().includes(identity));
assert.equal((hero.match(/<style(?:\s[^>]*)?>/g)||[]).length,1);
assert.equal((hero.match(/<script(?:\s[^>]*)?>/g)||[]).length,1);
assert.ok(!/<script[^>]+src=/.test(hero));
assert.ok(hero.includes("data:font/ttf;base64,"));
assert.ok(wrapper.includes("DitherVeil"));
assert.ok(wrapper.includes('sandbox="allow-scripts"'));
assert.ok(wrapper.includes('event.source !== frame.current?.contentWindow'));
for(const destination of ['"about"','"projects"','"experience"','"contact"'])assert.ok(wrapper.includes(destination));
const effects = readFileSync(
  new URL("../src/SceneEffects.jsx", import.meta.url),
  "utf8",
);
assert.ok(
  effects.includes(
    "hf_20261029_081741_aaca74ff-1aeb-473f-9b47-87ff3d9ca170.mp4",
  ),
);
const app = readFileSync(
  new URL("../src/CinematicApp.jsx", import.meta.url),
  "utf8",
);
assert.ok(!app.includes("Reduce motion"));
assert.ok(!app.includes("Close index"));
assert.ok(app.includes("sidebar-edge-control"));
console.log(
  "Verified native section height reflow, single-file poster boundaries, identity, exact project film and icon-only navigation.",
);
