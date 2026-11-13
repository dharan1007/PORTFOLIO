# First cinematic portfolio implementation (historical)

**Superseded by the owner-directed 12 November revision documented in [REACT-BITS-INTEGRATION.md](REACT-BITS-INTEGRATION.md).** The geometric scenes below describe the previous iteration.

The first build replaces the previous static card composition. The active entry is `src/App.jsx` → `CinematicApp.jsx`; the former static implementation and standalone orbital component are not part of the runtime.

## Research before implementation

The reference was observed with browser scrolling and inspected with REA against its public shipped JavaScript. `REFERENCE-MOTION-AUDIT.md` records the evidence IDs, scope, source modules, timeline, effect families and asset inventory. Confirmed libraries: Astro 6.4.8, Three.js r187, Anime.js 4.5.0, Lenis 1.3.26. The original uses custom scene and compositing code; there is no single plugin that recreates the whole experience.

The existing React project is retained. Three.js 0.187.0, Anime.js 4.5.0 and Lenis 1.3.26 match the inspected reference. The new renderer uses a WebGL compatibility path with original scene/shader code. It does not redistribute the original models, scans or proprietary authored shader source.

## Placement and story

| Order | Scene | Scroll-driven behavior | Content / artwork |
|---|---|---|---|
| 1 | About | Camera dolly, layered arches, pointer parallax, portrait tile dissolve on exit | Edited owner portrait; original daylight gallery art |
| 2–7 | Featured projects | Approach/pullback, camera rotation and vertical movement among offscreen-rendered portals, independent image tilt | RÆDIUS → Airadise → ARKHE → Dot OS → SPOOL → FAULTLINE; real website captures, descriptions, stack pills, verified links |
| 8 | Experience | Moving corridor frames and camera travel | Anshap Services internship and Aphelion founder work from the owner's existing public portfolio |
| 9 | Education | Camera passes actual 3D book/shelf geometry | CBIT Hyderabad, AI & Data Science B.Tech, 2022–2026 |
| 10 | Certifications | Floating paper geometry and layered archive art | Professional-profile verification link; no invented certification titles |
| 11 | Contact | Correspondence environment, independent floating geometry | Owner-confirmed email, phone, LinkedIn and GitHub |
| 12 | Aphelion | Continuously rotating 3D orbital assembly | Company purpose and four products; official company link |

Twenty-three-point-six viewport heights define twelve shots across the seven requested chapters. Native document scrolling remains the input; Lenis smooths wheel motion. `story.js` is the single timeline source for navigation and renderer. Camera poses are deterministic when scrolling forward or backward. Captions fade out during travel and enter with Anime.js. The fixed canvas composites nearby scene render targets into portal planes and then applies an original subtle film pass: curvature, animated horizontal distortion, RGB displacement, grain and scanline modulation. Pointer input eases exponentially into camera and image parallax.

## Content and assets

Twenty selected generated assets plus one portrait alternate were saved before implementation. Phone/watch removal and a higher-buttoned shirt were requested by the owner. Original source photographs remain unchanged. Conceptual project sculptures are retained in the asset ledger but have been replaced by genuine project screenshots in the main showcase.

Public website captures exist for RÆDIUS, ARKHE, Dot OS, SPOOL and FAULTLINE. Airadise's standalone website returned 503; its clearly labeled panel instead shows the genuine Aphelion product page. See `AIRADISE-PREVIEW.md` for evidence. Captures preserve the source applications' real colors; portfolio surfaces and type use white, burgundy, pale blue, sage, peach and navy.

Sources: owner-confirmed contact/section requirements; dharan1007/PORTFOLIO `src/data/projects.ts` (SHA 801c1945675aa9848b0d10218e11b82a93fcf67d) and `src/App.tsx`; current flagship repository READMEs; access-scoped GitHub repository inventory; Vercel alias records; current public Aphelion products page. The archive includes the remaining catalogued projects and repository names, with private repositories labeled and no inaccessible source links. The inventory covers 28 accessible repositories; it does not establish the account's complete private repository count.

`LIVE-LINK-CHECK.json` records HTTP GET checks. Stanius returned 404, so its broken website link was removed and the archive discloses the unavailable deployment. The other eleven currently presented website destinations returned 200. Nexus's Aphelion destination is labeled Company site.

## Resilience and validation

The 3D bundle loads dynamically. Pixel ratio and render-target width are capped; distant portals release render-target storage; hidden-tab rendering pauses; scene cleanup disposes GPU resources. A WebGL initialization or context failure switches to a complete reading view. Asset failures produce a styled notice with a reading-view action. OS reduced-motion preference opens that reading view, and the visitor can explicitly enable cinematic mode. Choices persist locally. The archive uses a native modal dialog with keyboard focus containment and Escape dismissal. Mobile keeps the scene and captions, with horizontally scrollable chapter navigation.

Content/asset assertions, camera continuity/order/reverse assertions, production build, dependency audit and production browser scenarios are recorded in `CINEMATIC-VALIDATION.md`. A production build's deferred graphics chunk is approximately 550 kB / 139 kB gzip and produces Vite's size advisory. This is not a demonstrated phone GPU/frame-rate qualification. No external deployment was performed.
