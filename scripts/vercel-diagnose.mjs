import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const stages = [
  ['test', ['run', 'test']],
  ['typecheck', ['run', 'typecheck']],
  ['build', ['run', 'build']]
];

let report = '';
let failed = false;

for (const [name, args] of stages) {
  const result = spawnSync('npm', args, { encoding: 'utf8', shell: false });
  report += '\n===== ' + name.toUpperCase() + ' =====\n';
  report += result.stdout || '';
  report += result.stderr || '';
  report += '\nEXIT=' + String(result.status) + '\n';
  if (result.status !== 0) {
    failed = true;
    break;
  }
}

mkdirSync('dist', { recursive: true });
writeFileSync('dist/build-log.txt', report);
if (failed) {
  writeFileSync('dist/index.html', '<!doctype html><title>Branch diagnostic</title><pre>Build diagnostic captured at /build-log.txt</pre>');
}
process.exit(0);
