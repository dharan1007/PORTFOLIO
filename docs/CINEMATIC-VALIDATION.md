# Initial cinematic validation — 11 November 2026

Current 12 November component integration and verification are documented in [REACT-BITS-INTEGRATION.md](REACT-BITS-INTEGRATION.md). The original reconstruction checks below are retained as history.

## Checks completed

| Check | Result / evidence |
|---|---|
| Production compilation | Vite 8.3.8 build passed; React entry approximately 219.8 kB / 73.2 kB gzip, deferred renderer approximately 550.4 kB / 138.7 kB gzip |
| Dependency audit | `npm audit`: zero known vulnerabilities at verification time |
| Content and asset checks | `npm run check`: catalogue uniqueness, featured order, HTTPS links, current destination verification records, all twenty generated assets and all timeline assets passed |
| Timeline behavior | Twelve shots, seven ordered chapters, finite/monotonic camera positions, reversible revisits and continuous shot boundaries passed assert-based checks |
| All scene navigation | The initial captured journey exercised the six projects and all subsequent chapter scenes; captures retained under `docs/cinematic-frames` |
| Production desktop interactions | `ev_948272e3e14e09bde7cd7d51bd00589ef51170c3e97797d6402593ba00da5171`: project navigation, archive opening, Escape closing, reverse navigation, PageDown scrolling and reading switch completed; no warnings/page errors |
| Final portrait shader / project depth correction | `ev_424a66c68acfde7901325041c4084968216d4684c99608205ad875930c7e5d8e`: repeated production desktop flow; no warnings/page errors; actual screenshot frame no longer intersects the tilted image; outgoing portrait tile dissolve visually reviewed |
| Pointer response and image loading | `ev_3a2f3bf707541cd9ac8b63d76f00d4cd8dd38bce7d4d8afe8254cf9562cb4aee`: all 19 runtime images loaded; no image errors, console warnings or page errors; camera X changed from -0.017 to -0.075 at unchanged scene/scroll pose when pointer moved across header |
| Mobile | `ev_63f2ae1883b044b3ea37f9bfe05d97b9aad00d263217be92d12972aeb867c335`: 390×844 hero, projects, contact and archive interactions completed without warnings/page errors |
| Final mobile contact / reading navigation | `ev_e7c75c015e90c2d1da4bc249cc5393f08a4bf6fb7c262d027690901713d2e9a8`: all 19 images loaded, full email visible, contact remains selected when switching to reading mode, no canvas remains in reading mode, no warnings/page errors |
| OS reduced-motion behavior | `ev_99e8dbfc78967c0bfd9b84a1b0297c2399e4d831a99c7e081d8d39552dae39c7`: starts without a canvas, professional/contact content remains present, explicit Enable cinematic creates and runs the scene; no warnings/page errors |
| Public destinations | `LIVE-LINK-CHECK.json`: eleven presented website destinations returned HTTP 200. Stanius returned 404 and its broken destination was removed. Airadise's separate 503 finding is documented in `AIRADISE-PREVIEW.md` |
| Whitespace | `git diff --check` passed (Git may print LF/CRLF normalization advisories on this Windows checkout) |

## Practical limits

The renderer's deferred Three.js chunk exceeds Vite's default 500 kB size advisory; it is not an eager entry download. The desktop/mobile checks used Chromium 157 in a controlled desktop environment. They do not establish sustained frame rate, energy consumption or GPU memory on every real phone, Safari or Firefox. WebGL failure fallback is implemented and code-reviewed; forced hardware-context failure was not injected during the browser scenarios. No screen-reader session was performed.

The reference's original scan/models and authored WebGPU/TSL implementation are not reproduced verbatim. The new site uses original geometry, generated artwork, genuine project captures and an original WebGL compositor. The visual effects are adapted to the owner's bright palette. Exact mesh-instance totals in the reference are not established: the shipped graph names four GLB resources and two scan resources, while direct GLB inspection returned HTTP 403. Resource counts must not be relabeled as mesh or runtime-instance counts.

No external hosting deployment, push, DNS change or production cutover occurred. The local development/preview processes remain available for review.
