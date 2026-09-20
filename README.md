# Dharantej Reddy — Portfolio

Production portfolio for Dharantej Reddy, founder and sole builder/operator of Aphelion, product engineer and AI systems builder.

## Stack

- React
- TypeScript
- Vite
- React Router
- Canvas 2D hero renderer
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

## Hero motion

`src/components/HeroWave.tsx` renders a deterministic right-side dotted wave using Canvas 2D. It:

- draws a visible first frame before pointer input;
- reacts to fine-pointer movement;
- retains a CSS dot-grid fallback;
- caps device pixel ratio;
- reduces density on compact viewports;
- pauses when hidden/offscreen;
- renders a static state for reduced motion;
- cleans up RAF, observers and listeners on unmount.

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
