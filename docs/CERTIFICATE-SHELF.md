# Credential shelf — motion specification

The active Certifications chapter adapts the owner's supplied Leon Vasari VHS shelf brief to eight real credentials. The former Concave Carousel presentation is superseded. The section remains in the existing React/Vite application, with its natural height measured by the shared chapter coordinator.

## Content and visual objects

`src/certificate-data.js` remains the single source of truth. It contains eight unique credentials transcribed from nine actual Drive originals. Three copies of the collection produce 24 cassette instances; repeats are navigation instances, not additional qualifications. The sleeves carry the real title, issuer, category and available date. Their document images preserve the full certificate. Original PDFs/images and their hashes remain untouched.

The warm paper/cobalt palette and printed grain follow the supplied reference. Newsreader regular and italic Latin fonts are self-hosted in `public/fonts/credentials` with their source manifest and OFL. The existing local Inter Tight font supplies interface labels. Japanese film titles, fictional director branding and film-specific artwork are omitted because they would misidentify the documents.

## Motion map

| Interaction | Implementation contract |
|---|---|
| Endless shelf | Three virtual copies; relative indices wrap away from the visible composition; distant instances are culled. |
| Physical spacing | Spine width `H × 142/840`, cover depth `H × 474/900`, gap `H × .03`; continuous sine-spread function opens exactly enough room for the active cover. |
| Shelf travel | Exponential spring coefficient 5.2; coefficient 18 during dragging; frame delta capped at 50 ms. |
| Tape turn | Smoothstep openness, Y rotation to −90°, Z lean −4.5°, forward pull `.2 H`, upward lift `.025 H`, independent spine/cover shading. |
| Hover and tilt | Inactive spine lift `.045 H`; pointer tilt up to 9° horizontally and 6° vertically; separate damped interpolation. |
| Captions | Incoming/outgoing spans travel through overflow masks in the direction of selection; 650 ms with `cubic-bezier(.2,.8,.2,1)`. |
| Category indicator | Cobalt block changes width and horizontal position over 600 ms. Categories refer to real credential subjects. |
| Cursor | Smoothed ring, smaller over spines/controls, expanded cobalt OPEN disc over the settled cover. Fine pointers only; the native pointer remains visible. |
| Open document | Paper expands from the selected cover's projected rectangle, straightens from −4.5°, and fills the view over 1050 ms with `cubic-bezier(.76,0,.18,1)`. |
| Detail typography | Each content group rises through its own mask over 900 ms, beginning at 620 ms with 75 ms stagger. |
| Ink reveal | Seven delayed circles grow to radius 720 over 1250 ms; SVG fractal turbulence and displacement create ragged spreading edges. |
| Close document | Paper contracts back to the current cover over 850 ms. Escape and the close control share this transition. |
| Automatic progression | Approximately 4.5 seconds, suspended while using controls, reading details, opening the sheet, outside the viewport or in an inactive tab. Hovering alone does not stop it. No Play/Pause control is shown. |

The interaction uses one section animation loop with imperative transforms, reusable SVG nodes and the Web Animations API. It does not encode images each frame or allocate a WebGL context. The primary reveals use masks, clips and transforms rather than opacity fades.

## Integration boundaries

Arrows, direct selection, category jumps, dragging, keyboard input and wheel movement all update the same shelf target. The section must coexist with normal page scrolling. Horizontal/shift-wheel interaction is scoped to the shelf; the surrounding portfolio is never globally locked. The expanding document dialog preserves keyboard focus, provides Escape dismissal and allows its content to scroll on small screens. Reading information below the shelf pauses automatic advancement.

Original-document links remain usable if a preview fails. Missing certificate metadata stays omitted. No verification URL, grade, expiry or accreditation is fabricated. System reduced-motion preferences retain complete content with immediate state changes. No visible motion-mode control is added.

`scripts/verify-certifications.mjs` checks original-document hashes, metadata, safe document URLs and the geometry's symmetry, continuity, openness and wrap direction. Final browser results are recorded separately in `REVISION-FOUR.md`; source implementation alone is not evidence of a successful browser interaction.
