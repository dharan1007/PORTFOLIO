import assert from "node:assert/strict";
import {
  experienceArchive as archive,
} from "../src/experience-data.js";
assert.equal(archive.records.length, 2);
const [founder, internship] = archive.records;
assert.equal(founder.organization, "Aphelion Private Limited");
assert.equal(founder.startDate, null);
assert.equal(founder.endDate, null);
assert.deepEqual(
  founder.products.map((product) => product.name),
  ["Maleu", "Axiom / Axiom World"],
);
assert.equal(internship.organization, "Anshap Services Pvt. Ltd.");
assert.equal(internship.role, "React Native Developer Intern");
assert.equal(internship.startDate, "2025-09-22");
assert.equal(internship.endDate, "2025-11-15");
assert.equal(
  internship.duration,
  null,
  "No unsupported three-month duration after certificate date correction",
);
assert.equal(internship.mentor.name, "M. Krishna Kishore");
assert.deepEqual(
  internship.products.map((product) => product.name),
  ["Ansh", "NOA AI chatbot"],
);
assert.equal(archive.architecture.length, 5);
assert.equal(
  new Set(archive.stack.map((group) => group.category)).size,
  archive.stack.length,
);
for (const record of archive.records) {
  assert.ok(
    record.overview && record.responsibilities.length && record.outcomes.length,
  );
  assert.equal(
    JSON.stringify(record).includes("%"),
    false,
    "No fabricated percentage outcome",
  );
}
const { readFileSync } = await import("node:fs");
const html = readFileSync(new URL("../public/experience-valley/index.html", import.meta.url), "utf8");
assert.ok(html.includes("Content-Security-Policy"));
assert.ok(html.includes("window.__GE"));
assert.ok(html.includes("camera-path.glb"));
assert.ok(html.includes("portfolio-experience"));
assert.ok(!/<script[^>]+src=/.test(html));
const component=readFileSync(new URL("../src/ExperienceSection.jsx",import.meta.url),"utf8");
assert.ok(component.includes('sandbox="allow-scripts"'));
assert.ok(!component.includes('allow-same-origin'));
assert.ok(component.includes('touchmove'));
assert.ok(component.includes('clearTimeout(introTimeout)'));
assert.ok(component.includes('visible.current && !document.hidden && !["ready", "error"].includes(sceneStatus.current)'));
assert.ok(!/[\u00c2\u00c3]|\u00e2[\u0080-\u2122]/.test(component), "No mojibake in experience copy");
console.log("Verified factual experience records, certificate-supported dates, original inline valley and sandboxed bridge boundaries.");
