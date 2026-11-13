import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
const projects = [
  {
    slug: 'raedius',
    title: 'RÆDIUS | Private Phase 1 Overview',
    description: 'Private Phase 1 social-network prototype focused on contextual identity and audience-aware publishing. Source code remains private.',
    imageAlt: 'Abstract illustration of audience contexts around a central connection.',
    image: 'raedius-social.png',
    width: 1734,
    height: 907,
  },
  {
    slug: 'airadise',
    title: 'Airadise | Private Project Overview',
    description: 'Private local-first Tauri desktop app and TypeScript packages for AI-agent workflows, permissions, and integrations. Source code remains private.',
    imageAlt: 'Abstract illustration of local workflows inside a controlled boundary.',
    image: 'airadise-social.png',
    width: 1734,
    height: 907,
  },
  {
    slug: 'arkhe',
    title: 'ARKHE | Private Research Overview',
    description: 'Private experimental computational-organism runtime. Capability claims remain tied to evidence; source code remains private.',
    imageAlt: 'Abstract branching glass lattice representing experimental runtime research.',
    image: 'arkhe-social.png',
    width: 1737,
    height: 906,
  },
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function replaceOnce(html, pattern, replacement, label) {
  const matches = [...html.matchAll(new RegExp(pattern.source, `${pattern.flags}g`))];
  if (matches.length !== 1) throw new Error(`Expected one ${label}; found ${matches.length}`);
  return html.replace(pattern, replacement);
}

function replaceMeta(html, attribute, name, value) {
  const key = escapeRegExp(name);
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*\\/?\\s*>`, 'i');
  return replaceOnce(html, pattern, `<meta ${attribute}="${name}" content="${escapeAttribute(value)}" />`, `${attribute}=${name}`);
}

for (const project of projects) {
  const canonical = `https://dharantejreddy.vercel.app/projects/${project.slug}`;
  const imageUrl = `https://dharantejreddy.vercel.app/assets/${project.image}`;
  if (!existsSync(resolve(root, 'public', 'assets', project.image))) throw new Error(`Missing social image: ${project.image}`);

  let html = template;
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(project.title)}</title>`, 'title');
  html = replaceMeta(html, 'name', 'description', project.description);
  html = replaceMeta(html, 'property', 'og:title', project.title);
  html = replaceMeta(html, 'property', 'og:description', project.description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'property', 'og:image', imageUrl);
  html = replaceMeta(html, 'property', 'og:image:alt', project.imageAlt);
  html = replaceMeta(html, 'property', 'og:image:width', String(project.width));
  html = replaceMeta(html, 'property', 'og:image:height', String(project.height));
  html = replaceMeta(html, 'name', 'twitter:title', project.title);
  html = replaceMeta(html, 'name', 'twitter:description', project.description);
  html = replaceMeta(html, 'name', 'twitter:image', imageUrl);
  html = replaceOnce(html, /<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}" />`, 'canonical link');

  const output = resolve(dist, 'projects', project.slug, 'index.html');
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, html);
  for (const expected of [canonical, imageUrl, project.description]) {
    if (!html.includes(expected)) throw new Error(`Generated metadata is missing for ${project.slug}`);
  }
}
