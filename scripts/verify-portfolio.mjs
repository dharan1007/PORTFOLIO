import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../src/project-data.json', import.meta.url), 'utf8'));
const ledger = JSON.parse(readFileSync(new URL('../docs/GENERATION-PROMPTS.json', import.meta.url), 'utf8'));
assert.equal(new Set(data.repositories.map(r => r.name)).size, data.repositories.length, 'Duplicate repository records');
for (const id of ['raedius', 'airadise', 'arkhe', 'dot-os', 'spool', 'faultline']) {
  assert.equal(data.projects.filter(p => p.id === id).length, 1, `Missing or duplicate featured project: ${id}`);
}
for (const project of data.projects) {
  if (project.liveUrl) assert.equal(new URL(project.liveUrl).protocol, 'https:', 'Project links must use HTTPS');
}
assert.equal(ledger.assets.length, 20, 'The selected artwork ledger must contain 20 assets');
for (const asset of ledger.assets) {
  assert.ok(existsSync(new URL(`../${asset.file}`, import.meta.url)), `Missing asset: ${asset.file}`);
}
assert.ok(existsSync(new URL('../public/assets/01-portrait-v2.webp', import.meta.url)), 'Edited portrait missing');
const checkedLinks = JSON.parse(readFileSync(new URL('../docs/LIVE-LINK-CHECK.json', import.meta.url), 'utf8'));
for (const project of data.projects.filter(p => p.liveUrl)) {
  assert.equal(checkedLinks.results.find(([url]) => url === project.liveUrl)?.[1], 200, `Unverified project destination: ${project.id}`);
}
console.log('Portfolio content, all 20 selected artwork files and current project destination records verified.');
