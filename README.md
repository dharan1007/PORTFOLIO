# Dharantej Reddy — Portfolio

Production portfolio for **Poduvu Dharantej Reddy**, deployed on Vercel.

Live site: https://portfolio-bice-one-9v5zwjmlcb.vercel.app/

## Architecture

This is a dependency-light, multi-page static portfolio. It deliberately avoids a framework/build step so the site remains fast, portable and easy to audit.

```text
/
├── index.html
├── site.css
├── site.js
├── project-data.js
├── about/index.html
├── experience/index.html
├── contact/index.html
├── projects/index.html
├── projects/<project-id>/index.html
├── assets/
│   ├── Poduvu_Dharantej_Reddy_Resume.pdf
│   └── favicon.svg
├── 404.html
├── robots.txt
└── sitemap.xml
```

## Project coverage

The project index contains all **33 non-portfolio repositories** currently present in the authenticated GitHub account. Each has its own URL under `/projects/<id>/`.

Project descriptions are intentionally evidence-bound:

- public/live work links to the real public surface;
- public repositories can use GitHub Open Graph preview media;
- live systems use browser screenshots from Thum.io rather than hand-coded mockup art;
- private repositories are not presented as publicly accessible source;
- scaffolds and under-documented repositories are labeled as such rather than given invented capabilities.

## UI and motion

The site uses external, production-oriented interaction libraries rather than raw canvas/SVG placeholder effects:

- **Lenis** for smooth scrolling while preserving native document flow;
- **GSAP + ScrollTrigger** for reveal/parallax motion;
- **Mouse Follower** for the desktop fine-pointer cursor effect.

No project card uses sticky pinning. The only fixed page element is the global navigation/progress UI.

The site respects `prefers-reduced-motion`.

## Media

Project visuals come from real external project surfaces:

- Thum.io screenshot rendering for deployed systems;
- GitHub Open Graph images for public repositories.

There are no generated inline SVG project mockups, canvas grain renderers, or fake product-media placeholders in the active site.

## Main files

- `project-data.js` — authoritative portfolio presentation data for the 33 project case pages.
- `site.js` — navigation, project rendering, filters, motion initialization and detail-page hydration.
- `site.css` — responsive design system shared by every page.
- `projects/*/index.html` — crawlable, independently addressable project case pages.

## Local development

No install is required.

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Deployment

Vercel deploys `main` as a static site. There is no build command or server runtime.

## Verification performed for the 2026-09 rebuild

- production Vercel deployment reached `READY`;
- root, Projects, About, Experience and Contact routes returned HTTP 200;
- all 33 individual project routes returned HTTP 200;
- `site.js` and `project-data.js` passed JavaScript syntax compilation;
- a browser smoke test verified normal top-to-bottom scrolling, working navigation, project case navigation and no pinned content blocking interaction.

## Public information

Only information intended for the public portfolio should be added here or in `project-data.js`. Keep private-repository source URLs and secrets out of the site.
