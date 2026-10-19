/* ============================================================================
   YOUR DETAILS — edit this one file. Save + the dev server hot-reloads.
   ========================================================================== */

export const SITE = {
  name: 'Dharantej Reddy',
  initials: 'dtr',
  role: 'Creative Front-End Developer',
  accent: '#D21A2E',

  manifesto:
    'I design and build immersive web experiences — sharp interfaces, fluid motion, and detail you can feel.',

  // Count-up stats
  stats: [
    { value: 48, suffix: '+', label: 'Projects shipped' },
    { value: 6, suffix: ' yrs', label: 'Building for the web' },
    { value: 23, suffix: '', label: 'Happy clients' },
    { value: 12, suffix: '', label: 'Awards & mentions' }
  ],

  journey: {
    title: 'My journey',
    steps: [
      { text: 'First', style: 'lead' },
      { text: 'visual design.', style: 'both' },
      { text: 'Then', style: 'lead' },
      { text: 'front-end craft.', style: 'both' },
      { text: 'Today', style: 'today' },
      { text: 'I blend', style: 'lead' },
      { text: 'both worlds.', style: 'today' }
    ]
  },

  toolkit: {
    frontLabel: 'Development',
    designLabel: 'Design',
    front: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Three.js', 'GSAP', 'Framer Motion', 'Tailwind', 'Node.js', 'WebGL'],
    design: ['Figma', 'Photoshop', 'Illustrator', 'After Effects', 'Blender', 'Framer', 'Webflow', 'Premiere', 'Rive', 'Cinema 4D']
  },

  projects: [
    { name: 'aurora dashboard', tag: 'Product · 2025', hue: 8 },
    { name: 'kintsugi store', tag: 'E-commerce · 2025', hue: 348 },
    { name: 'pulse festival', tag: 'Interactive · 2024', hue: 340 },
    { name: 'mono studio', tag: 'Agency site · 2024', hue: 12 },
    { name: 'ember travel', tag: 'Editorial · 2023', hue: 355 }
  ],

  // React-Bits DomeGallery (visual diary)
  gallery: {
    eyebrow: '— Visual diary',
    title: 'Frames, grain & type.',
    words: [
      { text: 'motion', hue: 352 },
      { text: 'grid', hue: 8 },
      { text: 'glass', hue: 20 },
      { text: 'grain', hue: 340 },
      { text: 'type', hue: 14 },
      { text: 'chrome', hue: 356 },
      { text: 'stack', hue: 28 },
      { text: 'bloom', hue: 332 }
    ]
  },

  // React-Bits InfiniteMenu (the reel)
  reel: {
    eyebrow: '— The reel',
    title: 'Things I keep building.',
    items: [
      { title: 'aurora dashboard', description: 'Product UI with live data and fluid motion.', hue: 8, link: '#projects' },
      { title: 'kintsugi store', description: 'Commerce with craft — joins and all.', hue: 348, link: '#projects' },
      { title: 'pulse festival', description: 'An interactive identity that never sits still.', hue: 340, link: '#projects' },
      { title: 'mono studio', description: 'An agency site built on restraint.', hue: 12, link: '#projects' },
      { title: 'ember travel', description: 'Editorial layouts that wander.', hue: 355, link: '#projects' },
      { title: 'glass lab', description: 'WebGL studies in light and refraction.', hue: 24, link: '#projects' }
    ]
  },

  // React-Bits Lanyard + TearTicket (collect section)
  collect: {
    eyebrow: '— Take one',
    title: 'Grab my card. Keep the ticket.',
    lanyardCaption: 'Drag the card — click to flip',
    ticketCaption: 'Pull the stub to tear it off',
    claimedCaption: 'Torn — now say hello',
    ticket: {
      kicker: 'Admit one',
      headline: 'Open to opportunities',
      note: 'Freelance & full-time · 2026',
      stubLabel: 'Admit one',
      stubName: 'dtr',
      stubNo: 'No. 284619'
    }
  },

  next: {
    prefix: 'If our visions align,',
    suffix: "let's build something worth remembering."
  },

  footer: {
    lines: ['Open to', 'opportunities', '2026'],
    copyright: '2026 Dharantej Reddy',
    email: 'hello@dharantej.dev',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/' },
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'Email', href: 'mailto:hello@dharantej.dev' }
    ]
  }
};
