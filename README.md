# Dharantej Reddy — Portfolio

A single-page creative-developer portfolio in an **off-white + cherry red**
editorial style, built with **React + Vite** and a set of **React-Bits-style
components** across all four of their categories (Text Animations, Animations,
Components, Backgrounds). The hero is a **crystal-clear glass 3D "dtr"
monogram** (Three.js, transmission material) with a soft gradient backdrop and
mouse parallax.

Flow: loader → 3D glass monogram hero → manifesto → count-up stats → scroll-pinned
journey → toolkit decks → projects → **visual diary (3D dome gallery)** →
**the reel (infinite 3D menu)** → **take one (physics ID card + tearable ticket)**
→ curved "what's next" line over **gradient waves** → reveal footer,
with a side scroll-nav and header that hides on scroll-down.

## Run it

```
npm install
npm run dev        # → http://localhost:4322
npm run build      # production build to dist/
```

## Change your details

Everything personal lives in **`src/content.js`** — name, role, manifesto,
stats, journey sentences, toolkit skills, projects, gallery/reel/collect copy,
the "what's next" line, and footer contact links. Edit that one file; the
dev server hot-reloads.

- **Colors / type / layout** — `src/index.css` (the `:root` palette:
  `--cream` off-white, `--cherry` red; `--accent` in `content.js` also drives
  the 3D monogram).
- **Sections** — `src/App.jsx`.
- **3D monogram** — `src/Monogram.jsx` (change the letters via `initials` in
  `content.js`).
- **Small React-Bits-style components** — `src/bits.jsx`.
- **Full React-Bits components** — `src/reactbits/` (see below).
- **Placeholder imagery** — `src/tiles.js` generates the gallery tiles and the
  ID-card faces as inline SVG (cherry-family gradients + typographic labels),
  so the site works with zero image assets.

## React-Bits components used (all four categories)

- **Text Animations:** `SplitText`, `BlurText`, `ShinyText`, `CountUp`, `DecryptedText`
- **Animations:** `AnimatedContent`, `FadeContent`
- **Components:** `StarBorder`, `Sparkles`, `Spotlight`
- **Backgrounds:** `Aurora`, `ParticleField`

## Full React-Bits components (src/reactbits/)

Five full components were integrated verbatim (JSX + CSS pairs), themed to the
site palette:

- **`DomeGallery`** — 3D spherical photo dome; drag to orbit, click a tile to
  enlarge (Esc / click to close). Used in the ink **"Visual diary"** section.
  Tiles come from `src/tiles.js` (`gallery` entry in `content.js`).
- **`InfiniteMenu`** — infinite draggable 3D menu sphere with hover info panel.
  Used in the cream **"The reel"** section (`theme="light"`, cherry accent,
  autoplay 3s).
- **`Lanyard`** — physics lanyard swinging an ID card; drag the card and it
  flips/flutters. Used in **"Take one"** with a generated cream card face.
- **`TearTicket`** — physics tearable ticket; pull the stub until the paper
  fibres snap, then the caption becomes a `mailto:` link. Also in **"Take one"**.
- **`GradientWaves`** — WebGL gradient-wave background; layered behind the
  curved "what's next" text (`.next__waves`, pointer-events off).

They need the `motion` and `@use-gesture/react` packages (installed). Four
WebGL contexts are used in total (monogram, menu, lanyard, waves); each pauses
rendering when scrolled out of view.

## Notes

- The 3D monogram loads a bold typeface (from the three.js CDN) and extrudes +
  bevels it into clear glass (transmission material); a faint HTML "dtr" sits
  behind the canvas as a fallback.
- Respects `prefers-reduced-motion` everywhere — the tearable ticket tears
  instantly with a longer pull, and the dome/menu skip idle animation; the
  loader uses a timer (not rAF) so it completes even in a backgrounded tab.
- Three.js + Google Fonts load from CDN, so an internet connection is needed.

> Built from scratch as an original design. For personal use.
