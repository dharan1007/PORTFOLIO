import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  certificateCollection,
  certificateUrl,
  validCertificates,
  certificateCategories,
} from "../src/certificate-data.js";
import {
  wrap,
  smoothstep,
  shelfOffset,
  tapePose,
  shortestTarget,
} from "../src/certificate-motion.js";

assert.equal(certificateCollection.source, "Google Drive");
assert.equal(certificateCollection.sourceStatus, "retrieved");
assert.equal(certificateCollection.inspectedFileCount, 9);
assert.equal(
  certificateCollection.records.length,
  8,
  "The Flutter JPG/PDF are one credential.",
);
assert.equal(validCertificates(certificateCollection.records).length, 8);
assert.deepEqual(certificateCategories(certificateCollection.records), [
  "Artificial Intelligence",
  "Cybersecurity",
  "Mobile Development",
  "Programming",
  "Professional Development",
]);
for (const record of certificateCollection.records) {
  assert.ok(record.driveFileId && record.driveUrl.includes(record.driveFileId));
  assert.ok(
    /dharan/i.test(record.recipient) && /reddy/i.test(record.recipient),
  );
  for (const file of [
    record.document,
    record.preview,
    record.alternateOriginal,
  ].filter(Boolean)) {
    assert.ok(
      existsSync(new URL(`../public${file}`, import.meta.url)),
      `Missing original/preview ${file}`,
    );
  }
  const bytes = readFileSync(
    new URL(`../public${record.document}`, import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    record.originalSha256,
    `Original bytes must be preserved for ${record.id}`,
  );
  assert.equal(
    record.verificationUrl,
    undefined,
    "No QR was decoded into a verified credential-specific URL.",
  );
}
assert.equal(
  certificateCollection.records.find(
    (record) => record.id === "anshap-internship",
  ).completionDate,
  "15 November 2025",
);
assert.equal(
  certificateCollection.records.find(
    (record) => record.id === "great-learning-python-basic-programs",
  ).completionDate,
  "November 2023",
);
assert.equal(
  certificateCollection.records.find(
    (record) => record.id === "hexart-ai-advance",
  ).credentialId,
  "Hexarta23241836",
);
assert.equal(certificateUrl("javascript:alert(1)"), null);
assert.equal(certificateUrl("data:text/html,unsafe"), null);
assert.equal(certificateUrl("https://user:secret@example.com/cert.pdf"), null);
assert.equal(certificateUrl("/certificates/../../private.pdf"), null);
assert.equal(
  certificateUrl("/certificates/original.pdf"),
  "/certificates/original.pdf",
);
assert.equal(
  certificateUrl("https://drive.google.com/file/d/public-file/view"),
  "https://drive.google.com/file/d/public-file/view",
);
assert.equal(wrap(-1, 8), 7);
assert.equal(wrap(25, 24), 1);
assert.equal(smoothstep(-2), 0);
assert.equal(smoothstep(2), 1);
assert.equal(smoothstep(0.5), 0.5);
const H = 400,
  ws = (H * 142) / 840,
  gap = H * 0.03,
  d = (H * 474) / 900;
const closeTo = (actual, expected, tolerance = 1e-8) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `${actual} != ${expected}`,
  );
const open = tapePose(0, H, ws, gap, d);
assert.deepEqual(open, {
  x: 0,
  y: -10,
  z: 80,
  rotateX: 0,
  rotateY: -90,
  rotateZ: -4.5,
  openness: 1,
  spineShade: 0.55,
  coverShade: 0,
  zIndex: 100,
});
const closed = tapePose(2, H, ws, gap, d);
assert.equal(closed.openness, 0);
assert.equal(closed.z, 0);
assert.equal(closed.coverShade, 0.5);
assert.equal(closed.spineShade, 0);
closeTo(tapePose(2, H, ws, gap, d, 0, 0, 1).y, -18);
closeTo(tapePose(0, H, ws, gap, d, 6, 9).rotateY, -81);
closeTo(tapePose(0, H, ws, gap, d, 6, 9).rotateX, 6);
for (const r of [0.1, 0.5, 0.9, 1, 3, 8]) {
  closeTo(shelfOffset(r, ws, gap, d), -shelfOffset(-r, ws, gap, d));
}
for (const boundary of [-1, 1]) {
  assert.ok(
    Math.abs(
      shelfOffset(boundary + 1e-7, ws, gap, d) -
        shelfOffset(boundary - 1e-7, ws, gap, d),
    ) < 0.001,
    "Neighbours must not jump when a tape finishes turning.",
  );
}
closeTo(shelfOffset(4, ws, gap, d) - shelfOffset(3, ws, gap, d), ws + gap);
for (const current of [-24, -1.4, 0, 7, 15.7, 33]) {
  for (let index = 0; index < 8; index++) {
    const target = shortestTarget(current, index, 8);
    closeTo(wrap(target, 8), index);
    closeTo(target, Math.round(target));
    assert.ok(
      Math.abs(target - current) <= 4 + 1e-8,
      "Category jumps must take the shortest route through the repeating shelf.",
    );
  }
}
assert.equal(shortestTarget(7, 0, 8), 8);
assert.equal(shortestTarget(0, 7, 8), -1);
console.log(
  "Verified 8 document-backed credentials from 9 Drive files, original SHA-256 preservation, available metadata, source dates, safe URLs and continuous repeating VHS shelf geometry.",
);
