# Reference motion audit — 11 November 2026

Target: https://www.fojcikdominik.com/

## Evidence and scope
Public shipped JavaScript was downloaded for inspection only into `.reference`, which is excluded from Git and never served by the portfolio. REA static parent: `ev_a8e83c2073e16cc9e7becd37beb72969fc33b7877ba75e7615b2e00756615014`; summary: `ev_47e7c5e48069c731a33f0d13fe4fe478e583a5e6599751f53fea370a2a0e868e`. Sixty JavaScript files parsed without parse failures. Semantic graph coverage is partial because the analyzer reserved result capacity for static observations; this is not a complete execution trace.

REA controlled browser observation: `ev_1605f3cd14a8702fb5b91fa57349a10e3525ec2f023b1ea41bbc2a921bb6f69a`. Chromium 157 launch, ten-second observation, DOM/screenshot capture, owned process cleaned up. This capture used reduced motion and does not establish full-motion timing. Full-motion scroll phases were separately observed through the supported browser control surface.

## Confirmed stack
Astro 6.4.8 document shell and ClientRouter. Three.js revision 187 in the shipped renderer bundle. Anime.js version 4.5.0 in the animation engine object. Lenis 1.3.26 in the shipped scroll module. GLTF/Draco, KTX2/Basis, HDR, meshopt and splat loader modules are shipped; loader presence alone does not prove every supported format is used on every page. These are not a collection of drop-in React UI effects. The scene, portal, compositing, worker and interaction code contains substantial custom application logic.

## Story sequence and mechanisms
| Phase | Observed and source-backed mechanism | New portfolio translation |
|---|---|---|
| Opening | Portrait in a wire/grid scene; camera/pointer response; fixed HTML labels | Owner-approved portrait cutout in a lit, animated white architectural room |
| Project stack | Offscreen scene passes render into portal planes; planes sit on a radius-3 ring and move vertically by index; scrolling rotates/traverses the stack | Actual website captures inside rendered 3D portal rooms; scroll controls camera travel through six projects in the requested order |
| Project entry | Portal opening/zoom interpolates independently of the stack; labels project from world geometry into CSS matrices | Portal approach/pullback plus readable DOM captions and source links |
| Corridor | A viewport-calibrated wipe reveals a continuously moving corridor | White physical columns and frames, camera dolly into the experience chapter |
| City | Layered architectural geometry and continued camera travel | Daylight library geometry and layered education scene |
| Splat passage | Scanned scene loader and separate pass camera; explicit camera damping | Original staged art and real 3D geometry; no falsely claimed scan reconstructed from two photos |
| Contact | Final invitation overlays the environment | Contact in a moving correspondence room, followed by Aphelion orbital finale |

`layout...1_lang.Cmzu_zEp.js` defines the viewport timeline, Lenis integration and snap boundaries. `render-app.C19e8EjY.js` maps scroll progress to viewports and rotation. `scene.C9ePulDi.js` creates the portal ring, entry state, offscreen passes, projected labels and pointer pan/orbit. `page-scene.B3iA_gQW.js` documents a separate `/splats/about.vsplat` scene and a damped pass camera (`distancePerViewport: 2.45`, damping 6).

The home timeline reserves openingTiles .4 with slowdown 4 (1.6 viewports), and then continues into corridor/city/splat phases. Overlay thresholds differ: scroll shown/hidden .9/.85; entry shown/hidden .75/.7. Pointer parallax uses exponential convergence (`1-exp(-5*dt)`), with distinct pan and orbit modes. These constants describe the inspected reference build, not universal values copied into the portfolio.

## Asset provenance
Real desktop website captures: raedius.online, arkhe-web-sigma.vercel.app, dot-os.vercel.app, spool-webmcp.vercel.app, faultline-webmcp.vercel.app. Raw captures are retained under `design/project-captures`; optimized delivery images live under `public/assets/projects`. No customer data was entered or actions executed in those tools. Their genuine screenshot colors are preserved; the surrounding portfolio remains white/pastel/burgundy/navy.

## Boundaries
Original proprietary models, scanned scenes and authored shader code are not redistributed. The reconstruction uses the same open libraries where applicable and original rendering code/assets. It is not evidence that the owner's portrait is a volumetric scan. Every claimed effect must be exercised in browser checks; static parsing alone does not prove it rendered.

## Reference asset inventory (unique files, not mesh instances)

| Resource | Confirmed count | What / where | Counting boundary |
|---|---:|---|---|
| Project still images | 19 | Salesforce AI Trust Map 6; Triar 5; Catalogue 4; Revelium Milkmaid 4 | Distinct AVIF paths in the shipped project data |
| Background light/mask images | 2 | `robot-corridor-light.webp`, `robot-corridor-mask.webp` | Baked corridor texture resources; not standalone scene photographs |
| Portrait texture | 1 | `glitch-portrait-impostor.ktx2` | Compressed raster texture used by the portrait effect |
| Project texture atlases | 4 | One `atlas.ktx2` per project directory | Derived packed representations of the same project imagery, not 4 additional projects |
| Environment light probe | 1 | `robot-corridor-probe.hdr` | Lighting input, not a visible background photograph |
| Conventional 3D model files | 4 | `gallery-tile.glb`, `robot-arm-tile.glb`, `studio-corridor.glb`, `city-block.glb` | A model file can contain multiple meshes and can be instantiated repeatedly |
| Scanned spatial scenes | 2 | `about.vsplat`, `japan.vsplat` | Gaussian/splat scene assets, not videos |
| Video files | 0 found | No MP4/WebM file references in the inspected home bundle graph | Does not prove no video exists anywhere on every route or future version |
| Utility / sharing images | 2 | `favicon.svg`, `og.jpg` | Metadata/branding; excluded from scene artwork |

This yields **27 scene image/texture resources** (19+2+1+4+1), **29 including utility/sharing images**, **4 model files**, and **2 scan files** in the recovered path inventory. Nineteen of the scene resources are the original project stills; the atlas copies must not be counted as 4 extra original images. Mesh instances, generated geometry, particle counts and the complete contents of compressed model/scan files are not established by this count. The background appearing to be a video is chiefly live rendering controlled by scroll and frame time. This table is a confirmed shipped-reference inventory, not a claim of an exhaustive asset-server crawl.

## Additional compositor findings
The shipped `splat-scan.BXef3sk2.js` exposes a custom VHS/CRT compositor with chroma blur/shift, line jitter, sharpening, noise, dropouts, saturation/black level, curvature, tape resolution, glow, vignette and a moving hum bar. Inspected defaults include chromaBlur .16, chromaShift .4, lineJitter .44, sharpen 1.8, noise .6, dropouts .11, saturation 2, blackLevel .03, CRT 1, curvature 1, portraitCurvature .4, tapeResolution 1700, glow .6, vignette .7, humBar .12 and loopSeconds 12. These are observed source settings, not an instruction to impose the same dark/grain-heavy grade on the new light design. BloomNode and GaussianBlurNode are bundled shader nodes, not proof of a separate third-party postprocessing plugin. The portrait source is a KTX2 impostor with inspected gridSize 76, cornerRadius .13, frameRadius .8 and coverageCutoff .5.

The new portrait uses the owner's alpha cutout plus an original scroll-driven 64×84 tile dissolve. The new compositor deliberately translates the effect family into subtle daylight distortion rather than claiming the original shader or scan was recovered.

Direct inspection of referenced GLB file contents was attempted separately; the asset request returned HTTP 403. Therefore this audit does not claim exact mesh-definition, primitive, scan-point or repeated runtime-instance counts. The four named model resources remain source-backed references; they are not reported as four total 3D objects.


## Owner-directed revision — 12 November 2026
The original reference findings above remain an analysis record. The current portfolio translation has subsequently changed at the owner's request: physical columns/arches/blocks and ring portals were removed, generated art fills the viewport, only Projects uses side/orbital card motion through the supplied InfiniteMenu, and Education/Aphelion use AuroraBars/Prism. See REACT-BITS-INTEGRATION.md for the current source and behavior; the earlier translation column is historical.
