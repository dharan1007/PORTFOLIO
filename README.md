# Poduvu Dharantej Reddy — Portfolio

A static personal portfolio website built with plain HTML, CSS, and JavaScript.

The site presents profile information, skills, projects, achievements, certifications, a downloadable résumé, and contact information through a black-and-white visual system with animated interactions. It has no framework, build tool, package manager, backend, or database requirement.

## Repository structure

```text
PORTFOLIO/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── Poduvu_Dharantej_Reddy_Resume.pdf
│   ├── favicon.svg
│   ├── hero-texture.jpg
│   ├── proj-biz-bw.jpg
│   ├── proj-boof-bw.jpg
│   ├── proj-dooki-bw.jpg
│   ├── proj-driving-bw.jpg
│   ├── proj-event-bw.jpg
│   ├── proj-fuy-bw.jpg
│   ├── proj-stenius-bw.jpg
│   └── proj-swud-bw.jpg
└── README.md
```

The repository's actual application source is only three files: `index.html`, `styles.css`, and `script.js`. The remaining files are static image/PDF assets.

## Technology

- HTML5
- CSS3
- vanilla JavaScript
- Canvas 2D API
- Intersection Observer API
- Google Fonts

No JavaScript framework or external runtime library is required.

## Page structure

`index.html` defines these major sections:

- Home
- About
- Skills
- Projects
- Achievements
- Certifications
- Resume
- Contact

The navigation anchors directly to those section IDs.

## Design system

`styles.css` implements a dark monochrome theme using CSS custom properties:

```css
--bg
--surface
--border
--text
--muted
--accent
--radius
--transition
```

The page uses:

- a deep-black base background
- a fixed texture image with dark overlay
- white/gray typography
- sticky translucent navigation
- large Anton/Georgia/Space Grotesk typography
- responsive project grids
- grayscale project imagery that reveals color on hover
- responsive/mobile navigation states

## JavaScript behavior

`script.js` owns all interactive behavior.

### Dynamic footer year

The copyright year is populated at runtime from the current date.

### Active navigation tracking

The script watches scroll position and marks the link corresponding to the currently visible section as active.

### Canvas grain effect

A fullscreen `<canvas id="grain">` creates randomized grayscale pixel noise continuously with `requestAnimationFrame` to produce the site's grain texture.

Because this redraws a full viewport image buffer every frame, it can be computationally expensive on large/high-DPI displays. If performance becomes a concern, replace it with a lower-resolution/offscreen texture or a CSS/static-noise asset.

### Dynamic project rendering

Projects are defined as JavaScript objects and injected into `#projectGrid`.

The current real/project-specific entries include:

- Fuy
- Stenius
- Dooki
- Swud
- Boof
- Driver Safety
- BizDev Challenge
- Event Outreach

The file also contains explicit placeholder/dummy entries such as:

- Project Alpha
- Project Beta
- Project Delta
- Project Epsilon
- Project Zeta
- Project Omega

These placeholder cards should be removed or replaced before the portfolio is treated as an authoritative list of completed work.

Project cards become keyboard-accessible links when a URL is defined and support both click and Enter/Space activation.

### Scroll reveal

Intersection Observer applies reveal classes to project cards and other animated elements as they enter the viewport.

### Hero parallax

The large hero text is translated vertically based on scroll position to create a lightweight parallax effect.

### Typing animation

The subtitle content is cleared and re-rendered character-by-character on page load.

### Button ripple

Buttons receive a generated DOM ripple element at click coordinates.

### Scroll progress

A fixed three-pixel progress indicator is created dynamically and updated as the document scrolls.

### Back-to-top button

A fixed button is created from JavaScript and shown after the user scrolls beyond 400 pixels.

### Mobile menu

The hamburger button toggles the navigation list and closes it automatically after a navigation item is selected.

### Resume download fallback

The main resume link uses normal browser download behavior. Holding `Shift` while clicking triggers an alternative fetch/blob download path intended for testing or browser environments that intercept PDFs.

## Run locally

Because the site is static, the simplest option is to open `index.html` directly in a browser.

For behavior closer to production hosting, use a local HTTP server.

### Python

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Node.js

Any static-file server works, for example:

```bash
npx serve .
```

## Deployment

This repository can be deployed to any static-hosting provider, including:

- GitHub Pages
- Vercel static hosting
- Netlify
- Cloudflare Pages
- any conventional web server/CDN

There is no build step unless a deployment provider adds one.

## Content maintenance

### Update personal/profile content

Edit the relevant section in `index.html`.

### Add or update a project

Edit the `projects` array in `script.js`:

```js
{
  title: "Project name",
  subtitle: "Short description",
  img: "assets/project-image.jpg",
  url: "https://example.com",
  bullets: [
    "Result or capability",
    "Technology or implementation detail"
  ]
}
```

Add the corresponding image below `assets/`.

### Replace résumé

Replace:

```text
assets/Poduvu_Dharantej_Reddy_Resume.pdf
```

If the filename changes, update both the `href` and `download` attributes in `index.html`.

## Accessibility notes

Current positive behaviors include:

- semantic section IDs/navigation
- keyboard activation for linked project cards
- visible contact links
- responsive navigation
- resume link labeling

Areas worth improving:

- the continuously animated canvas should respect `prefers-reduced-motion`;
- dynamically created buttons should receive explicit accessible labels;
- color/contrast should be retested after any design changes;
- placeholder project content should not be presented as real work;
- all image alt text should be reviewed for meaningful context.

## Performance notes

The page is dependency-light, but the canvas grain generator can dominate CPU usage because it creates and writes a viewport-sized image every animation frame. The site should be profiled on mobile and low-power devices if that visual effect is retained.

Project images should also be compressed appropriately because all media is served as static assets.

## Privacy and public information

The source page contains personal contact/profile information intended for public portfolio display. Review that information before deployment and remove anything that should not remain publicly indexed.

## License

No root license was present before this README was added. Unless a license is added explicitly, do not assume the source/assets are licensed for third-party reuse.