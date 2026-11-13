# Revision three — 12 November 2026

## Delivered behavior

The portfolio sidebar collapses on desktop without reserving its former width. On mobile it is a drawer with a scrim, Escape handling, focus cycling, focus return and automatic closing after navigation. The preference persists in local storage. Hidden navigation is inert. Native scrollbars remain hidden without disabling page scrolling.

The hero uses the owner's selected portrait as a luminance source. Its five burgundy/white levels preserve facial features while the visible marks remain small clouds and four-point stars. The effect does not reveal the RGB photograph on hover. Pointer response, the full-screen compositor and the existing cinematic scroll journey remain active; side/spherical motion remains confined to Projects.

Contact is a native React 19/TypeScript section with Tailwind CSS v4 and Motion, a solid #FF0000 background, the supplied white SVG, Manrope body type, Marck Script signature, factual personal copy and all four real contact destinations. Its bottom video retains the requested full-width, uncropped aspect ratio and red gradient blend. Its natural height is measured into the shared story timeline, preserving the later Aphelion navigation position as fonts and media settle. The supplied operational-business demo copy was adapted to the portfolio owner rather than presented as an unsupported personal claim.

Aphelion uses `public/aphelion/index.html`, a standalone document with one inline style block and one inline script, no external JavaScript, and no local media dependency. Its exact supplied remote video/poster are retained. Identity, links and product context are adapted to Aphelion: RÆDIUS, Airadise, ARKHE and Dot OS. The serif headline is top anchored above the turntable. Poster-to-video crossfade waits for frames. Mobile uses a bottom-anchored 64svh film plate, a matching blurred poster backdrop, and a feathered join. The menu button stays above its overlay, supports Escape, cycles keyboard focus, and closes on navigation or a desktop resize. Reduced motion suppresses entrances and autoplay. Portfolio UI uses navy/burgundy rather than the black ink in the pasted template.

The standalone page is embedded below the portfolio header and beside the expanded desktop index. Collapsing the index expands the film. It can also be opened directly at `/aphelion/index.html`.

## External dependencies and limits

| Requested asset/component | Verified state | Application behavior |
|---|---|---|
| Contact Cloudinary video | HTTP 401 in both an HTTP check and Chromium | Exact URL retained; styled red error state, real email link and Retry control. Playback cannot be claimed. |
| Aphelion CloudFront video | Video frames visibly playing in desktop and mobile Chromium | Muted loop, poster crossfade, responsive composition. |
| Aphelion Higgs poster | A header-only request returned 403; actual Chromium retained the poster without its error/hide path | Original poster URL retained. Browser playback verification takes precedence over the inconclusive header-only request. |
| React Bits Pro Rolling Blinds | No `REACTBITS_LICENSE_KEY` in process, user/machine environment or workspace environment files at verification time | Genuine premium component is not installed. An independently written ambient-light background runs instead and is explicitly identified as a fallback. |

Contact source: `https://res.cloudinary.com/daklr2whx/video/upload/v1778602552/track-video_2_s9lp53.mp4`.

Turntable source: `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260908_125738_eb584080-9f98-489e-adb2-014760aa34da.mp4`.

The authenticated registries are configured in `components.json` using an environment-variable reference, following the [React Bits Pro installation documentation](https://pro.reactbits.dev/docs/installation). No license secret is committed or exposed through a VITE-prefixed client variable. The installer loads ignored `.env.local` and refuses to contact the registry without a key. Once a valid key is available, run `npm run add:rolling-blinds`. This invokes the requested shadcn installation. `PremiumBackdrop.jsx` detects the installed component by filename, but the licensed module's actual integration and behavior still require verification after installation; they have not been tested without its source.

## Verification

- `npm run check`: asset/catalogue assertions, section/project order, forward/reverse timeline positions, measured Contact-span updates, project orientation, Aurora bounds, exact standalone media, single inline CSS/JS structure, real products/contacts and registry environment reference.
- `npm run typecheck`: TypeScript checks pass.
- `npm run build`: production build passes. The deferred Three.js compositor still triggers Vite's chunk-size advisory (approximately 534 kB / 133 kB gzip); it is not a build error.
- `npm audit`: zero known vulnerabilities at the checked dependency state.
- Missing-key installer path fails clearly without printing or sending a key. The authenticated installation path is unverified.
- No unhandled browser page errors in the final desktop/mobile scenarios. The Contact video's HTTP 401 is a known resource error, not a successful video load.

REA evidence:

| Scenario | Evidence ID | Observed result |
|---|---|---|
| Final development preview, 1440×900 | `ev_dfde40978d3959cff27700e171545cf3af22c8d0278c7788b60be832a2f7cb58` | Aphelion embedded film playing, headline and wordmark clear of sidebar; no unhandled page errors. |
| Final embedded production preview | `ev_8614b695bf7f8eaca2b14ea6b81ace019cb57961ec9273eab19bb0defd3b7d80` | Aphelion iframe present and turntable visible after timeline boundary correction. |
| Mobile portfolio drawer | `ev_844144e581ff429cf2574115aead9ae895b32706ecbdfa5c5ab8baf552fd0483` | Opens, Escape closes, reopens, Contact navigation closes; red Contact section visible. |
| Standalone mobile film, 375×812 | `ev_8686bbaeee97298ac98756add2e122dde94bcc8c8be48b12a18eebed808bb6ac` | Film plays, headline wraps, overlay opens and Escape closes; no console/page errors. |
| Standalone desktop film | `ev_85641eba8ced5e1795846f5a2b930c0e848902b0abe6ec88728660a27372a4c7` | Actual video frames ready and visible; the later inline favicon also removes the earlier favicon request. |

Screenshots are retained under `docs/revision-3/`: `final-aphelion.png`, `refined-facial-portrait.png`, `verified-navigation-open.png`, `verified-mobile-red-contact.png`, `verified-mobile-turntable.png` and `verified-burger-open.png`.

Physical phone GPU behavior, Safari and Firefox were not tested. No external deployment, commit or push was performed as part of this revision.
