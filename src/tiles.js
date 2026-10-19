/* ============================================================================
   IMAGE TILES — SVG data-URI art for the React-Bits sections (reel menu,
   dome gallery, lanyard card). Self-contained: no network images needed.
   ========================================================================== */

const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "'Courier New', Courier, monospace";

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const uri = (svg) => `data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;

/* 512×512 tile: diagonal cherry-family gradient, frame, dtr mark, big word. */
export function tile(word, hue = 8) {
  const h = ((Math.round(hue) % 360) + 360) % 360;
  const label = esc(String(word ?? '').toLowerCase() || 'dtr');
  const size = Math.round(Math.min(104, 980 / Math.max(4, label.length) + 26));
  return uri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="hsl(${h},74%,48%)"/>
          <stop offset="1" stop-color="hsl(${(h + 22) % 360},64%,24%)"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#g)"/>
      <rect x="22" y="22" width="468" height="468" fill="none" stroke="rgba(244,238,228,0.32)" stroke-width="2"/>
      <text x="48" y="76" font-family="${MONO}" font-size="24" letter-spacing="7" fill="rgba(244,238,228,0.85)">dtr</text>
      <circle cx="452" cy="60" r="7" fill="#F4EEE4"/>
      <text x="256" y="292" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="${size}" fill="#F4EEE4">${label}</text>
    </svg>`);
}

/* Lanyard card front — cream stock, cherry monogram, name plate. */
export function cardFront(site) {
  const name = esc(site.name);
  const role = esc(site.role);
  return uri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850">
      <rect width="600" height="850" fill="#F4EEE4"/>
      <rect x="26" y="26" width="548" height="798" fill="none" stroke="rgba(23,19,15,0.18)" stroke-width="2"/>
      <text x="60" y="112" font-family="${MONO}" font-size="26" letter-spacing="9" fill="#17130F">PORTFOLIO — 2026</text>
      <text x="300" y="430" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="200" fill="#D21A2E">${esc(site.initials)}</text>
      <line x1="180" y1="510" x2="420" y2="510" stroke="#D21A2E" stroke-width="3"/>
      <text x="300" y="588" text-anchor="middle" font-family="${SERIF}" font-size="52" letter-spacing="4" fill="#17130F">${name}</text>
      <text x="300" y="640" text-anchor="middle" font-family="${MONO}" font-size="24" letter-spacing="5" fill="rgba(23,19,15,0.62)">${role}</text>
      <rect x="26" y="758" width="548" height="66" fill="#D21A2E"/>
      <text x="300" y="800" text-anchor="middle" font-family="${MONO}" font-size="24" letter-spacing="8" fill="#F4EEE4">CREATIVE FRONT-END</text>
    </svg>`);
}

/* Lanyard card back — cherry stock, contact lines in cream. */
export function cardBack(site) {
  const email = esc(site.footer?.email ?? '');
  const note = esc(site.footer?.lines?.slice(0, 2).join(' ') ?? 'Open to opportunities');
  return uri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850">
      <rect width="600" height="850" fill="#D21A2E"/>
      <rect x="26" y="26" width="548" height="798" fill="none" stroke="rgba(244,238,228,0.4)" stroke-width="2"/>
      <text x="300" y="240" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="120" fill="#F4EEE4">${esc(site.initials)}</text>
      <line x1="200" y1="310" x2="400" y2="310" stroke="#F4EEE4" stroke-width="3"/>
      <text x="300" y="420" text-anchor="middle" font-family="${SERIF}" font-size="40" fill="#F4EEE4">${email}</text>
      <text x="300" y="500" text-anchor="middle" font-family="${MONO}" font-size="24" letter-spacing="4" fill="rgba(244,238,228,0.85)">${note}</text>
      <text x="300" y="760" text-anchor="middle" font-family="${MONO}" font-size="22" letter-spacing="8" fill="rgba(244,238,228,0.7)">SAY HELLO ↗</text>
    </svg>`);
}
