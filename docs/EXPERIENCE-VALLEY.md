# Experience Valley — original compiled-engine integration

The owner explicitly requested the original compiled Gladeye flower-valley experience and stated that they have permission to reuse it. This document records that owner assertion; it is not independent proof of a license grant. The earlier original architectural corridor has been removed from the active Experience implementation. No unlicensed-source or open-source license claim is made for the valley artwork, audio or application-specific shaders.

## Delivery and isolation

`public/experience-valley/index.html` contains the original 17 compiled JavaScript chunks and all ten exact original media/model resources inline. It does not depend on external JavaScript, images, geometry or audio at runtime. The existing Experience React component embeds it in an iframe sandboxed with `allow-scripts` only; no `allow-same-origin`, navigation, forms, popups or downloads are granted. Its CSP permits only inline scripts/styles and data/blob resources. No original analytics or external fetch destination is permitted.

The HTML export patch exposes the original valley constructor and audio state getter. Literal original asset URLs are replaced with equivalent inline data URIs; the camera GLB retains a `.glb` name in its data URI because the original loader selects its decoder from the filename. Original engine shaders, sprite sheets, terrain lookup, camera geometry, composition, postprocessing, blooming/growth and hover transitions are retained. The module is otherwise executed inside its original compiled Webpack runtime.

The parent bridge forwards finite, clamped pointer coordinates, wheel/touch delta, CTA hover, reduced-motion state, visibility and opt-in audio state only. The child checks both the sending Window and the parent origin from its referrer. The parent checks the exact child Window and a fixed message namespace; it intentionally accepts the sandbox's opaque origin. Touch forwarding uses the original virtual-scroll multiplier of 20 and clamps each forwarded delta to ±160; passive touch listeners reset on end/cancel. Parent scrolling remains native: the iframe has no pointer events and no event cancels parent wheel/touch/keyboard scrolling. The original camera controller continues to receive forwarded wheel input and retains its idle travel.

Sound starts muted and is initialized only after the visible section Sound control is clicked. The original audio store performs mute/unmute; offscreen/tab-hidden handling stops audio and the original render/scroller RAFs. Reduced-motion mode renders a settled original frame (intro angle 0 and dispersal 0), then stops the scene with all professional text visible. No employment information is encoded inside the compiled scene. Real Aphelion/Anshap records remain in semantic React HTML.

Inline HTML size: **8,435,114 bytes**. SHA-256: `96237b63ffa81740b1fd3cbe3cda313553efe33fedfcb321d637385ea6da2718`. Original media payload: **5,252,584 bytes**. Original compiled JavaScript: **1,426,090 bytes**. The 3.3 MB opt-in audio is included in the single file, so the initial document transfer includes it even though playback is deferred.

## Original media manifest

| Resource | Bytes | SHA-256 |
|---|---:|---|
| [Original valley/audio/ge-ambient.mp3](https://gladeye.com/valley/audio/ge-ambient.mp3) | 3,315,774 | `e56ff90d828a14701832e4ece56f13791dfa25dfcddb0a64f40370ec763514d3` |
| [Original valley/camera-path07.glb](https://gladeye.com/valley/camera-path07.glb) | 10,132 | `dab4459358d8d22ec633152119ec9939947336a0f116c7aca746407403630d4e` |
| [Original valley/dust-particle.png](https://gladeye.com/valley/dust-particle.png) | 2,102 | `6a1dde1724aac0069dea0fb01fd42c362efa647da85acb6a83a2c12c3f9c7efe` |
| [Original valley/flowers/pool_summer.png](https://gladeye.com/valley/flowers/pool_summer.png) | 249,287 | `6f16b2d004f5260df4bbd1b49b19c0e978f0bff709fd7385107dd90226dbec47` |
| [Original valley/flowers/pool_winter.png](https://gladeye.com/valley/flowers/pool_winter.png) | 915,892 | `bea3c0bd21f77a65d09650f9030fdd54cec3f92234ef6e79769f493ba8bf1c71` |
| [Original valley/rays/ray1.png](https://gladeye.com/valley/rays/ray1.png) | 295,868 | `705002f9736633069b868df111942cdb3806de5f6b11f31b73995e4cbf638087` |
| [Original valley/rays/ray2.png](https://gladeye.com/valley/rays/ray2.png) | 225,311 | `f6d0c3128ba89b03fa2cf93004736712664b810d9513a4fc6167f7ade2fa58d2` |
| [Original valley/rays/ray3.png](https://gladeye.com/valley/rays/ray3.png) | 222,220 | `f45d34a16445db569800053b6edcc015682f4e35613fdf2793442f41eb5417f7` |
| [Original valley/terrain.png](https://gladeye.com/valley/terrain.png) | 8,562 | `13e59c971bcf087298c52086a9163914cfa026624fd14f55eaa8ac652c9c372e` |
| [Original valley/vignette.png](https://gladeye.com/valley/vignette.png) | 7,436 | `cb96021890661683b94bae5f0dda04c6aab9c2f86af5a96468c0a0fabdc32334` |

## Original compiled chunks

| Source | Bytes | SHA-256 |
|---|---:|---|
| [webpack-a76c04a7ba9aa4ef.js](https://gladeye.com/_next/static/chunks/webpack-a76c04a7ba9aa4ef.js) | 3,962 | `e9ee6b17ba7c4f30a892a7ccae50aba9a432407fa9f5fa956e03d6607b46801c` |
| [fd9d1056-76aadce26f555392.js](https://gladeye.com/_next/static/chunks/fd9d1056-76aadce26f555392.js) | 160,712 | `ecf5645d5ec8f5acdc5c9667b5ec19a789d4faea07ed79f7eeee6bddec25aa8e` |
| [123-3b7f3df3cc5866d7.js](https://gladeye.com/_next/static/chunks/123-3b7f3df3cc5866d7.js) | 102,017 | `e83b0df5cc1f98de8e7b140abbf9cd2635b631402d807e3b6c0dc7d6f1dea4d9` |
| [450-96e2a31dde902aa5.js](https://gladeye.com/_next/static/chunks/450-96e2a31dde902aa5.js) | 141,609 | `07f6da685fd76e30a9c1f1d9a0e55a121025fdc70da239ff79420f6af73d661e` |
| [567-6466d5cc81546a43.js](https://gladeye.com/_next/static/chunks/567-6466d5cc81546a43.js) | 19,252 | `d760ffed0990e4d67451e4ad9034a4204b902520d063bd3c12c8fa8c70b8911f` |
| [340-4c85e05b44fc7370.js](https://gladeye.com/_next/static/chunks/340-4c85e05b44fc7370.js) | 6,751 | `5e520073975eefe554444e98fb4ca660868702c2b476035897781c3ca35ce0e9` |
| [15-91b52fecfdd8e21a.js](https://gladeye.com/_next/static/chunks/15-91b52fecfdd8e21a.js) | 6,157 | `d6e8133aa3ab4e2fadc541e3cb559dc20845f36ee08df7b5783b07102c6b5022` |
| [780-35f43a00462f78e8.js](https://gladeye.com/_next/static/chunks/780-35f43a00462f78e8.js) | 16,685 | `bef8c0267c6ab029782194ecaa11472ad1a16d67e867834c53010eecbca64683` |
| [419-c9aec889e32d9e7b.js](https://gladeye.com/_next/static/chunks/419-c9aec889e32d9e7b.js) | 81,048 | `e4de34bf8a456614d34fd366586215992568f441d4c6782df2b3ac7c43b6651d` |
| [131-8efcfd03f067c029.js](https://gladeye.com/_next/static/chunks/131-8efcfd03f067c029.js) | 17,110 | `4455fa6cf7b4ff2efaa191aea584f1f877ad33fd5d12196be42aa268e469b88c` |
| [app/layout-681f1a9fe4dd4628.js](https://gladeye.com/_next/static/chunks/app/layout-681f1a9fe4dd4628.js) | 30,550 | `133b733f5eab7e315ef06ec9841d9f7c00106d9884482581377325478c9a9fa1` |
| [4b5b508e-6dceef0b9f02cb18.js](https://gladeye.com/_next/static/chunks/4b5b508e-6dceef0b9f02cb18.js) | 80,490 | `c837957c63f427ac0a093eb8a98c196c7aed24dd62c115e1df877cd53634a1de` |
| [8-5234b317a5794281.js](https://gladeye.com/_next/static/chunks/8-5234b317a5794281.js) | 5,066 | `31a365665836e8f3829c1a30bd34c95370c63f1b62902a11f20c20e74ccf0804` |
| [785-3ec288b614fa287f.js](https://gladeye.com/_next/static/chunks/785-3ec288b614fa287f.js) | 11,256 | `3a0249cfa4f13c02eaf34ed15746e3a943a9f456534213322937857e749b0115` |
| [b536a0f1-51636bd4ac051d8f.js](https://gladeye.com/_next/static/chunks/b536a0f1-51636bd4ac051d8f.js) | 549,571 | `80bf95efc815127d7646dfec8f44451eea7bdc844f00d5ececd15b7260e40400` |
| [596-40a806be0d0d2bb3.js](https://gladeye.com/_next/static/chunks/596-40a806be0d0d2bb3.js) | 111,113 | `f808e878ce520da53ffbb92d37af7788a0c01a8ec115ec2af26c36be74e1f198` |
| [app/page-4c279de0997d388f.js](https://gladeye.com/_next/static/chunks/app/page-4c279de0997d388f.js) | 82,741 | `5f164d7403807a0409497dd9808b8fa59b3228a1e1b8e7ca8fac2128d8fec65b` |

## Browser proof

- Direct original engine: one WebGL canvas, `valleyReady=true`, entrance reached `intro-complete`; zero errors/warnings in that isolated capture. `docs/revision-4/valley-proof-initial.png`.
- Opaque sandbox with strict CSP: original scene rendered successfully with `origin="null"`. `docs/revision-4/valley-proof-sandbox.png`.
- Pointer bridge: input (0.75, 0.6) changed original mouse state to (0.5, 0.2).
- CTA hover: original `buttonHover=true`; original dispersal uniform reached approximately 1.0. `docs/revision-4/valley-proof-hover.png`.
- Offscreen pause: original renderer frame counter remained 3600 → 3600 across 500 ms.
- Audio after an actual user click: original store initialized, muted=false, AudioContext=`running`, original audio source `isPlaying=true`; then muted again.
- Reduced-motion still proof: original intro settled, angle=0, dispersal=0; `docs/revision-4/valley-proof-still.png`.
- JSX transformed through the existing Vite/Oxc pipeline. Parent performs the final integrated production, desktop and mobile checks.

The proof session also encountered transient parent Education-module HTTP 500 responses while that separate component was being edited, plus a default favicon request from the temporary proof host. Those are not source-engine errors and are not claimed as a clean integrated-site run.

Physical device frame rate and every browser are unverified. Retain the owner permission documentation before public distribution; no deployment is performed by this integration.

## Final lifecycle review

The Experience interface waits for the original `intro-complete` message before its 1.6-second reveal, rather than treating asset loading as a completed visual entrance. A scoped dot loader covers that handoff. The 15-second fallback timer runs only while this chapter is visible, so reading Projects cannot prematurely mark the preloaded valley unavailable. Leaving the chapter clears that timer. The fallback preserves iframe geometry so a late completed introduction can recover instead of remaining in a zero-size hidden renderer. Reduced-motion and visibility messages are synchronized when their controlling prop changes.

The internship date labels use explicit UTC date formatting, and the original-document arrow uses an HTML entity to avoid text-encoding artifacts. Touch input remains passive and the global page is never locked.

This final lifecycle patch was reviewed in code only at the owner's request; the integrating parent performs the single final validation pass. No additional browser or screenshot run was performed for this patch.
