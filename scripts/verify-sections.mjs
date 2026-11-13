import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const html = readFileSync(
  new URL("../public/aphelion/index.html", import.meta.url),
  "utf8",
);
const lines = [...html.matchAll(/class="line"><span>([^<]+)<\/span>/g)].map(
  (m) => m[1],
);
assert.equal(lines.length, 2);
assert.ok(lines.every((s) => s.length === 24));
assert.equal((html.match(/<style>/g) || []).length, 1);
assert.equal((html.match(/<script>/g) || []).length, 1);
assert.ok(!/<script[^>]+src=/.test(html));
assert.ok(
  html.includes("hf_20260908_125738_eb584080-9f98-489e-adb2-014760aa34da.mp4"),
);
assert.ok(
  html.includes("hf_20260908_122011_59c97465-4d23-4fdc-ac40-f6832f573e28.png"),
);
assert.ok(
  html.includes("RÆDIUS") &&
    html.includes("Airadise") &&
    html.includes("ARKHE") &&
    html.includes("Dot OS"),
);
const config = JSON.parse(
  readFileSync(new URL("../components.json", import.meta.url), "utf8"),
);
for (const name of ["@reactbits-starter", "@reactbits-pro"]) {
  assert.ok(
    config.registries[name].url.startsWith("https://pro.reactbits.dev/api/r/"),
  );
  assert.ok(
    config.registries[name].headers.Authorization.includes(
      "${REACTBITS_LICENSE_KEY}",
    ),
  );
}
assert.ok(existsSync(new URL("../src/ContactSection.tsx", import.meta.url)));
const contact = readFileSync(
  new URL("../src/ContactSection.tsx", import.meta.url),
  "utf8",
);
for (const real of [
  "dharan.poduvu@gmail.com",
  "8639961561",
  "dharan1007",
  "dharantej-reddy1727185",
])
  assert.ok(contact.includes(real));
console.log(
  "Verified standalone Aphelion structure, exact media references, two 24-character lines, real contacts and environment-only registry configuration.",
);
