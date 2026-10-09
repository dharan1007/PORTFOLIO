# Dharantej Reddy — Portfolio

Production portfolio for Dharantej Reddy, founder and sole builder/operator of Aphelion, product engineer and AI systems builder.

## Stack

- React
- TypeScript
- Vite
- React Router
- Cinematic knockout hero with responsive editorial typography and codec-safe visual fallback
- CSS motion with reduced-motion fallbacks
- Vitest
- Vercel

The site is a static frontend. Core content is rendered from typed local data and does not depend on a CMS or backend.

## Routes

- `/`
- `/projects`
- `/projects/:projectId`
- `/about`
- `/experience`
- `/contact`

Vercel rewrites direct route requests to the SPA entry point.

## Project data

The authoritative project catalogue is `src/data/projects.ts`. It contains explicit status, visibility, stack, live/source links, evidence statements and priority ordering. Private repositories never expose source URLs.

Current priority order:

1. RÆDIUS
2. Airadise
3. ARKHE
4. Codebase OS
5. SPOOL
6. FAULTLINE
7. LAYA
8. DAISH
9. GRELION
10. Maleu Reel Studio
11. Nexus
12. Dot OS

Zachitan is represented separately as the research highlight.

## Hero design

The homepage features an original procedural Canvas 2D kinetic sculpture behind knockout typography. It has no third-party film, remote asset or video codec dependency. A visibility-aware renderer pauses offscreen and under reduced motion. The direction-sensitive header hides on downward scroll and returns on upward scroll, route changes, keyboard focus and when the mobile menu is open.

The catalogue is curated into six explicit, exhaustive categories with a feature project and supporting case-study links for each. Home sections connect through a sticky four-stage scroll narrative. About, Experience, Contact, and detailed case-study layouts use distinct structures while existing evidence, stack records and links remain accessible.


## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run test
npm run typecheck
npm run build
npm run verify-build
```

`verify-build` is the Vercel build command, so a deployment cannot become READY unless unit tests, TypeScript and the production Vite build all succeed.

## Content boundaries

- Aphelion is presented as the company, not a repository/project.
- Anshap Services Pvt Ltd appears only under Experience as internship work.
- Project claims are intentionally bounded to what the portfolio data documents.
- No raw CDN global is required for production-critical motion.

## Design specification

See `docs/superpowers/specs/2026-09-20-portfolio-react-vite-rebuild-design.md`.

## Implementation plan

See `docs/superpowers/plans/2026-09-20-portfolio-react-vite-rebuild.md`.

## Licensed media and genuine previews

`src/data/media.ts` holds the source-of-truth catalogue of Pexels photography and Mixkit Free License videos, with creator and source-page credits. `EditorialImage` and `EditorialVideo` lazy-load source media with reliable photographic fallback and reduced-motion/data-saver behavior. Actual live-project screenshots remain separate in `ProjectPreview` and are requested from public `liveUrl` pages. For private projects, photography is expressly marked as illustration and not as a screenshot or proof of functionality. Media credits appear on the About page.

## Creator-style homepage (2026 refresh)
The homepage now uses React + TypeScript, Framer Motion, Lucide React, Tailwind CSS 3 utilities, and the Kanit type family. The five editorial stages are Hero, live-project marquee, animated About, five-service light chapter, and sticky-stacked flagship work. The reference's fictional name, sample client work, portrait, and unrelated third-party motion-site GIFs are intentionally not shown as Dharantej's projects. The 32 real portfolio entries remain grouped on `/projects`, with their linked case studies and status/evidence data unchanged. The existing adaptive navigation is preserved on all non-home routes. Motion uses reduced-motion and lazy/paused video behavior.
