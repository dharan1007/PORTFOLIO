import assert from "node:assert/strict";
import { education, educationCaseAt, fitEducationFrame } from "../src/education-data.js";

assert.equal(
  education.institution,
  "Chaitanya Bharathi Institute of Technology",
);
assert.equal(education.degreeShort, "B.Tech");
assert.equal(education.status, "Graduated");
assert.equal(education.graduation, 2026);
assert.equal(education.cgpa, 7.5);
assert.equal(education.cgpaScale, 10);
assert.equal(education.approximate, true);
assert.deepEqual(
  education.achievements.map(({ title, recognition, year }) => [
    title,
    recognition,
    year,
  ]),
  [
    ["Aurora University Hackathon", "Winner", 2024],
    ["Smart India Hackathon", "Finalist", 2023],
    ["BITS AI Hackathon", "Finalist", 2023],
  ],
);
const subjects = education.disciplines.flatMap((group) => group.subjects);
assert.equal(subjects.length, 11);
assert.equal(new Set(subjects).size, 11);
assert.ok(subjects.includes("Data Structures and Algorithms"));
assert.ok(subjects.includes("Cloud Infrastructure"));
assert.ok(!("semesterGrades" in education));
assert.ok(!("startYear" in education));
assert.deepEqual([-.1, 0, .2, .4, .62, .85, 1, 2].map(educationCaseAt), [0, 0, 0, 1, 2, 3, 3, 3]);
for (const [width, height] of [[1440, 810], [1212, 822], [1024, 768], [820, 700], [375, 734], [320, 620], [1920, 1002]]) {
  for (const mode of [false, true]) {
    const pose = fitEducationFrame(width, height, mode);
    assert.ok(pose.scale > 0);
    for (const number of Object.values(pose)) assert.ok(Number.isFinite(number));
    assert.ok(pose.wordmarkWidth > 0);
    if (!mode && width <= 820) {
      assert.ok(Math.abs(pose.x + 805 * pose.scale - width / 2) < 1e-8, "Mobile photographic subject stays centered");
      assert.ok(Math.abs(pose.y + 790 * pose.scale - height) < 1e-8, "Mobile photographic subject stays bottom anchored");
    }
    if (mode && width > 820) {
      assert.ok(pose.x + 272.8 * pose.scale >= -1, "Desktop academic screen left edge stays in view");
      assert.ok(pose.x + (272.8 + 894.4) * pose.scale <= width + 1, "Desktop academic screen right edge stays in view");
      assert.ok(pose.y + 102.7 * pose.scale >= -1, "Desktop academic screen top edge stays in view");
      assert.ok(pose.y + (102.7 + 604.7) * pose.scale <= height + 1, "Desktop academic screen bottom edge stays in view");
    }
  }
}
console.log(
  "Verified owner-supplied Education facts, approximate ten-point CGPA, 11 disciplines and three exact hackathon records; no invented dates or grades.",
);
