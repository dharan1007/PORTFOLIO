# Portfolio React/Vite Rebuild — Design Specification

Date: 2026-09-20
Status: Direction approved
Selected direction: C — React/Vite rebuild
Repository: dharan1007/PORTFOLIO

## 1. Objective

Rebuild the portfolio as a top-tier founder/engineer portfolio that feels deliberate, fast, technically credible, visually distinctive, and production-reliable.

The result must not be a framework conversion of the current site. It must replace the accumulated static HTML/CSS/JS generations with one coherent application architecture, one design system, one motion system, one typed project content model, and explicit visual/performance/reliability gates.

The site should communicate three things within the first few seconds:

1. Dharantej Reddy is the founder and sole builder/operator of Aphelion.
2. He builds serious products and technical systems rather than isolated demo projects.
3. The most important current work is RÆDIUS, Airadise, ARKHE, Codebase OS, SPOOL, FAULTLINE, followed by LAYA, DAISH, GRELION, Maleu Reel Studio, Nexus and Dot OS.

Zachitan remains a deliberate research highlight rather than being buried in a generic archive.

## 2. Success criteria

The rebuild is not considered release-ready until all of the following are true.

### Visual quality

- The hero has an unmistakable dotted wave matrix only on the right side.
- The matrix must be clearly visible in the first painted hero frame before any pointer movement. A production screenshot at 1440 × 1000 must visibly contain the structured dot field; an empty white right half is a release-blocking failure.
- The matrix has visible ambient movement and clear pointer-reactive deformation without crossing over or reducing readability of the left-side hero copy.
- Every major route must have at least one immediately perceptible but restrained visual/motion layer. A route that appears completely static in rendered inspection fails the visual gate.
- Home, Projects, About, Experience and Contact must all demonstrate visible entrance/scroll/interaction motion without requiring the user to guess whether animation exists.
- Navigation is visually centered and remains stable at all supported viewport widths.
- There are no clipped headings, ellipsis defects, unintended white gaps, overlapping layers, broken cards, empty content containers, or accidental overflow.
- Every section has a clear role in the narrative; no duplicate taxonomy or filler section remains.
- Project imagery is intentional and consistent. Unreliable live-thumbnail scraping is never the only visual source for an important project.
- Desktop, tablet and mobile compositions are designed independently rather than merely collapsed from desktop.

### Runtime reliability

- Core content renders from application data during normal React render and is not left as empty containers awaiting optional enhancement scripts.
- A failed animation, image, analytics request or optional visual module must never hide primary content.
- No production-critical runtime depends on an unsupported CDN global.
- No uncaught JavaScript errors are present on any route in the production verification run.
- Direct navigation and refresh work for every public route.

### Motion quality

- Motion has a defined purpose: hierarchy, continuity, feedback or depth.
- Continuous motion is limited to the hero visual and only where justified.
- Section entrances are restrained and reversible.
- Reduced-motion mode preserves all information and interaction while removing nonessential displacement and continuous animation.
- Scroll behavior remains native-feeling. No smooth-scroll layer may introduce lag, overshoot or input conflict.
- Pointer effects must not interfere with links, selection, browser gestures or touch.

### Performance

Targets are gates, not aspirational notes:

- Lighthouse Performance target: >= 95 desktop and >= 90 mobile on the production URL.
- Lighthouse Accessibility target: >= 95.
- Lighthouse Best Practices target: >= 95.
- Lighthouse SEO target: >= 95.
- Largest Contentful Paint target: <= 2.5 s on the production mobile audit profile.
- Cumulative Layout Shift target: <= 0.1.
- Interaction to Next Paint target: <= 200 ms where measurable.
- Hero animation target: visually stable around 60 FPS on modern desktop hardware and able to degrade density on lower-power devices.
- No unbounded requestAnimationFrame loop when the tab is hidden or the hero is offscreen.

## 3. Technology architecture

### Application

- React
- TypeScript
- Vite
- React Router
- CSS Modules or a single token-driven component stylesheet strategy; no global cascade patch stack
- Local typed content/data modules
- Vitest + Testing Library
- Playwright for route, interaction and visual regression verification

The application remains a static frontend deployed on Vercel. No backend is introduced unless a later feature genuinely requires one.

### Dependency policy

Dependencies must be installed through the package manager and bundled by Vite. Production-critical behavior must not depend on raw CDN globals.

The hero visual may use a bundled rendering library only if it materially improves the result. The preferred implementation is a dedicated React component with an internal Canvas/WebGL renderer and a Canvas 2D fallback. If Three.js is retained, it must be installed and imported as an npm dependency rather than loaded from a remote global script.

GSAP is optional, not mandatory. Motion that can be implemented cleanly with CSS, Web Animations API or a lightweight React motion abstraction should not add a larger dependency merely for convenience.

Lenis and MouseFollower are removed by default. They may return only if measured testing proves they improve the experience without harming native input or performance.

## 4. Information architecture

Public routes:

- /
- /projects
- /projects/:projectId
- /about
- /experience
- /contact

Existing meaningful route URLs must be preserved or redirected to avoid broken external links.

### Home

The homepage becomes a concise founder narrative instead of a project archive.

Sequence:

1. Hero
2. Aphelion founder/company statement
3. Flagship systems
4. Priority systems matrix
5. Zachitan research highlight
6. Selected additional work
7. Experience/contact transition
8. Footer

The existing large “Evidence over theatre” section is reduced to a short trust statement integrated into the projects narrative rather than consuming an entire major section.

The existing separate “Range” taxonomy is removed from the homepage unless it proves necessary after visual validation.

### Projects

The projects page is the complete system catalogue.

It supports:
- explicit priority ordering,
- category filtering,
- clear public/private/research status,
- live/source links only where valid,
- project detail pages,
- consistent visual media,
- no fake production claims.

### About

About focuses on:
- founder identity,
- engineering philosophy,
- how systems are built and verified,
- concise personal context relevant to the work.

### Experience

Experience clearly separates:
- Founder & Sole Builder — Aphelion,
- React Native Developer Intern — Anshap Services Pvt Ltd,
- education,
- selected achievements where still useful.

Anshap is never represented as a repository/project.

## 5. Hero design

The hero is the signature surface.

### Layout

Desktop:
- full viewport minimum height,
- content occupies approximately the left 50–54%,
- dotted wave visual occupies approximately the right 46–50%,
- no visual element is allowed to cross behind the primary name/title enough to reduce legibility.

Tablet:
- text retains left alignment,
- matrix shifts further right and slightly reduces density,
- navigation remains centered without brand/navigation collisions.

Mobile:
- hero remains editorial rather than shrinking desktop proportionally,
- matrix becomes a cropped right-edge visual field,
- no pointer-only interaction is assumed,
- ambient motion is lower density and lower amplitude,
- reduced-motion presents a static field.

### Content hierarchy

Hero metadata:
- Founder / Sole Builder
- Aphelion · Product · AI Systems
- Hyderabad / 2026

Primary name:
- DHARANTEJ REDDY

Primary statement:
- concise founder/engineering positioning,
- no oversized paragraph,
- no duplicate explanation later in the same viewport.

Primary action:
- Explore projects

Secondary action when useful:
- About / experience or Aphelion, but never more than two competing calls to action.

### Dotted wave matrix

The matrix is not random particles.

It is a structured grid with:
- predictable spacing,
- depth variation,
- sinusoidal ambient wave deformation,
- pointer-localized displacement,
- eased pointer tracking,
- bounded amplitude,
- depth-based point sizing/opacity,
- subtle perspective,
- no connecting lines,
- no excessive glow,
- no bloom that makes the white hero muddy.

The visual must remain clearly visible against white. Charcoal/graphite dots provide the base contrast; a very restrained Aphelion lime/cherry accent may be used as a secondary depth cue, never as a dominant wash.

First-frame visibility rules:
- the dot field is rendered immediately on mount and does not wait for pointer movement,
- the resting state must contain enough contrast and density to be unmistakable against the white hero,
- the hero must still show a composed static dot field while reduced motion is enabled,
- a static production screenshot is part of the acceptance test; if the right side reads as plain white, the build fails.

Runtime rules:
- device-pixel-ratio is capped,
- density is reduced on smaller/low-power viewports,
- animation pauses when document visibility is hidden,
- animation pauses or throttles when the hero leaves the viewport,
- pointer tracking is disabled for coarse pointers,
- reduced-motion freezes the field into a composed static state,
- resize logic is deterministic and leak-free,
- component unmount cleans up all observers/listeners/animation frames.

## 6. Visual design system

### Core character

- white/off-white primary surface,
- near-black/graphite type,
- one restrained accent,
- editorial typography with technical microcopy,
- generous spacing,
- crisp rules,
- high-quality media,
- minimal decorative objects,
- no fake dashboard diagrams,
- no placeholder media.

### Tokens

One canonical token layer will define:
- color,
- type scale,
- spacing,
- radius,
- border,
- elevation,
- motion duration,
- easing,
- breakpoints,
- content widths,
- z-index.

No component may redefine global visual primitives ad hoc.

### Navigation

- centered floating modular header,
- active state is obvious but quiet,
- brand does not visually drag the navigation off-center,
- mobile menu uses the same visual system,
- keyboard focus states are first-class,
- header does not jump between routes.

### Cards

Project cards use a small number of repeatable variants:
- flagship,
- priority,
- compact,
- research highlight.

Each variant has a defined image ratio, information hierarchy and interaction behavior.

## 7. Content model

Replace global window.PROJECTS with typed TypeScript data.

Each Project record must explicitly represent:
- id,
- name,
- repo name when applicable,
- visibility,
- category,
- status,
- tagline,
- summary,
- verified evidence statements,
- stack,
- live URL,
- source URL,
- year,
- priority,
- visual asset,
- accent,
- Aphelion/product relationship where relevant.

Project order is data-driven and explicit.

Priority order:

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

Zachitan has a separate research-highlight flag.

## 8. Motion system

Motion is centralized instead of being spread across unrelated scripts.

### Route-wide motion requirement

Motion cannot exist only in code or only in the home hero. The rendered experience must visibly demonstrate motion throughout the site while remaining controlled.

Home:
- continuous right-side dot-wave motion,
- hero copy entrance,
- section reveals,
- project-card hover/parallax,
- header state transition.

Projects:
- animated page-heading entrance,
- filter/category state transitions,
- staggered project-card entrance,
- subtle project-media hover movement,
- route transition into project detail.

Project detail:
- title/metadata entrance,
- media reveal,
- verified-evidence rows entering in reading order,
- next-project transition.

About:
- editorial text reveal,
- restrained background field or moving rule/grid treatment,
- section progression motion.

Experience:
- timeline progression/reveal,
- row hover/focus response,
- restrained background motion treatment.

Contact:
- heading/contact-link entrance,
- interactive link response,
- restrained ambient background treatment.

These route-level effects must remain visible enough to be noticed during normal browsing. They must not become constant decorative noise.

### M1 — hero matrix
Purpose: distinctive depth and pointer feedback.
Continuous: yes, but only while relevant.
Reduced motion: static composed state.

### M2 — hero copy entrance
Purpose: hierarchy.
Trigger: initial route render.
Behavior: short fade/translate with stagger measured in tens of milliseconds, not theatrical long delays.
Reduced motion: opacity only or immediate.

### M3 — section reveal
Purpose: establish reading order.
Trigger: first viewport entry.
Behavior: small y displacement + opacity.
No blur-heavy animation on long paragraphs.

### M4 — project media hover
Purpose: affordance.
Behavior: subtle scale/translation only.
No motion on coarse pointers.

### M5 — route transition
Purpose: continuity.
Behavior: short opacity/position transition.
It must not delay navigation or trap scroll.

### M6 — header state
Purpose: context.
Behavior: active-link state and compact scroll treatment, no bouncing or morphing that changes layout.

All material motion receives:
- trigger,
- start/end state,
- duration,
- easing,
- interruption behavior,
- reduced-motion alternative,
- test coverage where practical.

## 9. Media strategy

Important project media must be controlled assets checked into the project or sourced from stable project-owned URLs.

Third-party screenshot services may be used only as fallback/secondary enrichment.

For priority projects:
- use real screenshots, product visuals, logos, interface crops or carefully generated branded media,
- define desktop and mobile crops,
- include explicit alt text,
- use responsive formats,
- set dimensions/aspect-ratio to prevent layout shift,
- lazy-load below-the-fold media.

No blank browser screenshots, login walls, dark empty captures or low-resolution placeholders are accepted.

## 10. Accessibility

Required:
- semantic landmarks,
- one h1 per route,
- logical heading hierarchy,
- keyboard-operable navigation and cards,
- visible focus rings,
- sufficient text contrast,
- meaningful alt text,
- reduced-motion support,
- no hover-only essential information,
- no pointer-replacement dependency,
- minimum practical touch targets,
- route-change focus behavior,
- skip link,
- accessible menu state,
- no animation that flashes or creates vestibular-heavy motion.

## 11. Error/fallback behavior

Optional visuals fail open.

If hero renderer initialization fails:
- hero text remains fully visible,
- static CSS/Canvas fallback is rendered,
- no blank surface appears.

If project media fails:
- a designed text/brand fallback occupies the same ratio,
- layout does not collapse.

If JavaScript is delayed:
- Vite-delivered application shell still presents a deliberate loading state,
- no large unexplained blank sections.

Missing project data:
- route renders a designed not-found state,
- invalid IDs never throw an uncaught error.

## 12. Test architecture

### Unit/component tests

Cover:
- project ordering,
- Zachitan research highlighting,
- route resolution,
- visibility/source/live-link rules,
- navigation active state,
- reduced-motion hook,
- hero renderer lifecycle cleanup,
- media fallback behavior,
- mobile menu state.

### Playwright functional tests

At minimum:
- homepage loads without console errors,
- hero text and matrix host are visible,
- project links navigate correctly,
- direct /projects/:id loads,
- mobile menu opens/closes,
- no route produces horizontal scrolling,
- external links have correct rel/target behavior,
- reduced-motion disables continuous hero animation,
- resize does not duplicate canvases/listeners.

### Visual regression

Reference viewports:
- 1440 × 1000
- 1280 × 800
- 1024 × 768
- 768 × 1024
- 430 × 932
- 390 × 844

Capture:
- hero default, with the resting dot field visibly present before pointer movement,
- hero with pointer deformation on desktop,
- Home mid-scroll showing visible section-motion state,
- Projects route after card entrance,
- About route showing its ambient/reveal treatment,
- Experience route showing timeline motion state,
- Contact route showing its ambient/interaction treatment,
- Aphelion section,
- flagship systems,
- priority matrix,
- projects index,
- representative project page,
- about,
- experience,
- contact,
- mobile menu.

A release is blocked by unexplained visual diffs.

## 13. Migration strategy

The rebuild should be performed without turning production into a half-migrated hybrid.

1. Establish React/Vite/TypeScript application shell.
2. Port project data into typed modules.
3. Build route shell and navigation.
4. Build canonical tokens/layout primitives.
5. Build hero and matrix renderer with tests.
6. Build Aphelion and flagship sections.
7. Build project components and projects index.
8. Build project detail route.
9. Port About, Experience and Contact.
10. Integrate controlled media assets.
11. Add motion system.
12. Add functional and visual tests.
13. Run local build/test/performance verification.
14. Deploy preview.
15. Run rendered browser and visual regression review on preview.
16. Fix every Critical/High defect and all release-blocking Medium defects.
17. Promote only the verified build to production.
18. Verify the production alias independently.

Legacy files are removed only after parity is established. The final production source must not carry both old and new visual runtimes.

## 14. Release gate

“Vercel deployment READY” is not a completion criterion.

Release requires fresh evidence for:
- npm build exit 0,
- test suite pass,
- Playwright pass,
- visual regression pass or approved intentional diffs,
- production console clean,
- all primary routes HTTP 200,
- hero matrix visibly present in a static first-frame rendered production screenshot,
- hero matrix visible in rendered production,
- pointer response observed on desktop,
- visible motion confirmed on Home, Projects, About, Experience, Contact and representative project-detail pages,
- reduced-motion behavior observed,
- mobile layout observed,
- no horizontal overflow,
- no broken priority-project media,
- Lighthouse targets reviewed,
- final production SHA matches the reviewed build.

No known Critical or High issue may remain at release.

Any Medium issue affecting legibility, navigation, interaction, performance, project truthfulness, or responsive layout is also release-blocking.

## 15. Non-goals

This rebuild does not:
- create a backend,
- turn the portfolio into a CMS,
- add decorative 3D objects unrelated to the work,
- add animation for spectacle,
- fabricate project screenshots,
- expose private source,
- represent Anshap as a personal project,
- claim unsupported production readiness,
- add features that do not improve the hiring/founder/product narrative.

## 16. Design Arc / Superpowers decision record

Objective: top-class, smooth, reliable founder/engineering portfolio with no known release-blocking flaws.

Current-journey findings:
- hero visual dependency failure,
- accumulated visual-system cascade,
- optional animation capable of hiding content,
- client-generated empty content hosts,
- excessive runtime dependency surface,
- inconsistent media quality,
- homepage hierarchy longer than necessary.

Directions considered:
- A: static progressive-enhancement rebuild,
- B: repair current static architecture,
- C: React/Vite rebuild.

Direction Gate: APPROVED — C.

Reason for selection:
The user explicitly chose C and raised the quality requirement to a top-class, smooth, flaw-resistant implementation. A clean component architecture and testable runtime are therefore preferable to continuing incremental patches on the existing accumulated CSS/JS system.

Visual Proposal Gate: not yet passed. It will require implementation renders and validation at the defined viewports.

Authority:
This specification authorizes design/planning of the rebuild. Implementation follows the separate implementation plan and verification workflow.
