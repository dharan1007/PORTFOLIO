# Dharantej Reddy — cinematic portfolio

Personal portfolio of Poduvu Dharantej Reddy, built with React 19, Vite 8, TypeScript additions, Tailwind CSS v4, Motion, GSAP and Lenis.

Live website: https://dharantejreddy.vercel.app/

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4322/. Build production files with `npm run build`; `npm run preview` serves that build locally.

## Current presentation

- Hero: burgundy and white motion background, cursor-responsive DitherVeil and personal identity.
- Projects: six real previews and descriptions in a horizontal rail driven by normal page scrolling, ordered RÆDIUS, Airadise, ARKHE, Dot OS, SPOOL and FAULTLINE.
- Experience: documented Aphelion and Anshap work over the flower valley. A native MP4 remains beneath the isolated interactive renderer so delayed or failed WebGL does not leave a blank background.
- Education: academic record, approximately 7.5/10 CGPA, specialization and achievements supplied by the owner.
- Certifications: VHS shelf using original credential previews and documents.
- Contact: original links, selectable inquiry topics and a moving bunny with colour-based background removal.

## Source map

- `src/CinematicApp.jsx` and `src/story.js`: page composition, navigation and chapter boundaries.
- `src/ProjectsSection.jsx`: pinned horizontal project rail.
- `src/ExperienceSection.jsx`, `public/experience-valley/index.html` and `public/assets/experience-valley-loop.mp4`: interactive valley, playback lifecycle and video fallback.
- `src/EducationSection.jsx` and `src/education-data.js`: education presentation and facts.
- `src/CertificationsSection.jsx`, `src/certificate-data.js` and `public/certificates/`: credentials and original documents.
- `src/ContactSection.tsx` and `src/BunnyForeground.jsx`: contact content and video foreground.
- `vercel.json`: Vite build and `dist` deployment output.

The repository contains historical design masters, screenshots and revision notes. Some describe superseded layouts. Older verification scripts also refer to earlier presentations; a successful production build is not a claim that every historical check passes.

## Assets and optional licensed components

Asset provenance and reference notes are in `docs/ASSET-LEDGER.md`, `docs/EXPERIENCE-VALLEY.md`, `docs/CERTIFICATE-INVENTORY.md` and the local font license files. The owner supplied the valley reference and stated reuse permission; that permission was not independently verified. Do not treat the repository as a blanket license to reuse third-party assets or personal certificates.

Optional React Bits Pro installation uses `REACTBITS_LICENSE_KEY` through the authenticated registries in `components.json`. `.env.example` contains no key. Keep credentials in an ignored local environment file; never expose them through client environment variables.

The Anshap certificate records 22 September–15 November 2025. The portfolio follows the original document rather than the conflicting date in an earlier design brief.
