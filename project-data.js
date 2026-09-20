window.PROJECTS = [
  {
    id:"raedius", name:"RÆDIUS", repo:"raedius", visibility:"Private", category:"Social systems", status:"Phase 1",
    tagline:"A contract-first social network built as a modular monolith.",
    summary:"RÆDIUS is the current social-product system: identity, contextual profiles, graph, Circles, private Lists, Lines, Planes, Dots, audience-aware publishing, ranked Home, search and discovery, interactions, direct messages, moderation and offline continuity.",
    verified:["Phase 1 social kernel is documented in the repository","Shared data access is routed through @raedius/data-client rather than direct Supabase imports from UI surfaces","Repository verification is run through pnpm verify"],
    stack:["Node 22","pnpm","Expo / React Native","Next.js","Supabase","TypeScript"],
    live:"https://raedius.online", source:null, year:"2026", featured:true, layout:0, accent:"#e53935"
  },
  {
    id:"arkhe", name:"ARKHE 4.6", repo:"arkhe", visibility:"Private", category:"AI runtime", status:"Research runtime",
    tagline:"A computational-organism AI runtime with a separate frontier-training and coding substrate.",
    summary:"ARKHE organizes runtime intelligence as cells, tissues, organs, systems, organism, environment and development/evolution, with packages for runtime operation, frontier-training infrastructure and repository coding/repair.",
    verified:["Core runtime lives under src/arkhe","Frontier training substrate lives under src/arkhe_frontier","Repository coding organism lives under src/arkhe_coding_frontier","The repository explicitly does not claim independent frontier-model superiority without signed benchmark evidence"],
    stack:["Python","CLI runtime","Training infrastructure","Repository repair","Verification gates"],
    live:"https://arkhe-live.vercel.app", source:null, year:"2026", featured:true, layout:1, accent:"#f0a23a"
  },
  {
    id:"axiom", name:"Axiom / Airadise AI World", repo:"axiom", visibility:"Private", category:"AI simulation", status:"Active research",
    tagline:"Persistent AI beings operating inside a governed synthetic world.",
    summary:"A web-based AI-world simulation with explicit resources, survival constraints, synthesis rules, zones, economic scarcity, social and governance actions, a marketplace, skills and isolated task execution.",
    verified:["Workspace packages separate execution engine, prompt engine and shared world rules","The world model includes finite resources, decay, synthesis recipes, zones and economic constraints","The product surface includes agents, beings, chat, governance, marketplace, skills, studio and world routes"],
    stack:["Next.js","TypeScript","Execution engine","Prompt engine","Shared world rules"],
    live:null, source:null, year:"2026", featured:true, layout:2, accent:"#8c7cf0"
  },
  {
    id:"airadise", name:"Airadise", repo:"airadise", visibility:"Private", category:"Agent platform", status:"Active",
    tagline:"A local-first desktop agent and automation environment.",
    summary:"A Tauri desktop application plus reusable TypeScript packages for AI providers, prompts, execution, skills and shared runtime contracts. It includes persistent agents, workflows, local state, permissions, secure credentials, MCP integration, scheduling, multi-agent coordination and replay/evaluation infrastructure.",
    verified:["Tauri 2 desktop shell with React and Vite","SQLite local state and Stronghold-backed secret storage","Workflow, scheduling and webhook-trigger paths are represented in the runtime and tests","Provider routing and failover are separate runtime concerns rather than UI-only state"],
    stack:["Tauri 2","React","Vite","TypeScript","SQLite","Stronghold","MCP"],
    live:null, source:null, year:"2026", featured:true, layout:3, accent:"#50b4a8"
  },
  {
    id:"codebase-os", name:"Codebase OS", repo:"codebase--os", visibility:"Public", category:"Developer infrastructure", status:"Production contract",
    tagline:"A local software-change runtime for AI-assisted engineering.",
    summary:"Codebase OS combines repository scanning, a persistent typed relationship graph, dependency-first planning, transactional file mutation, durable engineering memory, isolated command execution, independent verification and conflict-safe rollback.",
    verified:["Generated, applied and verified are explicit distinct states","Mutation is transactional and verification is independent from model output","Repository intelligence is persisted in a typed graph","Completion is not reported when verification gates fail"],
    stack:["TypeScript","Node.js","SQLite","AST analysis","Sandboxed commands"],
    live:null, source:"https://github.com/dharan1007/codebase--os", year:"2026", featured:true, layout:4, accent:"#d7ff68"
  },
  {
    id:"spool", name:"SPOOL", repo:"spool", visibility:"Private", category:"Migration infrastructure", status:"v1.1.1",
    tagline:"Migration correctness infrastructure: dirty data in, typed and verified data out.",
    summary:"A local-first migration system with a browser studio and a bounded-memory local runner. The documented Gate B path binds source identity, target contracts, approvals, transactional batches, crash reconciliation, verification and a commit-bound receipt.",
    verified:["Browser Studio keeps row data local to the browser application path","The local runner targets an existing ordinary SQLite table under a deliberately narrow contract","Source snapshots, reconciliation evidence, fencing and receipts are part of the execution model","Ambiguous conversion and unsafe states fail closed"],
    stack:["Node.js","CSV streaming","SQLite","WebMCP surface","Verification receipts"],
    live:"https://spool-webmcp.vercel.app/", source:null, year:"2026", featured:true, layout:5, accent:"#49c7ff"
  },
  {
    id:"pact", name:"PACT", repo:"pact", visibility:"Private", category:"Agent integrity", status:"Active",
    tagline:"Release integrity and controlled transactions for consequential AI-agent actions.",
    summary:"PACT implements CAPTURE, COMPARE, PROVE and CONTROL around production agent releases, plus a transaction engine that binds preview, approval, one-shot commit, canonical verification and receipt generation.",
    verified:["Durable transaction state and canonical state are separate concerns","Approval is bound to the semantic plan and canonical version","HTTP, MCP and WebMCP surfaces share a canonical tool catalog","Release provenance, locks, diffs, drift and gates are represented in the implementation"],
    stack:["Node.js","Vercel Functions","MCP","WebMCP","Durable state","Release integrity"],
    live:"https://pact-webmcp.vercel.app", source:null, year:"2026", featured:true, layout:0, accent:"#ff7557"
  },
  {
    id:"kata", name:"KATA", repo:"kata", visibility:"Private", category:"Research tooling", status:"Live",
    tagline:"Teach a repeatable research workflow once, then expose it through deterministic tools.",
    summary:"KATA combines live scholarly search, a durable browser workspace, demonstration-derived workflow programs, browser/API interoperability diagnostics and one semantic engine surfaced through HTTPS, MCP, WebMCP, model schemas and CLI.",
    verified:["OpenAlex is the documented scholarly production connector","Connector and browser restrictions remain explicit failure or blocked states","State-changing operations are preview-bound","The same canonical semantics are exposed across UI, API, MCP, WebMCP and CLI"],
    stack:["JavaScript","OpenAlex","MCP","WebMCP","HTTPS API","CLI"],
    live:"https://kata-webmcp.vercel.app/", source:null, year:"2026", featured:true, layout:1, accent:"#f0d04b"
  },
  {
    id:"faultline", name:"FAULTLINE", repo:"faultline", visibility:"Private", category:"Browser debugging", status:"Live",
    tagline:"Reduce a real browser failure without changing what is failing.",
    summary:"A local-first causal browser debugging workbench that captures an authorized Playwright page, independently reproduces the failure, removes candidate HTML/CSS/JavaScript units under a deterministic oracle and keeps only reductions that preserve the failure.",
    verified:["A passing baseline is never imported as a failure","Unsupported or unsafe trials remain unresolved","Final candidates are re-verified against the same failure oracle","The documented claim is bounded 1-minimality over the tested semantic frontier, not global shortest-program optimality"],
    stack:["Playwright","Node.js","Browser capture","Deterministic oracle","CI integration"],
    live:"https://faultline-webmcp.vercel.app/", source:null, year:"2026", featured:true, layout:2, accent:"#ff5c5c"
  },
  {
    id:"stanius", name:"Stanius", repo:"stanius", visibility:"Private", category:"Quant research", status:"Research candidate",
    tagline:"A quantitative market-research workstation that keeps observations, models and evidence separate.",
    summary:"Stanius supports observed market history, technical state, relative-market analysis, calibrated uncertainty research, probabilistic future distributions and execution-aware validation. Its repository explicitly separates software readiness from evidence of predictive superiority.",
    verified:["Provider-backed observed data is separated from modeled outputs","Forecast outputs include uncertainty and model/prior weighting","Historical validation is point-in-time and baseline-aware","The project does not claim guaranteed trading profitability"],
    stack:["Python","Market-data providers","Forecast validation","Evidence ledger","Vercel"],
    live:"https://stanius.vercel.app", source:null, year:"2026", featured:true, layout:3, accent:"#9db2ff"
  },
  {
    id:"zachitan", name:"Zachitan v4.1", repo:"zachitan-v4", visibility:"Public", category:"Market research", status:"Research beta",
    tagline:"A source-first multi-asset market research terminal.",
    summary:"Zachitan combines provider-backed market data, provenance, experimental empirical forecasts, walk-forward validation, world-state evidence, news clustering, filings research, watchlists and recurring-investment analysis.",
    verified:["Observed, inferred, experimental, degraded, gated and unavailable states are separated","Forecasts expose baseline skill instead of manufacturing fallback confidence","Chronological validation uses later observations only","The project does not execute trades or promise predictive accuracy"],
    stack:["Python","Market data","Empirical forecasting","Walk-forward validation","Research UI"],
    live:"https://zachitan.vercel.app", source:"https://github.com/dharan1007/zachitan-v4", year:"2026", featured:true, layout:4, accent:"#53d6a1"
  },
  {
    id:"daish", name:"DAISH", repo:"daish", visibility:"Private", category:"Music systems", status:"Active",
    tagline:"Real-time music orchestration for live environments.",
    summary:"DAISH coordinates live music sessions through a NestJS backend, Next.js PWA, PostgreSQL, Redis, Socket.IO and Spotify integration, with host sessions and realtime orchestration.",
    verified:["Backend is NestJS with TypeORM and Socket.IO","Frontend is a Next.js 14 PWA","PostgreSQL and Redis are explicit production dependencies","Spotify credentials and public API URLs are handled as deployment configuration"],
    stack:["NestJS","Next.js","PostgreSQL","Redis","Socket.IO","Spotify Web API"],
    live:"https://daish.vercel.app", source:null, year:"2026", featured:true, layout:5, accent:"#76e16b"
  },
  {
    id:"maleu", name:"Maleu", repo:"maleu", visibility:"Private", category:"Social platform", status:"Legacy / superseded",
    tagline:"The earlier full-stack social platform that preceded the current RÆDIUS direction.",
    summary:"Maleu covers social publishing, short-form video, communities, messaging, learning, fitness, creator/business tools, advertising, discovery, media infrastructure and moderation across mobile, web, Supabase and Cloudflare infrastructure.",
    verified:["Expo / React Native mobile and Next.js web clients exist","Supabase PostgreSQL/Auth/Realtime and Cloudflare Worker/R2 infrastructure are documented","The repository itself warns that a screen, table or type is not evidence of release readiness"],
    stack:["Expo","React Native","Next.js","Supabase","Cloudflare Workers","R2"],
    live:null, source:null, year:"2026", featured:false, layout:0, accent:"#e85c55"
  },
  {
    id:"dvange", name:"Dvange (repo: fuy)", repo:"fuy", visibility:"Public", category:"Social / lifestyle", status:"Broad product codebase",
    tagline:"A broad social and lifestyle platform spanning web and mobile.",
    summary:"The fuy repository currently brands its product as Dvange and combines a Next.js web app with Expo mobile, Prisma/PostgreSQL and Supabase-backed infrastructure across social, chat, collaboration, activities, journaling, commerce, routes, fitness, moderation and privacy features.",
    verified:["Current package and native configuration use the Dvange identity","Web and mobile applications coexist in the same repository","The database model spans substantially more than authentication or a simple feed"],
    stack:["Next.js","Expo","React Native","Prisma","PostgreSQL","Supabase"],
    live:null, source:"https://github.com/dharan1007/fuy", year:"2025–26", featured:false, layout:1, accent:"#ff845e"
  },
  {
    id:"agri-ai", name:"Agri AI", repo:"agri-ai", visibility:"Public", category:"Applied AI", status:"Implemented platform",
    tagline:"Agricultural decision support across crop planning, disease inference and scheme discovery.",
    summary:"A multi-service agricultural assistant containing three independently deployable FastAPI services plus a Next.js web application, alongside model-training and local infrastructure assets.",
    verified:["Disease prediction, crop-calendar and scheme-discovery services are documented separately","Large image datasets are training/evaluation assets rather than the application architecture","The web layer is separate from the deployable FastAPI services"],
    stack:["FastAPI","Python","Next.js","ML inference","Training utilities"],
    live:null, source:"https://github.com/dharan1007/agri-ai", year:"2025–26", featured:false, layout:2, accent:"#7dbe72"
  },
  {
    id:"jed", name:"Smart Energy AI", repo:"jed", visibility:"Private", category:"Applied ML", status:"Research implementation",
    tagline:"Energy monitoring, forecasting, anomaly detection and optimization with a mobile client.",
    summary:"A Python/Flask and Flutter system combining energy monitoring, multi-model forecasting, anomaly detection and recommendation workflows.",
    verified:["README documents LightGBM, XGBoost, Random Forest and LSTM model paths","Flutter is used for the mobile application","REST and WebSocket interfaces are part of the documented system"],
    stack:["Python","Flask","Flutter","TensorFlow","LightGBM","XGBoost","SQLite"],
    live:null, source:null, year:"2025–26", featured:false, layout:3, accent:"#e7c85e"
  },
  {
    id:"trakiler", name:"FORM", repo:"trakiler", visibility:"Public", category:"Fitness tooling", status:"Live side project",
    tagline:"Private-first workout tracking and progression analytics.",
    summary:"FORM is a local-first browser training system for workout execution, repeatable programs, longitudinal progression, exercise intelligence and practical decision support, with optional cloud recovery.",
    verified:["The live app is published through GitHub Pages","Local-first storage is the default product boundary","The repository explicitly avoids medical or guaranteed-outcome claims","Optional Supabase is separate from the core local workflow"],
    stack:["Vanilla JavaScript","Local storage","Optional Supabase","GitHub Pages"],
    live:"https://dharan1007.github.io/trakiler/", source:"https://github.com/dharan1007/trakiler", year:"2026", featured:false, layout:4, accent:"#e4ee66"
  },
  {
    id:"ritchs", name:"Ritchs", repo:"ritchs", visibility:"Private", category:"Marketplace", status:"Production-oriented implementation",
    tagline:"A multi-role tailoring marketplace spanning mobile, public web, admin and edge backend.",
    summary:"Ritchs is a monorepo with Expo mobile, Next.js public/admin surfaces and a Cloudflare Worker backend using D1, R2, KV, Queues and Durable Objects.",
    verified:["OTP auth, role onboarding and provider discovery are documented as implemented","Orders, home visits, delivery tasks and signed R2 upload flows are represented","Complaints/admin moderation and provider verification are included","Payment processing is intentionally excluded in the current repository"],
    stack:["Expo","Next.js","Cloudflare Workers","D1","R2","KV","Queues","Durable Objects"],
    live:null, source:null, year:"2026", featured:false, layout:5, accent:"#ff6d77"
  },
  {
    id:"laya", name:"LAYA", repo:"laya", visibility:"Private", category:"Personal AI", status:"Active",
    tagline:"A persistent, context-aware, multimodal personal assistant platform.",
    summary:"LAYA is a FastAPI-based personal-assistant backend with persistent memory, tool and agent layers, Supabase PostgreSQL, a swappable reasoning-provider path and a Raspberry Pi client.",
    verified:["Backend is Python 3.13+ with FastAPI","Supabase PostgreSQL is the documented database","Voice path uses Faster-Whisper and Piper TTS","A Raspberry Pi client is part of the repository structure"],
    stack:["Python 3.13","FastAPI","Supabase","Gemini","Faster-Whisper","Piper TTS","SQLModel"],
    live:null, source:null, year:"2026", featured:true, layout:0, accent:"#7ec4ff"
  },
  {
    id:"nexus", name:"Nexus", repo:"nexus", visibility:"Private · Aphelion product", category:"Core computing", status:"Beta · 85%",
    tagline:"Aphelion's execution architecture for adaptive, recursive intelligence workloads.",
    summary:"Nexus is the execution foundation in Aphelion's core-computing layer. The public Aphelion architecture describes it as a new execution model for adaptive, recursive intelligence, designed around dynamic workloads rather than a conventional fixed execution path.",
    verified:["Listed by Aphelion in the Core Computing layer","Public Aphelion roadmap currently marks Nexus at 85% done and in beta","Aphelion states that Nexus's computation model directly informs Dot OS"],
    stack:["Execution architecture","Adaptive workloads","Recursive intelligence","Aphelion core computing"],
    live:"https://www.aphelion.life/", source:null, year:"2026", featured:true, layout:1, accent:"#c8a7ff"
  },
  {
    id:"resume-system", name:"Resume Optimization System", repo:"7th-gear", visibility:"Private", category:"Career tooling", status:"Implemented CLI",
    tagline:"Resume parsing, job matching, ATS analysis, optimization and PDF generation.",
    summary:"A Python-based resume system that parses PDF/Word documents, analyzes job descriptions, computes multi-factor matches, performs ATS checks and generates professionally formatted resume PDFs.",
    verified:["Resume and job-description parsing are documented","CLI commands cover optimize, analyze, match and batch workflows","The system explicitly states that optimization should not fabricate experience"],
    stack:["Python","spaCy","PDF / DOCX parsing","ATS analysis","PDF generation"],
    live:null, source:null, year:"2026", featured:false, layout:2, accent:"#f2af5c"
  },
  {
    id:"nishtha", name:"Nishtha", repo:"nishtha", visibility:"Private", category:"Repository recovery", status:"Broken superproject metadata",
    tagline:"A frontend/backend Git superproject whose submodule remotes need recovery.",
    summary:"The current repository contains Gitlink pointers for frontend and backend components but no committed .gitmodules file, so the authoritative component sources cannot be truthfully reconstructed from this repository alone.",
    verified:["Two Gitlink entries are present","The .gitmodules file needed to identify remotes is missing","The repository documentation intentionally refuses to invent the application architecture"],
    stack:["Git submodules / Gitlinks"], live:null, source:null, year:"2026", featured:false, layout:3, accent:"#9da2a8"
  },
  {
    id:"line-connect-grow", name:"Line Connect Grow", repo:"line-connect-grow", visibility:"Private", category:"Web scaffold", status:"Lovable scaffold",
    tagline:"A Vite/React project scaffold generated through Lovable.",
    summary:"The repository documents a Vite, TypeScript, React, shadcn-ui and Tailwind setup, but does not provide enough authoritative domain documentation to claim a finished product.",
    verified:["Vite, TypeScript and React are documented","shadcn-ui and Tailwind are part of the documented stack","The README is primarily a generated Lovable project guide"],
    stack:["Vite","TypeScript","React","shadcn-ui","Tailwind CSS"],
    live:null, source:null, year:"2025–26", featured:false, layout:4, accent:"#94b6d6"
  },
  {
    id:"sutle", name:"Sutle", repo:"sutle", visibility:"Private", category:"Mobile scaffold", status:"Scaffold",
    tagline:"An Expo / React Native scaffold, not yet a completed product.",
    summary:"The current master branch still contains the generated create-expo-app starter experience. Supabase environment keys are sketched, but the client dependency and application implementation are not present.",
    verified:["Expo 54 / React Native 0.81.4 starter code is present","Current primary routes are starter screens","Supabase configuration is preparatory rather than evidence of a working integration"],
    stack:["Expo 54","React Native","React 19","Expo Router","TypeScript"],
    live:null, source:null, year:"2026", featured:false, layout:5, accent:"#79b4c8"
  },
  {
    id:"noa-app", name:"NOA App", repo:"noa-app", visibility:"Private", category:"Mobile scaffold", status:"Scaffold",
    tagline:"An Expo application repository still documented as create-expo-app starter code.",
    summary:"The available repository documentation is the standard Expo starter guide. No product-specific capability is asserted here until the implementation is documented and verified.",
    verified:["Expo starter documentation is present","Product-specific architecture is not documented in the root README"],
    stack:["Expo","React Native"], live:null, source:null, year:"2026", featured:false, layout:0, accent:"#a8afb8"
  },
  {
    id:"maleu-reel-studio", name:"Maleu Reel Studio", repo:"maleu-reel-studio", visibility:"Private", category:"Generative media", status:"Limited repository documentation",
    tagline:"A generative-media research repository with insufficient root documentation for stronger public claims.",
    summary:"The repository exists, but its current root documentation does not establish a public product contract. This portfolio therefore lists it without inventing capabilities that cannot be verified from the repository.",
    verified:["Repository exists","Root README is not available in the current branch"], stack:[],
    live:null, source:null, year:"2026", featured:true, layout:1, accent:"#c1908f"
  },
  {
    id:"grelon", name:"GRELION", repo:"grelon", visibility:"Private", category:"Developer system", status:"Private / evolving",
    tagline:"A developer-system project kept high in the active build portfolio.",
    summary:"GRELION is a private developer-system project in the active portfolio. Its detailed architecture is not publicly documented, so the portfolio highlights its priority without fabricating implementation claims that are not supported by accessible evidence.",
    verified:["Private repository exists","Repository-backed implementation details remain private"], stack:[],
    live:null, source:null, year:"2026", featured:true, layout:2, accent:"#9bb59b"
  },
  {
    id:"dot-os", name:"Dot OS", repo:null, visibility:"Aphelion product", category:"Core computing", status:"In development · 20%",
    tagline:"The adaptive-intelligence operating layer in Aphelion's core-computing stack.",
    summary:"Dot OS is the adaptive-intelligence layer above Nexus in Aphelion's vertically integrated architecture. Aphelion's public product map positions Nexus as the execution foundation that informs Dot OS, with Dot OS supporting the higher platform, agentic and experience layers.",
    verified:["Listed by Aphelion in the Core Computing layer","Public Aphelion roadmap currently marks Dot OS at 20% done","Aphelion positions Nexus directly below Dot OS in the system architecture"],
    stack:["Adaptive intelligence","Core computing","Nexus integration","Aphelion ecosystem"],
    live:"https://www.aphelion.life/", source:null, year:"2026", featured:true, layout:3, accent:"#5b6cff"
  },
  {
    id:"raw", name:"RAW", repo:"raw", visibility:"Private", category:"Repository snapshot", status:"Undocumented",
    tagline:"A private repository with only a title-level README at present.",
    summary:"RAW is included in the complete GitHub inventory, but there is not enough repository documentation to make a responsible claim about its product purpose or architecture.",
    verified:["Repository exists","README currently contains only the repository title"], stack:[],
    live:null, source:null, year:"2025–26", featured:false, layout:3, accent:"#a3a3a3"
  },
  {
    id:"nistha", name:"Nistha", repo:"nistha", visibility:"Private", category:"Repository snapshot", status:"Undocumented",
    tagline:"A private repository with title-only documentation.",
    summary:"The repository is real, but the available root README does not establish a product scope. The portfolio therefore shows the repository without inventing features.",
    verified:["Repository exists","README currently contains only the repository title"], stack:[],
    live:null, source:null, year:"2025–26", featured:false, layout:4, accent:"#a7a7a7"
  },
  {
    id:"noa", name:"NOA", repo:"noa", visibility:"Private", category:"Repository snapshot", status:"Undocumented",
    tagline:"A private repository with title-only root documentation.",
    summary:"NOA is part of the GitHub project set, but its root documentation does not currently support a more specific public description.",
    verified:["Repository exists","README currently contains only the repository title"], stack:[],
    live:null, source:null, year:"2026", featured:false, layout:5, accent:"#b0b0b0"
  },
  {
    id:"reume-build", name:"Reume Build", repo:"reume-build", visibility:"Private", category:"Repository snapshot", status:"Undocumented",
    tagline:"A large private repository whose root README currently contains only its title.",
    summary:"The repository is included for completeness, but this portfolio does not infer a product architecture from its name or size.",
    verified:["Repository exists","Root README does not document the application"], stack:[],
    live:null, source:null, year:"2026", featured:false, layout:0, accent:"#b3a497"
  },
  {
    id:"agri-farm", name:"Agri Farm", repo:"agri-farm", visibility:"Private", category:"Agriculture repository", status:"Limited documentation",
    tagline:"A private agriculture-named repository with insufficient readable root documentation for a stronger claim.",
    summary:"Agri Farm is listed as an owned project, but the current README content does not establish enough implementation detail to responsibly describe the system.",
    verified:["Repository exists","Readable root documentation is insufficient"], stack:[],
    live:null, source:null, year:"2026", featured:false, layout:2, accent:"#86a66c"
  }
];

window.PRIORITY_PROJECT_IDS = [
  "raedius",
  "airadise",
  "arkhe",
  "codebase-os",
  "spool",
  "faultline",
  "laya",
  "daish",
  "grelon",
  "maleu-reel-studio",
  "nexus",
  "dot-os"
];

window.RESEARCH_HIGHLIGHT_IDS = ["zachitan"];

window.PROJECTS_BY_ID = Object.fromEntries(window.PROJECTS.map(project => [project.id, project]));
window.PORTFOLIO_META = {
  owner:"Poduvu Dharantej Reddy",
  shortName:"Dharantej Reddy",
  role:"Founder & sole builder, Aphelion · product engineer · AI systems builder",
  location:"Hyderabad, India",
  email:"dharan.poduvu@gmail.com",
  github:"https://github.com/dharan1007",
  resume:"/assets/Poduvu_Dharantej_Reddy_Resume.pdf"
};
