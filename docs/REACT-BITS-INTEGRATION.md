# React Bits integration and visual revision — 12 November 2026

This document records revision two. The later Contact, sidebar, portrait and Aphelion changes are documented in [REVISION-THREE.md](REVISION-THREE.md). Prism is no longer mounted; the standalone turntable film replaces it. Rolling Blinds remains pending a valid license key and is not represented by the original ambient fallback.

## Requested change

Remove added geometric pillars, arches, blocks and shelves; use generated artwork as a full-screen background; render the owner's portrait as burgundy/white clouds and stars; hide native scrollbars; use translucent surfaces; confine spherical/side motion to Projects; use AuroraBars for Education and Prism for Aphelion.

## Source and modifications

| Component | Source | Integration |
|---|---|---|
| InfiniteMenu | Owner's supplied full JavaScript/CSS attachment | Retained the instanced spherical renderer and atlas. Added an ordered route and quaternion interpolation driven by the shared scroll timeline. Six actual project captures occupy the sphere, repeated as specified by the component's count behavior. Screenshot aspect ratio is preserved in each tile. Autoplay is disabled. Arrow keys navigate the page to the next/previous featured project; native page scrolling drives continuous sphere movement. Grazing tiles fade away to avoid noisy edge slivers. |
| DitherVeil | Official `DavidHDev/react-bits`, `src/content/Animations/DitherVeil` | Kept the Floyd–Steinberg image sampling and interactive mask. Replaced square output with cloud/four-point-star glyphs in burgundy and white, with soft drift and breathing. Removed the clear-photo reveal branch entirely. Alpha outside the portrait stays transparent. Reading mode uses a static version of the same abstract portrait. The default remote demo photo was replaced by the owner's selected local portrait. |
| Prism | Owner's supplied design and official `src/content/Backgrounds/Prism` | Light mode, a burgundy/pale-blue palette and three-axis rotation. Added a soft ray-marched silhouette contribution so the prism remains legible on white artwork. Parent motion preference controls mounting. GPU resources are released on exit. |
| AuroraBars | Owner's supplied component | Same two-wave/arch height model. Uses burgundy, pale blue, sage and white instead of the pasted dark/purple defaults. Ref-based transforms update the bars without a React render every animation frame. |
| Full-screen background | Original local `stage-engine.js` | Removed the previous 3D architecture and model assemblies. One full-screen shader draws cover-cropped image layers with pointer parallax, scroll zoom, subtle drift/grain and a feathered transition. No boxed portal/frame remains behind non-project sections. |

Official source: https://github.com/DavidHDev/react-bits . The shipped `LICENSE.md` was retrieved with the source and is retained verbatim in `REACT-BITS-LICENSE.txt` and `public/react-bits-license.txt`. Source notices identify the adaptations. The supplied InfiniteMenu usage/demo data were not copied into the application; all six items come from the portfolio's verified project catalogue.

## Structure

`CinematicApp.jsx` owns content, navigation, reading mode and motion preference. `story.js` supplies the ordered twelve-shot/seven-section timeline. `SceneEffects.jsx` mounts only the relevant visual layers and lazily loads their modules. `motion-math.js` owns deterministic project routing/orientation and Aurora height math, with assert-based tests. `scene-effects.css` contains the full-screen/translucent theme and effect layout; the base layout remains in `cinematic.css`. Native scrollbars are hidden without disabling scrolling.

Background sampling uses viewport and image aspect ratios to cover the full width and height. The project sphere is absent outside the project passage. Captions remain readable when the visitor stops partway through a transition. Reading mode keeps semantic section content and an abstract portrait, and individual effect failures have a styled status boundary.

## Verification

- `npm run check`: content/assets, timeline continuity/order/reverse positions, sphere routing, quaternion normalization/front alignment and Aurora bar-height bounds.
- Production build passes. Components load separately. The Three.js compositor remains a deferred ~534 kB / 133 kB gzip chunk and triggers Vite's default size advisory.
- `npm audit`: zero known vulnerabilities at verification time.
- REA full desktop journey `ev_b6b828bb0c3eafe130b182ba95ac2bc240bf3e1a684e0197a4177b73052106c3`: hero, project sphere, later sections and reverse return completed, with no console warnings/page errors.
- REA refined desktop effects `ev_78f776624cab1a7f32d2b8bafc463b3634f2acff9a99c65454d5b5146eeb112d` and refined prism `ev_60e2284f9cf09bfdc1f003c31acfcc07276051fae0a87e9de129f469dae697bb`: visibly reviewed; no console warnings/page errors.
- REA desktop development preview `ev_4f9aec128e645b8012c21247661dc6b73391db6c5b6191b2abcc2d3aff8b3e0d`: all six ordered focal projects, reverse arrow navigation, native PageDown input, return home and reading toggle completed. The reading portrait remains abstract. No console warnings/page errors.
- REA final continuous-scroll test `ev_0cdb4e3b325a7b11512830ba740c5defc985054d3339d60fc3fd3249c5e4701f`: native page input moved the project sphere's continuous position from 0.000 to 0.400, with no warnings/page errors.
- REA final mobile `ev_c13f4b5665a0b6212f0aa8ed1b7e64d08b3509aeb7132264cd14d5c1569cde02`: refined Prism, abstract hero and static reading portrait at 390×844 completed with no warnings/page errors. Earlier mobile project/Aurora captures are retained under `docs/revision-2`.

These are real Chromium browser captures, not fabricated product renders. Physical-phone GPU/frame-rate testing and Safari/Firefox verification were not performed. No external deployment occurred.

Final caption-legibility and grazing-tile refinement: `ev_215f2d71555bf3cdafd023e821ba22f9f232f91bd7a365b5f602ccbd870926d8`; project movement and hero return completed with no warnings/page errors. Stable proof frames: `docs/revision-2/verified-project-ready.png` and `docs/revision-2/verified-hero-complete.png`.

Final tile geometry uses a smaller footprint and rounded corners so neighboring spherical cards do not intersect. Final visual capture: `ev_4cca94d8f7c39c136df23f684909567e9337dfe4009a23ea27ea4839b447255f`; no warnings/page errors. Final proof images use the `docs/revision-2/final-` prefix.
