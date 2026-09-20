import { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams
} from 'react-router-dom';
import { HeroWave } from './components/HeroWave';
import { Reveal } from './components/Reveal';
import {
  getProjectById, orderedProjects, priorityProjectIds, projects, researchHighlightProject, type Project
} from './data/projects';

const flagshipIds = ['raedius', 'airadise', 'arkhe'];
const selectedIds = ['pact', 'kata', 'stanius', 'trakiler'];
const categories = ['All', 'AI & agents', 'Infrastructure', 'Products', 'Research', 'Other'];

function categoryGroup(project: Project) {
  const value = (project.category + ' ' + project.name).toLowerCase();
  if (/ai|agent|runtime|personal ai/.test(value)) return 'AI & agents';
  if (/infrastructure|migration|debugging|developer|core computing|integrity/.test(value)) return 'Infrastructure';
  if (/social|marketplace|audio|fitness|media|mobile/.test(value)) return 'Products';
  if (/research|quant|market/.test(value)) return 'Research';
  return 'Other';
}

function setTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  const links = [
    ['/', 'Home'],
    ['/projects', 'Projects'],
    ['/about', 'About'],
    ['/experience', 'Experience'],
    ['/contact', 'Contact']
  ];

  return (
    <header className="nav-wrap">
      <nav className="site-nav" aria-label="Primary">
        <Link className="nav-brand" to="/">PDR / 26</Link>
        <div className="nav-center">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
          ))}
        </div>
        <div className="nav-right">
          <span className="nav-place">HYD · IST</span>
          <button className="nav-menu-button" type="button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((value) => !value)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>
      <div id="mobile-nav" className={'mobile-nav ' + (open ? 'is-open' : '')} aria-hidden={!open}>
        {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>Poduvu Dharantej Reddy</span>
      <span>Hyderabad, India</span>
      <span>© 2026 / Built deliberately</span>
    </footer>
  );
}

function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className={'project-visual ' + (compact ? 'project-visual-compact' : '')} style={{ '--accent': project.accent } as React.CSSProperties}>
      <span className="project-visual-code">{project.priority ? String(project.priority).padStart(2, '0') : project.year}</span>
      <strong>{project.name}</strong>
      <span>{project.category}</span>
    </div>
  );
}

function ProjectCard({ project, variant = 'normal' }: { project: Project; variant?: 'normal' | 'flagship' | 'compact' | 'research' }) {
  return (
    <Link to={'/projects/' + project.id} className={'project-card project-card-' + variant} data-project-id={project.id}>
      <ProjectVisual project={project} compact={variant === 'compact'} />
      <div className="project-card-copy">
        <div className="project-card-meta"><span>{project.category}</span><span>{project.status}</span></div>
        <h3>{project.name}</h3>
        <p>{project.tagline}</p>
        <span className="card-arrow">Open case ↗</span>
      </div>
    </Link>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroWave />
      <div className="hero-meta mono hero-enter hero-enter-1">
        <span>Founder / Sole builder</span>
        <span>Aphelion · Product · AI systems</span>
        <span>Hyderabad / 2026</span>
      </div>
      <div className="hero-copy">
        <p className="hero-kicker hero-enter hero-enter-1">FOUNDER · ENGINEER · SYSTEMS BUILDER</p>
        <h1 id="hero-title" className="hero-title hero-enter hero-enter-2">
          <span>DHARANTEJ</span>
          <em>REDDY</em>
        </h1>
        <p className="hero-lede hero-enter hero-enter-3">
          I founded Aphelion and build its product stack end to end — alongside independent systems in AI, infrastructure and applied intelligence.
        </p>
        <div className="hero-actions hero-enter hero-enter-4">
          <Link className="button button-dark" to="/projects">Explore projects ↗</Link>
          <a className="button button-ghost" href="https://www.aphelion.life/" target="_blank" rel="noreferrer">Aphelion ↗</a>
        </div>
      </div>
      <div className="hero-foot mono hero-enter hero-enter-4">
        <span>33 systems / products catalogued</span>
        <span>Scroll to enter the work ↓</span>
      </div>
    </section>
  );
}

function HomePage() {
  setTitle('Dharantej Reddy — Systems, Products, Infrastructure');
  const ordered = orderedProjects();
  const flagships = flagshipIds.map((id) => getProjectById(id)).filter(Boolean) as Project[];
  const priority = priorityProjectIds.slice(3).map((id) => getProjectById(id)).filter(Boolean) as Project[];
  const selected = selectedIds.map((id) => getProjectById(id)).filter(Boolean) as Project[];

  return (
    <>
      <Hero />
      <section className="intro section-light">
        <Reveal>
          <div className="split-head">
            <p className="section-index mono">01 / Position</p>
            <div>
              <h2>One person, full-stack responsibility.</h2>
              <p>I design the product, write the systems, shape the interface, operate the infrastructure and verify what ships. The portfolio separates current products, production-oriented systems, research and incomplete work instead of flattening everything into the same claim.</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="aphelion-section">
        <div className="aphelion-orbit" aria-hidden="true"><span /><span /><span /></div>
        <Reveal>
          <div className="split-head split-head-dark">
            <p className="section-index mono">02 / Company</p>
            <div>
              <p className="eyebrow">Founder & sole builder / operator</p>
              <h2 className="aphelion-title">APHELION</h2>
              <p className="aphelion-lede">A vertically integrated product company spanning user experience, core computing and platform infrastructure. I build and run the stack myself.</p>
              <a className="text-link text-link-light" href="https://www.aphelion.life/" target="_blank" rel="noreferrer">Official site ↗</a>
            </div>
          </div>
        </Reveal>
        <div className="aphelion-grid">
          {[
            ['User experience', 'Dvange · DAISH', 'Life-OS experiences and public-audio intelligence.'],
            ['Core computing', 'Nexus · Dot OS', 'Execution architecture and adaptive intelligence.'],
            ['Platform infrastructure', 'S25 · Suttle · Swud', 'Healthcare, finance and mobility infrastructure.']
          ].map((item) => (
            <Reveal key={item[0]}>
              <article className="aphelion-cell">
                <span className="mono">{item[0]}</span>
                <h3>{item[1]}</h3>
                <p>{item[2]}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-light">
        <Reveal>
          <div className="section-heading">
            <p className="section-index mono">03 / Flagship systems</p>
            <h2>The work I push first.</h2>
            <p>Three current systems define the top of the portfolio: social product infrastructure, local-first agent infrastructure and an experimental AI runtime.</p>
          </div>
        </Reveal>
        <div className="flagship-grid">
          {flagships.map((project) => <Reveal key={project.id}><ProjectCard project={project} variant="flagship" /></Reveal>)}
        </div>
      </section>

      <section className="section priority-section">
        <Reveal>
          <div className="section-heading">
            <p className="section-index mono">04 / Priority</p>
            <h2>Systems with active gravity.</h2>
          </div>
        </Reveal>
        <div className="priority-grid">
          {priority.map((project) => <Reveal key={project.id}><ProjectCard project={project} variant="compact" /></Reveal>)}
        </div>
      </section>

      {researchHighlightProject && (
        <section className="section research-section">
          <Reveal>
            <div className="research-layout">
              <div>
                <p className="section-index mono">05 / Research highlight</p>
                <h2>Zachitan is evidence-first market research.</h2>
                <p>{researchHighlightProject.summary}</p>
                <Link className="button button-dark" to="/projects/zachitan">Open Zachitan ↗</Link>
              </div>
              <ProjectVisual project={researchHighlightProject} />
            </div>
          </Reveal>
        </section>
      )}

      <section className="section section-light">
        <Reveal>
          <div className="section-heading">
            <p className="section-index mono">06 / Selected additional work</p>
            <h2>More systems, without pretending every repository is equal.</h2>
          </div>
        </Reveal>
        <div className="selected-grid">
          {selected.map((project) => <Reveal key={project.id}><ProjectCard project={project} /></Reveal>)}
        </div>
        <Reveal><div className="all-projects-cta"><Link className="text-link" to="/projects">Browse all {ordered.length} projects ↗</Link></div></Reveal>
      </section>

      <section className="closing-cta">
        <Reveal>
          <p className="mono">NEXT / EXPERIENCE & CONTACT</p>
          <h2>Building from product intent to operational proof.</h2>
          <div className="hero-actions">
            <Link className="button button-dark" to="/experience">Experience ↗</Link>
            <Link className="button button-ghost" to="/contact">Contact ↗</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function ProjectsPage() {
  setTitle('Projects — Dharantej Reddy');
  const [filter, setFilter] = useState('All');
  const ordered = orderedProjects();
  const visible = useMemo(() => ordered.filter((project) => filter === 'All' || categoryGroup(project) === filter), [filter, ordered]);

  return (
    <div className="page page-projects">
      <PageHeader index="02 / Projects" title="SYSTEMS, NOT THUMBNAILS." lede="A complete catalogue of current products, infrastructure, research and repository states — ordered by what matters most now." />
      <div className="filter-bar" aria-label="Project filters">
        {categories.map((name) => <button key={name} className={filter === name ? 'is-active' : ''} onClick={() => setFilter(name)}>{name}</button>)}
      </div>
      <div className="catalogue-grid">
        {visible.map((project) => <Reveal key={project.id}><ProjectCard project={project} /></Reveal>)}
      </div>
    </div>
  );
}

function ProjectDetailPage() {
  const { projectId = '' } = useParams();
  const project = getProjectById(projectId);
  if (!project) return <NotFoundPage project />;
  setTitle((project?.name || 'Project') + ' — Dharantej Reddy');

  const ordered = orderedProjects();
  const index = ordered.findIndex((item) => item.id === project.id);
  const next = ordered[(index + 1) % ordered.length];

  return (
    <div className="page project-detail">
      <header className="project-detail-hero">
        <div>
          <p className="section-index mono">{project.category} / {project.year}</p>
          <h1>{project.name}</h1>
          <p>{project.tagline}</p>
          <div className="project-actions">
            {project.liveUrl && <a className="button button-dark" href={project.liveUrl} target="_blank" rel="noreferrer">Live surface ↗</a>}
            {project.sourceUrl && <a className="button button-ghost" href={project.sourceUrl} target="_blank" rel="noreferrer">Source ↗</a>}
          </div>
        </div>
        <ProjectVisual project={project} />
      </header>
      <section className="project-detail-body">
        <Reveal><div className="detail-block"><span className="mono">Context</span><p className="detail-big">{project.summary}</p></div></Reveal>
        <Reveal>
          <div className="detail-block">
            <span className="mono">Verified / documented</span>
            <div className="evidence-list">
              {project.verified.map((item, idx) => <div key={item}><span>{String(idx + 1).padStart(2, '0')}</span><p>{item}</p></div>)}
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="detail-block">
            <span className="mono">Stack</span>
            <div className="stack-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
        </Reveal>
      </section>
      <Link className="next-project" to={'/projects/' + next.id}><span className="mono">Next project</span><strong>{next.name}</strong><span>↗</span></Link>
    </div>
  );
}

function PageHeader({ index, title, lede }: { index: string; title: string; lede: string }) {
  return (
    <header className="page-header">
      <div className="page-ambient" aria-hidden="true" />
      <p className="section-index mono">{index}</p>
      <h1>{title}</h1>
      <p>{lede}</p>
    </header>
  );
}

function AboutPage() {
  setTitle('About — Dharantej Reddy');
  return (
    <div className="page">
      <PageHeader index="03 / About" title="BUILDING SYSTEMS, END TO END." lede="Founder of Aphelion, product engineer and AI systems builder in Hyderabad." />
      <section className="editorial-grid">
        <Reveal><aside className="mono">Founder & sole builder — Aphelion<br />Product engineer<br />AI systems builder<br />B.Tech AI & Data Science<br />Hyderabad, India</aside></Reveal>
        <div className="editorial-copy">
          <Reveal><p>I am Poduvu Dharantej Reddy. I build products and technical systems without separating product direction from implementation: interface, runtime, state, infrastructure and verification all stay connected.</p></Reveal>
          <Reveal><p>At Aphelion, the current public architecture spans Dvange and DAISH at the experience layer, Nexus and Dot OS in core computing, and S25, Suttle and Swud across platform infrastructure.</p></Reveal>
          <Reveal><p>Outside the company stack, the portfolio includes independent systems such as RÆDIUS, ARKHE, Codebase OS, SPOOL, FAULTLINE, LAYA, GRELION, Maleu Reel Studio and Zachitan.</p></Reveal>
        </div>
      </section>
      <section className="fact-grid">
        <Reveal><article><span className="mono">Education</span><h2>CBIT Hyderabad</h2><p>B.Tech in Artificial Intelligence & Data Science. Expected graduation: 2026.</p></article></Reveal>
        <Reveal><article><span className="mono">Company</span><h2>Aphelion</h2><p>Founder and sole builder/operator across the company product stack.</p></article></Reveal>
        <Reveal><article><span className="mono">Working model</span><h2>Evidence over theatre</h2><p>Canonical state, explicit mutation boundaries, recoverability and proof of completion matter more than surface-level claims.</p></article></Reveal>
      </section>
    </div>
  );
}

function ExperiencePage() {
  setTitle('Experience — Dharantej Reddy');
  const rows = [
    ['Current', 'Founder & Sole Builder', 'Aphelion', 'Founded and independently build and operate the product, platform and core-computing stack.'],
    ['2025 — present', 'React Native Developer Intern', 'Anshap Services Pvt Ltd', 'React Native and backend/API engineering on an AI voice and mental-health product using Django/FastAPI, REST, Firebase and NLP-oriented flows.'],
    ['2022 — 2026', 'B.Tech — AI & Data Science', 'CBIT Hyderabad', 'Undergraduate engineering alongside independent product and systems work.'],
    ['2024', 'Hackathon Winner', 'Aurora University', 'Winner.'],
    ['2023', 'Finalist', 'Smart India Hackathon · BITS AI', 'Selected competitive engineering work.']
  ];
  return (
    <div className="page">
      <PageHeader index="04 / Experience" title="WORK, STUDY, COMPETITION." lede="Formal experience and education, clearly separated from independent project work." />
      <section className="timeline">
        <div className="timeline-line" aria-hidden="true" />
        {rows.map((row) => (
          <Reveal key={row[0] + row[1]}>
            <article className="timeline-row">
              <span className="mono">{row[0]}</span>
              <div><h2>{row[1]}</h2><h3>{row[2]}</h3></div>
              <p>{row[3]}</p>
            </article>
          </Reveal>
        ))}
        <Reveal><a className="button button-dark" href="/assets/Poduvu_Dharantej_Reddy_Resume.pdf" target="_blank" rel="noreferrer">Open résumé ↗</a></Reveal>
      </section>
    </div>
  );
}

function ContactPage() {
  setTitle('Contact — Dharantej Reddy');
  return (
    <div className="page contact-page">
      <PageHeader index="05 / Contact" title="MAKE THE NEXT THING REAL." lede="For engineering, product systems, AI infrastructure, research and collaboration." />
      <section className="contact-list">
        {[
          ['Email', 'dharan.poduvu@gmail.com', 'mailto:dharan.poduvu@gmail.com'],
          ['GitHub', 'dharan1007', 'https://github.com/dharan1007'],
          ['Résumé', 'Open current résumé', '/assets/Poduvu_Dharantej_Reddy_Resume.pdf']
        ].map(([label, text, href]) => (
          <Reveal key={label}>
            <a href={href} target={href.startsWith('http') || label === 'Résumé' ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className="contact-link">
              <span className="mono">{label}</span><strong>{text}</strong><span>↗</span>
            </a>
          </Reveal>
        ))}
      </section>
    </div>
  );
}

function NotFoundPage({ project = false }: { project?: boolean }) {
  setTitle('Not found — Dharantej Reddy');
  return (
    <div className="page not-found">
      <PageHeader index="404" title={project ? 'PROJECT NOT FOUND.' : 'PAGE NOT FOUND.'} lede="The route exists outside the current portfolio map." />
      <Link className="button button-dark" to={project ? '/projects' : '/'}>Return ↗</Link>
    </div>
  );
}

function Shell() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteNav />
      <main id="main" className="route-frame" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export function App() {
  return <BrowserRouter><Shell /></BrowserRouter>;
}
