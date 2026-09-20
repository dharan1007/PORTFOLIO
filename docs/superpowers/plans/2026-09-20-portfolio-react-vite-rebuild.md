# Portfolio React/Vite Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current accumulated static portfolio with a production-grade React/Vite/TypeScript application whose hero visibly renders a right-side cursor-reactive dotted wave on first paint, whose routes have purposeful motion, and whose release is blocked by automated functional, visual, accessibility and performance gates.

**Architecture:** A single Vite SPA renders all content from typed local modules through React Router. Visual primitives live in one token-driven CSS system; page motion uses `motion/react`; the hero is a dedicated Canvas 2D renderer with pure wave math separated from lifecycle code so first-frame visibility, reduced-motion behavior, pausing and cleanup can be tested. Vercel serves the built SPA and rewrites only application routes to `index.html`.

**Tech Stack:** React, TypeScript, Vite, React Router, Motion for React, Canvas 2D, CSS Modules, Vitest, Testing Library, Playwright, @axe-core/playwright, Lighthouse CI.

**Spec:** `docs/superpowers/specs/2026-09-20-portfolio-react-vite-rebuild-design.md`

## Global Constraints

- Core content renders during normal React render; no important section is an empty host waiting for optional JavaScript.
- No production-critical feature loads from a raw CDN global.
- The hero dot field is clearly visible in the first painted frame before pointer movement.
- The hero dot field stays on the right approximately 46–50% of desktop hero width and must not compromise primary-copy legibility.
- Reduced motion preserves all content and shows a static composed dot field.
- Continuous animation is limited to the hero visual; other route motion is finite, purposeful entrance/interaction motion.
- Native scrolling remains the default; Lenis and MouseFollower are not carried into the rebuild.
- Public routes remain `/`, `/projects`, `/projects/:projectId`, `/about`, `/experience`, and `/contact`; old trailing-slash URLs must still resolve.
- Priority order is RÆDIUS, Airadise, ARKHE, Codebase OS, SPOOL, FAULTLINE, LAYA, DAISH, GRELION, Maleu Reel Studio, Nexus, Dot OS.
- Zachitan is a separate research highlight.
- Anshap appears only in Experience, never as a project.
- Important project media must be local or project-owned; third-party screenshot services cannot be the sole visual source for a priority project.
- Release targets: Lighthouse Performance >=95 desktop and >=90 mobile, Accessibility >=95, Best Practices >=95, SEO >=95, LCP <=2.5s, CLS <=0.1, INP <=200ms where measurable.
- Release is blocked by any known Critical/High defect and by any Medium defect affecting legibility, navigation, interaction, performance, project truthfulness or responsive layout.

## Review Focus

- **WebGL/canvas unavailable or renderer throws:** hero copy and a visible static dot fallback must remain present. Pinned in Task 6 component tests and Task 13 browser tests.
- **Coarse pointer / touch viewport:** hero must not wait for pointer input and must not bind hover-only behavior. Pinned in Task 6 and Task 13.
- **Unknown or legacy project URL:** application must render the project when known and a designed not-found state when unknown; direct refresh must work on Vercel. Pinned in Task 3, Task 10 and Task 14.
- **Media request fails:** card/detail layout must keep its aspect ratio and render a deliberate branded fallback. Pinned in Task 9.
- **Repeated resize / route navigation:** hero must not create duplicate canvases, animation loops, observers or event listeners. Pinned in Task 6 and Task 13.

---

## File Structure

The final source tree will be:

```text
PORTFOLIO/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
├── vitest.setup.ts
├── playwright.config.ts
├── lighthouserc.mobile.cjs
├── lighthouserc.desktop.cjs
├── vercel.json
├── public/
│   ├── assets/
│   │   ├── Poduvu_Dharantej_Reddy_Resume.pdf
│   │   └── favicon.svg
│   └── media/
│       └── projects/
├── scripts/
│   └── capture-project-media.ts
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── SiteLayout.tsx
│   │   ├── RouteTransition.tsx
│   │   └── routes.tsx
│   ├── content/
│   │   ├── projects.ts
│   │   ├── profile.ts
│   │   └── experience.ts
│   ├── lib/
│   │   ├── projectOrder.ts
│   │   ├── projectRoutes.ts
│   │   └── media.ts
│   ├── hooks/
│   │   ├── usePrefersReducedMotion.ts
│   │   └── useInViewport.ts
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── SiteNav.tsx
│   │   │   └── SiteNav.module.css
│   │   ├── motion/
│   │   │   ├── Reveal.tsx
│   │   │   └── MotionRule.tsx
│   │   ├── hero/
│   │   │   ├── Hero.tsx
│   │   │   ├── Hero.module.css
│   │   │   ├── HeroWave.tsx
│   │   │   ├── waveMath.ts
│   │   │   └── waveRenderer.ts
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectCard.module.css
│   │   │   ├── ProjectMedia.tsx
│   │   │   └── ProjectGrid.tsx
│   │   └── ambient/
│   │       └── SectionField.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ExperiencePage.tsx
│   │   ├── ContactPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   └── utilities.css
│   └── test/
│       └── render.tsx
└── tests/
    ├── unit/
    │   ├── projects.test.ts
    │   ├── projectRoutes.test.ts
    │   ├── SiteNav.test.tsx
    │   ├── HeroWave.test.tsx
    │   └── ProjectMedia.test.tsx
    ├── e2e/
    │   ├── routes.spec.ts
    │   ├── hero.spec.ts
    │   ├── motion.spec.ts
    │   ├── responsive.spec.ts
    │   └── accessibility.spec.ts
    └── visual/
        └── portfolio.visual.spec.ts
```

Legacy `styles.css`, `site.css`, `script.js`, `site.js`, old route HTML files and old project HTML files remain until Task 14 proves parity, then are deleted in one cleanup commit.

---

### Task 1: Establish the React/Vite testable application shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/test/render.tsx`
- Modify: `index.html`
- Test: `tests/unit/app-shell.test.tsx`

**Interfaces:**
- Consumes: none.
- Produces: `App(): JSX.Element`; global CSS tokens; Vitest/Testing Library environment.

- [ ] **Step 1: Install application and test dependencies**

Run:

```bash
npm install react@latest react-dom@latest react-router-dom@latest motion@latest @fontsource-variable/space-grotesk@latest
npm install -D vite@latest typescript@latest @vitejs/plugin-react@latest vitest@latest jsdom@latest @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest @playwright/test@latest @axe-core/playwright@latest @lhci/cli@latest tsx@latest
```

Expected: `package.json` and `package-lock.json` exist and all commands exit 0.

- [ ] **Step 2: Write the failing shell test**

Create `tests/unit/app-shell.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { App } from "../../src/app/App";

test("renders the portfolio application shell", () => {
  render(<App />);
  expect(screen.getByRole("link", { name: /skip to content/i })).toBeInTheDocument();
  expect(screen.getByRole("main")).toBeInTheDocument();
});
```

- [ ] **Step 3: Run the test and verify RED**

Run:

```bash
npx vitest run tests/unit/app-shell.test.tsx
```

Expected: FAIL because `src/app/App.tsx` does not exist.

- [ ] **Step 4: Add the minimal Vite/React shell**

Create `src/app/App.tsx`:

```tsx
export function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <main id="main" tabIndex={-1}>Portfolio rebuild</main>
    </>
  );
}
```

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    css: true,
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}
```

Create `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "tests", "vite.config.ts", "playwright.config.ts"]
}
```

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import "./styles/tokens.css";
import "./styles/base.css";
import { App } from "./app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
```

Replace `index.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#f8f8f4" />
    <meta name="description" content="Dharantej Reddy — founder, product engineer and AI systems builder." />
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
    <title>Dharantej Reddy — Systems, Products, Infrastructure</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:visual": "playwright test tests/visual",
    "check": "npm test && npm run build"
  }
}
```

- [ ] **Step 5: Run unit test and production build**

Run:

```bash
npm test
npm run build
```

Expected: all tests PASS; build exits 0 and creates `dist/`.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig*.json vite.config.ts vitest.setup.ts index.html src tests/unit/app-shell.test.tsx
git commit -m "build: establish React Vite portfolio shell"
```

---

### Task 2: Port project and profile content into typed modules

**Files:**
- Create: `src/content/projects.ts`
- Create: `src/content/profile.ts`
- Create: `src/content/experience.ts`
- Create: `src/lib/projectOrder.ts`
- Test: `tests/unit/projects.test.ts`

**Interfaces:**
- Produces:
  - `Project` type.
  - `projects: readonly Project[]`.
  - `priorityProjectIds: readonly string[]`.
  - `orderedProjects(input?: readonly Project[]): Project[]`.
  - `researchHighlightProject: Project`.
  - `profile` and `experienceItems`.

- [ ] **Step 1: Write ordering and truthfulness tests**

Create `tests/unit/projects.test.ts`:

```ts
import {
  orderedProjects,
  priorityProjectIds,
  researchHighlightProject,
} from "../../src/lib/projectOrder";
import { projects } from "../../src/content/projects";

test("keeps the approved priority order", () => {
  expect(orderedProjects().slice(0, 12).map((p) => p.id)).toEqual(priorityProjectIds);
});

test("keeps Zachitan as the research highlight", () => {
  expect(researchHighlightProject.id).toBe("zachitan");
});

test("does not classify Anshap as a project", () => {
  expect(projects.some((project) => /anshap/i.test(project.name))).toBe(false);
});

test("never exposes a source link for a private project", () => {
  for (const project of projects.filter((p) => p.visibility.startsWith("Private"))) {
    expect(project.sourceUrl).toBeNull();
  }
});
```

- [ ] **Step 2: Verify RED**

Run:

```bash
npx vitest run tests/unit/projects.test.ts
```

Expected: FAIL because the typed modules do not exist.

- [ ] **Step 3: Implement the typed project model and explicit ordering**

Use this contract in `src/content/projects.ts`:

```ts
export type ProjectVisual =
  | { kind: "image"; src: string; alt: string; position?: string }
  | { kind: "brand"; label: string };

export type Project = {
  id: string;
  name: string;
  repo: string | null;
  visibility: string;
  category: string;
  status: string;
  tagline: string;
  summary: string;
  verified: readonly string[];
  stack: readonly string[];
  liveUrl: string | null;
  sourceUrl: string | null;
  year: string;
  priority: number | null;
  researchHighlight: boolean;
  visual: ProjectVisual;
  accent: string;
  aphelionRelationship: string | null;
};
```

Port every real entry from `project-data.js` into `projects` without inventing new claims. Preserve the approved current DAISH, Nexus, Dot OS, RÆDIUS, Airadise, ARKHE, Codebase OS, SPOOL, FAULTLINE, LAYA, GRELION and Maleu Reel Studio descriptions.

In `src/lib/projectOrder.ts`:

```ts
import { projects, type Project } from "../content/projects";

export const priorityProjectIds = [
  "raedius",
  "airadise",
  "arkhe",
  "codebase-os",
  "spool",
  "faultline",
  "laya",
  "daish",
  "grelon",
  "maleu-reel-studio",
  "nexus",
  "dot-os",
] as const;

export function orderedProjects(input: readonly Project[] = projects): Project[] {
  const rank = new Map(priorityProjectIds.map((id, index) => [id, index]));
  return [...input].sort((a, b) => {
    const ar = rank.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const br = rank.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return ar - br || a.name.localeCompare(b.name);
  });
}

export const researchHighlightProject =
  projects.find((project) => project.id === "zachitan")!;
```

- [ ] **Step 4: Add profile and experience content**

`src/content/profile.ts` must contain the founder positioning and public Aphelion link. `src/content/experience.ts` must contain separate entries for:

```ts
[
  { role: "Founder & Sole Builder", organization: "Aphelion", current: true },
  { role: "React Native Developer Intern", organization: "Anshap Services Pvt Ltd", current: true },
]
```

The Anshap description must describe the AI voice/mental-health product work and must not supply a repository URL.

- [ ] **Step 5: Run tests**

```bash
npx vitest run tests/unit/projects.test.ts
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content src/lib/projectOrder.ts tests/unit/projects.test.ts
git commit -m "feat: port portfolio content to typed modules"
```

---

### Task 3: Build routing, layout and direct-route resolution

**Files:**
- Create: `src/app/routes.tsx`
- Create: `src/app/SiteLayout.tsx`
- Create: `src/app/RouteTransition.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Create: `src/lib/projectRoutes.ts`
- Modify: `src/app/App.tsx`
- Test: `tests/unit/projectRoutes.test.ts`

**Interfaces:**
- Produces:
  - `getProjectById(id: string): Project | null`.
  - BrowserRouter route tree for all approved public routes.
  - `SiteLayout` with shared header/footer and route focus restoration.

- [ ] **Step 1: Write route lookup tests**

```ts
import { getProjectById } from "../../src/lib/projectRoutes";

test("resolves a known legacy project id", () => {
  expect(getProjectById("raedius")?.name).toBe("RÆDIUS");
});

test("returns null for an unknown project id", () => {
  expect(getProjectById("not-a-real-project")).toBeNull();
});
```

- [ ] **Step 2: Verify RED**

```bash
npx vitest run tests/unit/projectRoutes.test.ts
```

Expected: FAIL because `getProjectById` is missing.

- [ ] **Step 3: Implement route lookup**

```ts
import { projects } from "../content/projects";
import type { Project } from "../content/projects";

const byId = new Map(projects.map((project) => [project.id, project]));

export function getProjectById(id: string): Project | null {
  return byId.get(id) ?? null;
}
```

- [ ] **Step 4: Implement route tree**

Use React Router routes for `/`, `/projects`, `/projects/:projectId`, `/about`, `/experience`, `/contact`, and `*`. Create temporary semantic page stubs for routes not yet implemented so every route renders a heading immediately.

`SiteLayout` must:
- render one shared navigation,
- render `<Outlet />`,
- render footer,
- move focus to `#main` on pathname change without scrolling,
- never hide the outlet while motion is unavailable.

- [ ] **Step 5: Run tests and build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app src/pages/NotFoundPage.tsx src/lib/projectRoutes.ts tests/unit/projectRoutes.test.ts
git commit -m "feat: add resilient portfolio routing"
```

---

### Task 4: Establish the single design-token system and centered modular navigation

**Files:**
- Create: `src/components/navigation/SiteNav.tsx`
- Create: `src/components/navigation/SiteNav.module.css`
- Create: `src/styles/utilities.css`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/base.css`
- Modify: `src/app/SiteLayout.tsx`
- Test: `tests/unit/SiteNav.test.tsx`

**Interfaces:**
- Produces: `SiteNav(): JSX.Element`.
- Consumes: current React Router location.

- [ ] **Step 1: Write navigation tests**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteNav } from "../../src/components/navigation/SiteNav";

test("marks the current route and exposes the mobile menu accessibly", () => {
  render(<MemoryRouter initialEntries={["/projects"]}><SiteNav /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("button", { name: /menu/i })).toHaveAttribute("aria-expanded", "false");
});
```

- [ ] **Step 2: Verify RED**

```bash
npx vitest run tests/unit/SiteNav.test.tsx
```

Expected: FAIL because `SiteNav` is missing.

- [ ] **Step 3: Define canonical tokens**

`tokens.css` must define one source for background, panel, ink, muted, accent, rules, spacing, radius, shadow, typography, content widths, nav height, motion timings/easings and z-index. Use:

```css
:root {
  --bg: #f8f8f4;
  --surface: #ffffff;
  --ink: #10110f;
  --muted: #696b64;
  --rule: rgba(16, 17, 15, 0.14);
  --accent: #c8d13a;
  --content: 1680px;
  --pad-inline: clamp(20px, 3vw, 52px);
  --radius-pill: 999px;
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --motion-fast: 180ms;
  --motion-base: 420ms;
  --z-nav: 40;
}
```

- [ ] **Step 4: Implement centered nav**

The outer nav shell is centered with `left: 50%; transform: translateX(-50%)`. The center links are positioned independently of brand width so brand text never drags the links off center. At <=900px, switch to a menu button and full-width inset menu.

- [ ] **Step 5: Run tests and build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/navigation src/styles src/app/SiteLayout.tsx tests/unit/SiteNav.test.tsx
git commit -m "feat: establish design tokens and modular navigation"
```

---

### Task 5: Add centralized reduced-motion and reveal primitives

**Files:**
- Create: `src/hooks/usePrefersReducedMotion.ts`
- Create: `src/hooks/useInViewport.ts`
- Create: `src/components/motion/Reveal.tsx`
- Create: `src/components/motion/MotionRule.tsx`
- Create: `src/app/RouteTransition.tsx`
- Test: `tests/unit/motion.test.tsx`

**Interfaces:**
- Produces:
  - `usePrefersReducedMotion(): boolean`.
  - `Reveal` wrapper with finite opacity/translate entrance and `data-motion-state="entered"` after completion.
  - `MotionRule` finite line/field transition.
  - `RouteTransition` keyed by pathname.

- [ ] **Step 1: Write reduced-motion test**

```tsx
import { render, screen } from "@testing-library/react";
import { Reveal } from "../../src/components/motion/Reveal";

test("keeps reveal content present when reduced motion is requested", () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: () => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    }),
  });

  render(<Reveal><p>Always readable</p></Reveal>);
  expect(screen.getByText("Always readable")).toBeVisible();
});
```

- [ ] **Step 2: Verify RED**

```bash
npx vitest run tests/unit/motion.test.tsx
```

Expected: FAIL because `Reveal` does not exist.

- [ ] **Step 3: Implement finite motion primitives using `motion/react`**

`Reveal` uses `whileInView` once, with 16–24px Y displacement and opacity transition; reduced motion uses opacity-only or immediate rendering. It must never apply `display:none`, visibility hiding, or a persistent zero-opacity initial state when JavaScript motion initialization fails. Set `data-motion-state="entered"` from the animation completion callback; reduced-motion mode sets it on mount so browser tests can verify that visible motion/fallback behavior actually completed.

- [ ] **Step 4: Add route transition**

Use a short keyed route wrapper:

```tsx
<motion.div
  key={pathname}
  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
>
  {children}
</motion.div>
```

- [ ] **Step 5: Run tests**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/hooks src/components/motion src/app/RouteTransition.tsx tests/unit/motion.test.tsx
git commit -m "feat: add accessible portfolio motion primitives"
```

---

### Task 6: Build and verify the first-frame-visible dotted hero wave

**Files:**
- Create: `src/components/hero/waveMath.ts`
- Create: `src/components/hero/waveRenderer.ts`
- Create: `src/components/hero/HeroWave.tsx`
- Create: `src/components/hero/Hero.tsx`
- Create: `src/components/hero/Hero.module.css`
- Test: `tests/unit/HeroWave.test.tsx`
- Test: `tests/unit/waveMath.test.ts`

**Interfaces:**
- Produces:
  - `createGrid(width, height, spacing): WavePoint[]`.
  - `sampleWave(point, time, pointer): WaveSample`.
  - `createWaveRenderer(canvas, options): WaveRenderer` with `start()`, `stop()`, `resize()`, `destroy()`, `renderStatic()`.
  - `HeroWave` canvas component.
- Consumes: `usePrefersReducedMotion`.

- [ ] **Step 1: Write pure-math tests**

```ts
import { createGrid, sampleWave } from "../../src/components/hero/waveMath";

test("creates a structured grid instead of random particles", () => {
  const points = createGrid(400, 300, 40);
  expect(points.length).toBeGreaterThan(40);
  expect(new Set(points.map((p) => p.baseX)).size).toBeGreaterThan(5);
  expect(new Set(points.map((p) => p.baseY)).size).toBeGreaterThan(5);
});

test("has a visible resting wave before pointer input", () => {
  const sample = sampleWave({ baseX: 200, baseY: 100 }, 800, null);
  expect(Math.abs(sample.offsetY)).toBeGreaterThan(0.5);
  expect(sample.alpha).toBeGreaterThanOrEqual(0.32);
});

test("pointer increases local displacement", () => {
  const point = { baseX: 200, baseY: 100 };
  const resting = sampleWave(point, 800, null);
  const active = sampleWave(point, 800, { x: 200, y: 100 });
  expect(Math.abs(active.offsetY)).toBeGreaterThan(Math.abs(resting.offsetY));
});
```

- [ ] **Step 2: Verify RED**

```bash
npx vitest run tests/unit/waveMath.test.ts
```

Expected: FAIL because wave math is missing.

- [ ] **Step 3: Implement deterministic grid/wave math**

Use a regular grid; do not use `Math.random()` for point positions. Compute ambient phase from base coordinates plus time. Use a Gaussian pointer falloff and clamp total displacement. Return point radius and alpha from wave depth so the static first frame is visibly dotted.

- [ ] **Step 4: Write lifecycle/fallback tests**

```tsx
import { render, screen } from "@testing-library/react";
import { HeroWave } from "../../src/components/hero/HeroWave";

test("renders an accessible-hidden canvas plus static fallback", () => {
  render(<HeroWave />);
  expect(screen.getByTestId("hero-wave")).toBeInTheDocument();
  expect(screen.getByTestId("hero-wave-fallback")).toBeInTheDocument();
});

test("keeps the static fallback visible if the canvas renderer cannot initialize", async () => {
  vi.resetModules();
  vi.doMock("../../src/components/hero/waveRenderer", () => ({
    createWaveRenderer: () => { throw new Error("canvas unavailable"); },
  }));
  const { HeroWave: FailingHeroWave } = await import("../../src/components/hero/HeroWave");
  render(<FailingHeroWave />);
  expect(screen.getByTestId("hero-wave-fallback")).toBeVisible();
});

test("does not require pointer support to show the field", () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("(pointer: coarse)"),
      addEventListener() {},
      removeEventListener() {},
    }),
  });
  render(<HeroWave />);
  expect(screen.getByTestId("hero-wave-fallback")).toBeVisible();
});
```

- [ ] **Step 5: Implement renderer lifecycle**

`waveRenderer.ts` must:
- draw once immediately during initialization,
- cap DPR at 1.75,
- use <=26px effective grid spacing on desktop and lower density on compact viewports,
- subscribe to `ResizeObserver`,
- listen to pointer movement only for fine pointers,
- ease the pointer target,
- pause RAF on `visibilitychange` hidden,
- pause RAF when an IntersectionObserver says the hero is not intersecting,
- render exactly one static frame in reduced-motion mode,
- remove every listener/observer and cancel RAF in `destroy()`.

The fallback element must be a visible CSS radial dot grid masked to the right, not an empty element.

- [ ] **Step 6: Style the hero so the right half cannot read as blank**

Use CSS grid with content in the left track and the visual in the right track. The fallback must use graphite dots with minimum visible opacity and no white wash above it. Remove the old multi-layer masking approach.

- [ ] **Step 7: Run tests and build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/hero tests/unit/HeroWave.test.tsx tests/unit/waveMath.test.ts
git commit -m "feat: build resilient dotted hero wave"
```

---

### Task 7: Build the complete homepage narrative and visible route motion

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/HomePage.module.css`
- Create: `src/components/ambient/SectionField.tsx`
- Modify: `src/app/routes.tsx`
- Test: `tests/unit/HomePage.test.tsx`

**Interfaces:**
- Consumes: `Hero`, `Reveal`, project ordering, profile content.
- Produces: complete home route.

- [ ] **Step 1: Write content hierarchy test**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "../../src/pages/HomePage";

test("renders the approved home narrative in order", () => {
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  const headings = screen.getAllByRole("heading").map((node) => node.textContent);
  expect(headings[0]).toMatch(/dharantej reddy/i);
  expect(screen.getByRole("heading", { name: /aphelion/i })).toBeInTheDocument();
  expect(screen.getByText(/zachitan/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify RED**

```bash
npx vitest run tests/unit/HomePage.test.tsx
```

Expected: FAIL because the page is not implemented.

- [ ] **Step 3: Implement sections in the approved sequence**

Render, in order:
1. Hero.
2. Aphelion statement with current public product groups.
3. Three flagship feature cards: RÆDIUS, Airadise, ARKHE.
4. Compact priority matrix for Codebase OS through Dot OS.
5. Zachitan research highlight.
6. Selected additional work.
7. Experience/contact transition.
8. Footer remains in `SiteLayout`.

Do not restore the old full-width “Evidence over theatre” section or the old “Range” taxonomy.

- [ ] **Step 4: Add visible finite motion**

Wrap section titles/cards in `Reveal`; use `SectionField` for a finite rule/grid entrance on non-hero sections. Project card hover motion must apply only for `@media (hover: hover) and (pointer: fine)`.

- [ ] **Step 5: Run tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/pages/HomePage* src/components/ambient src/app/routes.tsx tests/unit/HomePage.test.tsx
git commit -m "feat: rebuild portfolio home narrative"
```

---

### Task 8: Build reusable project cards and the complete Projects index

**Files:**
- Create: `src/components/projects/ProjectCard.tsx`
- Create: `src/components/projects/ProjectCard.module.css`
- Create: `src/components/projects/ProjectGrid.tsx`
- Create: `src/components/projects/ProjectMedia.tsx`
- Create: `src/pages/ProjectsPage.tsx`
- Create: `src/pages/ProjectsPage.module.css`
- Test: `tests/unit/ProjectsPage.test.tsx`

**Interfaces:**
- Produces:
  - `ProjectCard({ project, variant })`.
  - `ProjectGrid({ projects })`.
  - category filter state on Projects page.

- [ ] **Step 1: Write priority/filter tests**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ProjectsPage } from "../../src/pages/ProjectsPage";

test("shows RÆDIUS before Airadise and ARKHE", () => {
  render(<MemoryRouter><ProjectsPage /></MemoryRouter>);
  const cards = screen.getAllByTestId("project-card");
  expect(cards.slice(0, 3).map((card) => card.getAttribute("data-project-id")))
    .toEqual(["raedius", "airadise", "arkhe"]);
});

test("filters without removing the page heading", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><ProjectsPage /></MemoryRouter>);
  await user.click(screen.getByRole("button", { name: /developer infrastructure/i }));
  expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
  expect(screen.getAllByTestId("project-card").length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Verify RED**

```bash
npx vitest run tests/unit/ProjectsPage.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement card variants and filters**

Variants: `flagship | priority | compact | research`. Project name, category, status and tagline are always rendered as text; media is decorative/supporting, never the only source of identity.

Use Motion layout transitions for filter changes; reduced-motion changes filter results immediately without displacement.

- [ ] **Step 4: Run tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/projects src/pages/ProjectsPage* tests/unit/ProjectsPage.test.tsx
git commit -m "feat: build project catalogue and card system"
```

---

### Task 9: Make project media deterministic and failure-safe

**Files:**
- Create: `src/lib/media.ts`
- Create: `scripts/capture-project-media.ts`
- Modify: `src/components/projects/ProjectMedia.tsx`
- Modify: `src/content/projects.ts`
- Test: `tests/unit/ProjectMedia.test.tsx`

**Interfaces:**
- Produces: project-owned/local media mapping and designed brand fallback.

- [ ] **Step 1: Write media failure test**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectMedia } from "../../src/components/projects/ProjectMedia";

test("keeps ratio and shows branded fallback after image failure", () => {
  render(
    <ProjectMedia
      projectId="raedius"
      name="RÆDIUS"
      visual={{ kind: "image", src: "/media/projects/raedius.png", alt: "RÆDIUS product interface" }}
    />,
  );
  fireEvent.error(screen.getByRole("img"));
  expect(screen.getByTestId("project-media-fallback")).toHaveTextContent("RÆDIUS");
});
```

- [ ] **Step 2: Verify RED**

```bash
npx vitest run tests/unit/ProjectMedia.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement stable media fallback**

The wrapper always owns its aspect ratio. On image error, replace the failed image with the project name, category and accent-driven branded surface. Do not display a broken-image icon.

- [ ] **Step 4: Add controlled screenshot capture script**

`scripts/capture-project-media.ts` must import the typed `projects` array directly and use Playwright Chromium, wait for `networkidle`, set a 1440×900 viewport and save screenshots only for project-owned live URLs supplied explicitly by `src/content/projects.ts`. It must never scrape authenticated/private pages. Commit captured images under `public/media/projects/`.

Use it for the public/live priority systems where the rendered page is meaningful; leave private/no-live projects on intentional brand visuals.

- [ ] **Step 5: Run tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/media.ts src/components/projects/ProjectMedia.tsx src/content/projects.ts scripts public/media tests/unit/ProjectMedia.test.tsx
git commit -m "feat: make project media controlled and failure-safe"
```

---

### Task 10: Build project detail pages and designed unknown-project handling

**Files:**
- Create: `src/pages/ProjectDetailPage.tsx`
- Create: `src/pages/ProjectDetailPage.module.css`
- Modify: `src/pages/NotFoundPage.tsx`
- Test: `tests/unit/ProjectDetailPage.test.tsx`

**Interfaces:**
- Consumes: `getProjectById`, project card/media components.
- Produces: full `/projects/:projectId` page.

- [ ] **Step 1: Write known/unknown route tests**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProjectDetailPage } from "../../src/pages/ProjectDetailPage";

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/projects/:projectId" element={<ProjectDetailPage />} /></Routes>
    </MemoryRouter>,
  );
}

test("renders project evidence for a known id", () => {
  renderRoute("/projects/raedius");
  expect(screen.getByRole("heading", { level: 1, name: "RÆDIUS" })).toBeVisible();
  expect(screen.getByText(/verified/i)).toBeVisible();
});

test("renders a designed not-found state for an unknown id", () => {
  renderRoute("/projects/not-real");
  expect(screen.getByRole("heading", { name: /project not found/i })).toBeVisible();
});
```

- [ ] **Step 2: Verify RED**

Run the file-specific Vitest command and confirm expected failures.

- [ ] **Step 3: Implement detail structure**

Sections:
- title/meta,
- project visual,
- summary,
- verified evidence list,
- stack,
- live/source actions only when present,
- next project.

Animate title/meta, media and evidence rows in reading order with finite `Reveal` transitions.

- [ ] **Step 4: Run tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ProjectDetailPage* src/pages/NotFoundPage.tsx tests/unit/ProjectDetailPage.test.tsx
git commit -m "feat: add project detail route"
```

---

### Task 11: Build About, Experience and Contact with route-specific motion

**Files:**
- Create: `src/pages/AboutPage.tsx`
- Create: `src/pages/ExperiencePage.tsx`
- Create: `src/pages/ContactPage.tsx`
- Create: `src/pages/EditorialPage.module.css`
- Test: `tests/unit/secondary-pages.test.tsx`

**Interfaces:**
- Consumes: profile/experience data, `Reveal`, `MotionRule`, `SectionField`.
- Produces: complete secondary routes.

- [ ] **Step 1: Write semantic/truthfulness tests**

```tsx
test("experience separates Aphelion founder work from Anshap internship", () => {
  render(<MemoryRouter><ExperiencePage /></MemoryRouter>);
  expect(screen.getByText("Founder & Sole Builder")).toBeVisible();
  expect(screen.getByText("React Native Developer Intern")).toBeVisible();
  expect(screen.getAllByText(/Anshap Services/i)).toHaveLength(1);
});

test("contact exposes real links as keyboard-operable anchors", () => {
  render(<MemoryRouter><ContactPage /></MemoryRouter>);
  expect(screen.getAllByRole("link").length).toBeGreaterThan(1);
});
```

- [ ] **Step 2: Verify RED**

Run `npx vitest run tests/unit/secondary-pages.test.tsx`.

- [ ] **Step 3: Implement route-specific motion**

About: editorial text reveals plus finite `MotionRule`/grid entrance.
Experience: timeline line grows once when entering viewport; rows reveal in sequence and respond on hover/focus.
Contact: heading and links reveal; links use finite arrow/underline motion.
No continuous RAF loop is used on these routes.

- [ ] **Step 4: Run tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AboutPage.tsx src/pages/ExperiencePage.tsx src/pages/ContactPage.tsx src/pages/EditorialPage.module.css tests/unit/secondary-pages.test.tsx
git commit -m "feat: rebuild about experience and contact routes"
```

---

### Task 12: Preserve résumé/favicon assets and configure the SPA for Vercel

**Files:**
- Move: `assets/Poduvu_Dharantej_Reddy_Resume.pdf` -> `public/assets/Poduvu_Dharantej_Reddy_Resume.pdf`
- Move: `assets/favicon.svg` -> `public/assets/favicon.svg`
- Create: `vercel.json`
- Modify: `index.html`
- Test: `tests/e2e/routes.spec.ts`

**Interfaces:**
- Produces: stable assets and direct-refresh routing.

- [ ] **Step 1: Add route-refresh E2E test**

```ts
import { test, expect } from "@playwright/test";

for (const path of ["/", "/projects", "/projects/raedius", "/about", "/experience", "/contact"]) {
  test(`direct refresh works for ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
  });
}
```

- [ ] **Step 2: Add Vercel route rewrites**

Create `vercel.json`:

```json
{
  "cleanUrls": true,
  "rewrites": [
    { "source": "/projects/:path*", "destination": "/index.html" },
    { "source": "/about/:path*", "destination": "/index.html" },
    { "source": "/experience/:path*", "destination": "/index.html" },
    { "source": "/contact/:path*", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 3: Move stable assets and update references**

Use `git mv` for the résumé and favicon. Update `index.html` favicon to `/assets/favicon.svg`; update resume links to `/assets/Poduvu_Dharantej_Reddy_Resume.pdf`.

- [ ] **Step 4: Start preview and run route tests**

```bash
npm run build
npm run preview -- --host 127.0.0.1 &
npx playwright test tests/e2e/routes.spec.ts
```

Expected: every listed route passes against the preview server configured in Playwright.

- [ ] **Step 5: Commit**

```bash
git add vercel.json index.html public assets tests/e2e/routes.spec.ts
git commit -m "ops: preserve assets and configure SPA routing"
```

---

### Task 13: Add browser, responsive, motion, accessibility and visual-regression gates

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/hero.spec.ts`
- Create: `tests/e2e/motion.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/visual/portfolio.visual.spec.ts`

**Interfaces:**
- Produces: release-blocking browser proof.

- [ ] **Step 1: Configure Playwright web server**

Configure Playwright to run `npm run dev -- --host 127.0.0.1` on a fixed local port, capture traces/screenshots on failure, and define desktop + mobile projects.

- [ ] **Step 2: Add hero first-frame and lifecycle tests**

```ts
test("hero dot field exists on first frame before pointer movement", async ({ page }) => {
  await page.goto("/");
  const wave = page.getByTestId("hero-wave");
  await expect(wave).toBeVisible();
  const box = await wave.boundingBox();
  expect(box?.width).toBeGreaterThan(300);
  expect(await page.locator("canvas[data-hero-wave-canvas]").count()).toBe(1);
});

test("repeated resize never duplicates the hero canvas", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setViewportSize({ width: 1024, height: 768 });
  expect(await page.locator("canvas[data-hero-wave-canvas]").count()).toBe(1);
});
```

Add a test that emulates reduced motion and asserts the dot field remains visible while continuous animation state is disabled.

- [ ] **Step 3: Add route-motion assertions**

Home, Projects, About, Experience, Contact and one project-detail route must each expose a `data-motion-state="entered"` marker after the associated finite reveal completes. Assert those states after normal navigation.

- [ ] **Step 4: Add responsive overflow assertions**

For 1440×1000, 1280×800, 1024×768, 768×1024, 430×932 and 390×844:
- navigate through all primary routes,
- assert `document.documentElement.scrollWidth <= document.documentElement.clientWidth`,
- assert nav/heading/main content are visible.

- [ ] **Step 5: Add accessibility scan**

Use `AxeBuilder` and fail on serious/critical violations for all primary routes.

- [ ] **Step 6: Generate and inspect the first complete visual proposal**

Run the visual suite once with snapshot updates to create candidate baselines:

```bash
npx playwright test tests/visual --update-snapshots
```

Inspect every generated image at the required viewport, compare it against the approved design specification, and classify mismatches as match, repairable drift, direction decision required, or runtime proof. Do not freeze a baseline merely because Playwright generated it.

This is the Design Arc Visual Proposal Gate. Present the inspected renders and verdict to the user. Implementation may continue to release verification only after the user approves the visual proposal; repairable drift is corrected before asking.

- [ ] **Step 7: Re-run approved visual snapshots without update mode**

Capture:
- desktop hero resting state,
- desktop hero after pointer deformation,
- home mid-scroll,
- projects index,
- project detail,
- About,
- Experience,
- Contact,
- mobile menu,
at the six required viewports.

For stable snapshots, emulate reduced motion for non-pointer snapshots; the reduced-motion hero must still visibly contain the static dot field.

- [ ] **Step 8: Run the complete browser suite**

```bash
npx playwright install chromium
npm run build
npm run test:e2e
npm run test:visual
```

Expected: all functional tests and the user-approved visual baselines PASS with no unexplained diff.

- [ ] **Step 8: Commit**

```bash
git add playwright.config.ts tests/e2e tests/visual
git commit -m "test: add portfolio browser and visual gates"
```

---

### Task 14: Add performance budgets, remove the legacy runtime, and prove the clean build

**Files:**
- Create: `lighthouserc.mobile.cjs`
- Create: `lighthouserc.desktop.cjs`
- Modify: `package.json`
- Delete after parity proof:
  - `styles.css`
  - `site.css`
  - `script.js`
  - `site.js`
  - `project-data.js`
  - `about/index.html`
  - `contact/index.html`
  - `experience/index.html`
  - `projects/index.html`
  - every `projects/*/index.html`
- Modify: `README.md`

**Interfaces:**
- Produces: one runtime, one design system, performance gate.

- [ ] **Step 1: Add Lighthouse CI budgets**

Configure `lighthouserc.mobile.cjs` with mobile emulation and assertions:
- performance >=0.90,
- accessibility >=0.95,
- best-practices >=0.95,
- seo >=0.95,
- CLS <=0.1,
- LCP <=2500ms.

Configure `lighthouserc.desktop.cjs` with `preset: "desktop"` and assertions:
- performance >=0.95,
- accessibility >=0.95,
- best-practices >=0.95,
- seo >=0.95,
- CLS <=0.1.

Add these scripts:

```json
{
  "scripts": {
    "test:lighthouse:mobile": "lhci autorun --config=./lighthouserc.mobile.cjs",
    "test:lighthouse:desktop": "lhci autorun --config=./lighthouserc.desktop.cjs",
    "test:lighthouse": "npm run test:lighthouse:mobile && npm run test:lighthouse:desktop",
    "verify": "npm test && npm run build && npm run test:e2e && npm run test:visual && npm run test:lighthouse"
  }
}
```

Record INP from the production/browser run when the audit environment exposes it; do not fabricate an INP value when the lab run cannot measure it.

- [ ] **Step 2: Run parity verification before deleting legacy files**

```bash
npm run verify
```

Expected: all gates PASS.

- [ ] **Step 3: Delete the legacy runtime only after Step 2 passes**

Remove the old CSS/JS/data and route HTML files listed above. Do not delete `docs/` or controlled public assets.

- [ ] **Step 4: Re-run the complete verification after deletion**

```bash
npm run verify
git grep -nE "three@|cdn.jsdelivr|unpkg.com|site\.js|site\.css|project-data\.js|image\.thum\.io" -- ':!docs/**'
```

Expected:
- verification PASS,
- grep returns no production-runtime references to the old CDN/runtime/screenshot stack.

- [ ] **Step 5: Rewrite README to match the React/Vite architecture**

Document install, local run, tests, visual baselines, project data location, asset policy and Vercel deployment. Remove obsolete statements that the site has no build tool/framework.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: retire legacy portfolio runtime"
```

---

### Task 15: Preview deployment, rendered QA, production promotion and final proof

**Files:** no product-code file is required unless QA finds a defect; any defect fix must follow its own RED -> GREEN test cycle before this task continues.

**Interfaces:**
- Consumes: final build from Tasks 1–14.
- Produces: verified production release.

- [ ] **Step 1: Run fresh local verification**

```bash
npm ci
npm run verify
```

Expected: zero test/build/visual/Lighthouse failures.

- [ ] **Step 2: Deploy the reviewed commit to a Vercel preview**

Record:
- Git SHA,
- preview deployment ID,
- preview URL.

Do not promote yet.

- [ ] **Step 3: Inspect the rendered preview in a real browser**

At minimum inspect:
- 1440×1000 desktop hero before pointer movement,
- pointer deformation,
- 1024×768,
- 430×932,
- all primary routes,
- one project detail,
- reduced-motion mode.

The desktop first-frame screenshot must unmistakably show the right-side dot matrix. A blank white right half fails this step.

- [ ] **Step 4: Check preview runtime**

Verify:
- no uncaught console errors,
- no 404 for application assets,
- direct refresh works for every route,
- no horizontal overflow,
- no broken priority media,
- Home, Projects, About, Experience, Contact and project detail each show their intended motion,
- mobile menu and keyboard focus are usable.

- [ ] **Step 5: Fix any release-blocking finding test-first**

For every defect:
1. write/extend a unit, browser or visual regression that reproduces it,
2. run and observe RED,
3. implement the smallest root-cause fix,
4. run and observe GREEN,
5. run `npm run verify`,
6. commit the fix.

No visual defect may be waived merely because deployment is READY.

- [ ] **Step 6: Promote only the exact reviewed SHA**

Promote the preview/reviewed commit to production. Record production deployment ID and alias.

- [ ] **Step 7: Repeat browser verification on the production alias**

Re-run first-frame hero, pointer, mobile, route, console, media and reduced-motion checks against production rather than assuming preview parity.

- [ ] **Step 8: Confirm SHA parity**

The production deployment metadata must point to the same Git SHA that passed Step 1 and preview review.

- [ ] **Step 9: Final release record**

Report:
- production SHA,
- production URL,
- test counts,
- Playwright result,
- visual-regression result,
- Lighthouse scores,
- hero first-frame proof status,
- route-motion proof status,
- remaining non-release-blocking observations, if any.

Do not use “perfect,” “complete,” or “production-ready” unless every release gate above has current evidence.

