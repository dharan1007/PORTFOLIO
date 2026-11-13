import catalogue from "./project-data.json" with { type: "json" };

export const chapters = [
  ["about", "About me"],

  ["projects", "Projects"],

  ["experience", "Experience"],

  ["education", "Education"],

  ["certifications", "Certifications"],

  ["contact", "Contact details"],


];

export const featuredIds = [
  "raedius",

  "airadise",

  "arkhe",

  "dot-os",

  "spool",

  "faultline",
];

const projectDetails = {
  raedius:
    "A social platform for finding people through shared intent and coordinating through Circles, requests, offers and contributions. Identity, discovery and messaging connect across web and mobile, with audience controls, moderation and offline continuity. Development is currently paused.",

  airadise:
    "A local-first desktop environment for persistent AI agents and automation. Built with Tauri and reusable TypeScript packages, it brings workflows, scheduling, permissions, secure credentials and MCP tools together with multi-agent coordination and replay/evaluation infrastructure.",

  arkhe:
    "An experimental computational-organism runtime that organizes intelligence into cells, tissues, organs and connected systems. Its Python packages cover runtime operation, training infrastructure and repository coding and repair. Independent frontier capability remains unqualified.",

  "dot-os":
    "An adaptive operating layer in development within Aphelion’s product architecture. Dot OS sits above the Nexus execution foundation and supports the platform, agentic and experience layers above it. Its real Operations Center website presents this direction.",

  spool:
    "A local-first data migration system combining browser-based CSV/XLSX preparation with a bounded-memory local runner. Its documented workflow connects source identity, target contracts, approvals, transactional batches and crash reconciliation to verification and a commit-bound receipt.",

  faultline:
    "A local-first browser debugging workbench that captures an authorized Playwright page and independently reproduces its failure. It then removes candidate HTML, CSS and JavaScript under a deterministic check, keeping only reductions that preserve the failure and produce a smaller case to investigate.",
};

const definitions = [
  {
    id: "about",

    chapter: "about",

    kind: "portrait",

    title: "Dharantej Reddy.",

    subtitle: "Product engineer & founder",

    description:
      "I build products and the systems behind them. From interfaces to agent platforms and computing research.",

    background: "/assets/02-gallery.webp",

    span: 1,
  },

  ...featuredIds.map((id) => {
    const p = catalogue.projects.find((p) => p.id === id);

    const repo = catalogue.repositories.find((r) => r.name === p.repo);

    return {
      id,

      chapter: "projects",

      kind: "project",

      title: p.name,

      subtitle: p.category,

      description: projectDetails[id],

      stack: p.stack,

      liveUrl: p.liveUrl,

      sourceUrl: repo?.visibility === "public" ? repo.url : null,

      preview: `/assets/projects/${id}.webp`,

      background: "/assets/03-horizon.webp",

      span: 1.6,
    };
  }),

  {
    id: "experience",

    chapter: "experience",

    kind: "valley",

    title: "Experience. The engineering journey.",

    subtitle: "Experience",

    description:
      "Founder and builder at Aphelion. React Native Developer Intern at Anshap Services Pvt. Ltd., 22 September–15 November 2025.",

    background: "/assets/11-studio.webp",

    detail: "/assets/12-desk.webp",

    span: 2.4,
  },

  {
    id: "education",

    chapter: "education",

    kind: "academic-dive",

    title: "Education. The academic archive.",

    subtitle: "CBIT Hyderabad · Graduated 2026",

    description:
      "B.Tech in Artificial Intelligence & Data Science. Approximately 7.5/10 CGPA; graduated in 2026.",

    background: "/assets/16-paper.webp",

    detail: "/assets/14-books.webp",

    span: 2.4,
  },

  {
    id: "certifications",

    chapter: "certifications",

    kind: "archive",

    title: "Certifications. The credential archive.",

    subtitle: "Certifications & continued learning",

    description:
      "Eight original credentials, preserved with issuers, completion details and source documents.",

    background: "/assets/16-paper.webp",

    detail: "/assets/15-seal.webp",

    span: 2,
  },

  {
    id: "contact",

    chapter: "contact",

    kind: "correspondence",

    title: "Let’s make something matter.",

    subtitle: "An open line",

    description:
      "Products, engineering, research—or a conversation about what comes next.",

    background: "/assets/17-correspondence.webp",

    detail: "/assets/04-ribbon.webp",

    span: 2,
  },


];

let cursor = 0;

export const shots = definitions.map((shot, index) => {
  const result = { ...shot, index, start: cursor };

  cursor += shot.span;

  return result;
});

export let totalPages = cursor;

export function updateSectionSpan(id, span) {
  if (!Number.isFinite(span) || span <= 0) return false;

  const contact = shots.find((s) => s.id === id);

  if (!contact) return false;

  if (Math.abs(contact.span - span) < 0.001) return false;

  contact.span = span;

  let page = 0;

  for (const shot of shots) {
    shot.start = page;

    page += shot.span;
  }

  totalPages = page;

  return true;
}

export const updateContactSpan = (span) => updateSectionSpan("contact", span);

export const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const smooth = (a, b, value) => {
  const t = clamp((value - a) / (b - a));

  return t * t * (3 - 2 * t);
};

export function storyAt(page) {
  const index = Math.max(
    0,

    shots.findLastIndex((shot) => page + 0.00001 >= shot.start),
  );

  const shot = shots[index],
    local = clamp((page - shot.start) / shot.span);

  const transition =
    index === shots.length - 1
      ? 0
      : smooth(shot.kind === "project" ? 0.2 : 0.58, 1, local);

  return {
    index,

    local,

    transition,

    position: index + transition,

    progress: clamp(page / totalPages),

    active: transition > 0.65 ? Math.min(index + 1, shots.length - 1) : index,
  };
}
