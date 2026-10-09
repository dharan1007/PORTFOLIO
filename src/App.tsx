import { useEffect, useState, type CSSProperties } from 'react';
import {
  BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams
} from 'react-router-dom';
import { CinematicHero } from './components/CinematicHero';
import { ScrollNarrative } from './components/ScrollNarrative';
import { EditorialImage, EditorialVideo } from './components/EditorialMedia';
import { licensedMediaCredits, type EditorialKey } from './data/media';
import { getDomain } from './data/domains';
import { domains, groupedProjects } from './data/domains';
import { Reveal } from './components/Reveal';
import { ProjectPreview } from './components/ProjectPreview';
import { ProjectStory } from './components/ProjectStory';
import {
  getProjectById, orderedProjects, priorityProjectIds, researchHighlightProject, type Project
} from './data/projects';

const flagshipIds = ['raedius', 'airadise', 'arkhe'];

function setTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

function SiteNav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); setHidden(false); }, [location.pathname]);
  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const update = () => {
      raf = 0;
      const next = window.scrollY;
      const difference = next - last;
      const focused = document.activeElement?.closest?.('#siteNavWrap');
      if (next < 110 || focused || open) setHidden(false);
      else if (Math.abs(difference) > 3) setHidden(difference > 0);
      last = next;
    };
    const onScroll = () => { if (!raf) raf = window.requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.cancelAnimationFrame(raf); };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        document.getElementById('nav-menu-button')?.focus();
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !document.getElementById('siteNavWrap')?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('keydown', onEscape);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, [open]);
  const links = [
    ['/', 'Home'],
    ['/projects', 'Projects'],
    ['/about', 'About'],
    ['/experience', 'Experience'],
    ['/contact', 'Contact']
  ];
  return (
    <header className={"nav-wrap " + (hidden && !open ? "nav-is-hidden" : "")} id="siteNavWrap" onFocusCapture={() => setHidden(false)}>
      <nav className="site-nav" aria-label="Primary navigation">
        <Link className="nav-brand" to="/" aria-label="Dharantej Reddy, home">DR / 26</Link>
        <div className="nav-center">
          <div className="nav-column"><NavLink to="/" end>HOME</NavLink><NavLink to="/projects">PROJECTS</NavLink></div>
          <div className="nav-column"><NavLink to="/about">ABOUT</NavLink><NavLink to="/experience">EXPERIENCE</NavLink></div>
          <div className="nav-column"><NavLink to="/contact">CONTACT</NavLink><a href="https://www.aphelion.life/" target="_blank" rel="noreferrer">APHELION ↗</a></div>
        </div>
        <p className="nav-tagline">DESIGN · ENGINEER · BUILD</p>
        <div className="nav-right">
          <span className="nav-place">HYDERABAD / INDIA</span>
          <NavLink className="nav-cta" to="/contact"><span>LET'S CONNECT</span><span aria-hidden="true">↗</span></NavLink>
          <button id="nav-menu-button" className="nav-menu-button" type="button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(value => !value)}>
            <span className="menu-lines" aria-hidden="true"><i /><i /></span>{open ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </nav>
      <div id="mobile-nav" className={'mobile-nav ' + (open ? 'is-open' : '')} aria-hidden={!open}>
        {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}<span aria-hidden="true">↗</span></NavLink>)}
        <a href="https://www.aphelion.life/" target="_blank" rel="noreferrer">Aphelion <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>Poduvu Dharantej Reddy</span>
      <span>Hyderabad, India</span>
      <span>© 2026 / <Link to="/about#media-credits">VISUAL CREDITS ↗</Link></span>
    </footer>
  );
}

function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  const field = getDomain(project) as EditorialKey;
  return <div className={'project-visual project-visual-real ' + (compact ? 'project-visual-compact' : '')} style={{ '--accent': project.accent } as CSSProperties}>
    <EditorialImage asset={field} className="project-illustration"/>
    <div className="project-visual-gradient" aria-hidden="true"/>
    <span className="project-visual-code">{project.priority ? String(project.priority).padStart(2, '0') : project.year}</span>
    <strong>{project.name}</strong>
    <span>{project.category}</span>
    <span className="illustration-disclosure">EDITORIAL PHOTOGRAPHY / NOT PRODUCT UI</span>
  </div>;
}

function ProjectCard({ project, variant = 'normal' }: { project: Project; variant?: 'normal' | 'flagship' | 'compact' | 'research' }) {
  return (
    <Link to={'/projects/' + project.id} className={'project-card project-card-' + variant} data-project-id={project.id}>
      {project.liveUrl ? <ProjectPreview project={project} /> : <ProjectVisual project={project} compact={variant === 'compact'} />}
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
  return <CinematicHero />;
}

function HomePage() {
  setTitle('Dharantej Reddy — Systems, Products, Infrastructure');
  const flagships = flagshipIds.map(id => getProjectById(id)).filter(Boolean) as Project[];
  const grouped = groupedProjects();
  return (
    <>
      <Hero />
      <section className="manifesto section-light">
        <div className="manifesto-index mono"><span>01 / THE POINT OF IT ALL</span><span>IDEAS ARE A START. SYSTEMS ARE THE WORK.</span></div>
        <Reveal><p className="manifesto-line">An idea is a beginning. <em>Making it real</em> is the interesting part.</p></Reveal>
        <div className="manifesto-foot"><span className="mono">FOUNDER · ENGINEER · BUILDER</span><p>I build across the boundaries of product design, software, infrastructure and experimental intelligence. Each system is documented for what it actually does — not just what it hopes to become.</p></div>
      </section>
      <ScrollNarrative />
      <section className="feature-exhibition" id="featured">
        <div className="exhibition-heading">
          <span className="mono">03 / THREE OPENING CHAPTERS</span>
          <h2>Different worlds. <em>One obsession.</em></h2>
          <p>Human connection, autonomous systems and new forms of computation. These are the three directions at the center of the work.</p>
        </div>
        <div className="feature-stages">
          {flagships.map((project,index)=>(
            <Reveal key={project.id}>
              <Link to={'/projects/'+project.id} className={'feature-stage feature-stage-'+project.id}>
                <div className="feature-stage-data"><span className="mono">CHAPTER / 0{index+1}</span><span className="mono">{project.category}</span></div>
                <div className={'feature-artwork feature-artwork-'+project.id} aria-hidden="true">
                  <div className="feature-real-media">
   {project.liveUrl ? <ProjectPreview project={project} large/> : project.id === 'airadise' ? <EditorialVideo asset="airadise"/> : <EditorialImage asset="intelligence"/>}
 </div>
                  <strong>{project.name}</strong>
                  <small>{String(index+1).padStart(2,'0')} — {project.year}</small>
                </div>
                <div className="feature-stage-copy"><div><span className="mono">{project.status}</span><h3>{project.tagline}</h3><p>{project.summary}</p></div><span className="feature-stage-arrow" aria-hidden="true">↗</span></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="company-strata">
        <div className="strata-header"><span className="mono">04 / THE COMPANY</span><a href="https://www.aphelion.life/" target="_blank" rel="noreferrer">APHELION — OFFICIAL SITE ↗</a></div>
        <div className="strata-main">
          <div><p className="mono">FOUNDER & BUILDER</p><h2>APHELION<span className="strata-period">.</span></h2><p>An interconnected product company working across experience, computation and platform infrastructure.</p><EditorialImage asset="company" className="company-photo" label/></div>
          <div className="strata-architecture" aria-label="Aphelion product layers">
            {[
              ['01','EXPERIENCE','Dvange · DAISH','Products people interact with'],
              ['02','COMPUTATION','Nexus · Dot OS','Execution and adaptive intelligence'],
              ['03','INFRASTRUCTURE','S25 · Suttle · Swud','The platform systems beneath']
            ].map(([n,name,examples,description])=><div className="strata-layer" key={name}><span>{n}</span><div><strong>{name}</strong><p>{description}</p></div><small>{examples}</small></div>)}
          </div>
        </div>
      </section>
      <section className="gateway-section">
        <div className="gateway-intro"><span className="mono">05 / EXPLORE BY DOMAIN</span><h2>A portfolio is not one pile of projects.</h2><p>The work is connected, but not interchangeable. Each field has its own problems, architecture and standards of evidence.</p></div>
        <div className="gateway-list">
          {grouped.map((group,index)=>(
            <Reveal key={group.id}><Link to={'/projects#'+group.id} className={'gateway-row gateway-row-'+(index%2)}>
              <span className="mono">{group.index} / {String(group.projects.length).padStart(2,'0')} PROJECTS</span>
              <strong>{group.title}</strong>
              <span className="gateway-explanation">{group.description}</span>
              <span className="gateway-arrow" aria-hidden="true">↗</span>
            </Link></Reveal>
          ))}
        </div>
      </section>
      {researchHighlightProject && <section className="research-spotlight">
        <div className="research-eyebrow mono"><span>06 / RESEARCH SPOTLIGHT</span><span>THE QUESTION OF UNCERTAINTY</span></div>
        <div><h2>What can the evidence <em>actually</em> tell us?</h2><div><EditorialImage asset="research" className="research-photo" label/><p>{researchHighlightProject.summary}</p><Link to="/projects/zachitan">READ THE ZACHITAN CASE ↗</Link></div></div>
      </section>}
      <section className="home-finale"><span className="mono">07 / CONTINUE THE STORY</span><h2>Make something <em>that matters.</em></h2><div><Link to="/experience">THE JOURNEY ↗</Link><Link to="/contact">START A CONVERSATION ↗</Link></div></section>
    </>
  );
}

function ProjectsPage() {
  setTitle('Projects — Dharantej Reddy');
  const groups = groupedProjects();
  const total = groups.reduce((sum, group) => sum + group.projects.length, 0);
  return <div className="page projects-experience">
    <header className="catalogue-prologue">
      <div className="catalogue-hero-index mono"><span>INDEX / 2026</span><span>{String(total).padStart(2,'0')} WORKS — SIX WORLDS</span></div>
      <div className="catalogue-title-wrap"><div><span className="mono">AN EXPLORATION OF WHAT I BUILD</span><h1>NOT ONE<br/><em>KIND OF WORK.</em></h1><p>From products connecting people to systems that reason, verify and transform information. Explore the work by its purpose, not by a wall of thumbnails.</p></div>
        <EditorialVideo asset="hero" className="catalogue-actual-video" priority/>
      </div>
      <div className="catalogue-prologue-foot mono"><span>BEGIN WITH A WORLD ↓</span><span>EVERY PROJECT HAS ITS OWN CASE STUDY</span></div>
    </header>
    <nav className="domain-index" aria-label="Project categories">
      <span className="mono">EXPLORE</span>
      {groups.map(group=><a href={'#'+group.id} key={group.id}><span>{group.index}</span>{group.short}</a>)}
    </nav>
    <div className="domain-chapters">
      {groups.map((group,i)=><section className={'domain-chapter domain-chapter-'+group.id} key={group.id} id={group.id} style={{'--chapter-accent':group.accent} as CSSProperties}>
        <div className="domain-kicker mono"><span>CHAPTER {group.index} / 06</span><span>{group.eyebrow}</span><span>{String(group.projects.length).padStart(2,'0')} WORKS</span></div>
        <div className="domain-lead">
          <div className="domain-number" aria-hidden="true">{group.index}</div>
          <div className="domain-description"><h2>{group.title}<span>.</span></h2><p>{group.description}</p><blockquote>{group.statement}</blockquote></div>
          <EditorialImage asset={group.id as EditorialKey} className="domain-photo" label/>
        </div>
        <div className="chapter-curation">
          <div className="chapter-feature">
            <span className="mono">THE OPENING PROJECT</span>
            {group.projects[0] && <ProjectCard project={group.projects[0]} variant="flagship"/>}
          </div>
          <div className="chapter-related">
            <div className="chapter-related-head"><span className="mono">OTHER WORK IN THIS WORLD</span><span className="mono">{String(Math.max(0,group.projects.length-1)).padStart(2,'0')} MORE</span></div>
            {group.projects.slice(1).map((project,j)=><Link className="chapter-project-row" to={'/projects/'+project.id} key={project.id} data-project-id={project.id}>
              <span className="mono">{String(j+2).padStart(2,'0')}</span>
              <span className="project-line-main"><strong>{project.name}</strong><small>{project.tagline}</small></span>
              <span className="chapter-project-status mono">{project.status}</span><span aria-hidden="true">↗</span>
            </Link>)}
            <div className="chapter-relation-end mono"><span>EVERY ENTRY LINKS TO ITS EVIDENCE & TECHNICAL STORY</span><span>↘</span></div>
          </div>
        </div>
        {i<groups.length-1&&<div className="chapter-transition" aria-hidden="true"><span>THE STORY CONTINUES</span><span className="transition-route">● ──────── ◇ ──────── ●</span><span>{groups[i+1].eyebrow}</span></div>}
      </section>)}
    </div>
    <div className="catalogue-end"><span className="mono">END OF THE INDEX</span><h2>Behind every entry: a system, not just a screenshot.</h2><Link to="/contact">LET'S BUILD SOMETHING ↗</Link></div>
  </div>;
}

function ProjectDetailPage() {
  const { projectId = '' } = useParams();
  const project = getProjectById(projectId);
  setTitle((project?.name || 'Project not found') + ' — Dharantej Reddy');
  if (!project) return <NotFoundPage project />;

  const ordered = orderedProjects();
  const index = ordered.findIndex((item) => item.id === project.id);
  const next = ordered[(index + 1) % ordered.length];

  return (
    <div className="page project-detail detailed-experience">
      <header className="project-detail-hero"><div className="detail-topline mono"><Link to="/projects">← ALL PROJECTS</Link><span>FIELD NOTES / {String(index + 1).padStart(2, "0")} OF {ordered.length}</span></div>
        <div>
          <p className="section-index mono">{project.category} / {project.year}</p>
          <h1>{project.name}</h1>
          <p>{project.tagline}</p>
          <div className="project-actions">
            {project.liveUrl && <a className="button button-dark" href={project.liveUrl} target="_blank" rel="noreferrer">Live surface ↗</a>}
            {project.sourceUrl && <a className="button button-ghost" href={project.sourceUrl} target="_blank" rel="noreferrer">Source ↗</a>}
          </div>
        </div>
        {project.liveUrl ? <ProjectPreview project={project} large/> : <ProjectVisual project={project} />}
      </header>
      <section className="project-detail-body"><div className="detail-side-index mono"><span>CONTEXT</span><span>STRUCTURE</span><span>EVIDENCE</span><span>IMPLEMENTATION</span></div>
        <Reveal>
          <div className="detail-block detail-intro">
            <span className="mono">Why it exists</span>
            <div>
              <p className="detail-big">{project.summary}</p>
              <div className="detail-meta-grid">
                <div><span className="mono">Current state</span><strong>{project.status}</strong></div>
                <div><span className="mono">Visibility</span><strong>{project.visibility}</strong></div>
                <div><span className="mono">Domain</span><strong>{project.category}</strong></div>
                <div><span className="mono">Year</span><strong>{project.year}</strong></div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="detail-block detail-case-block">
            <span className="mono">System profile</span>
            <div className="case-grid">
              <article><span className="mono">Core intent</span><h3>{project.tagline}</h3><p>The page describes only the behavior and state that is documented for this project; unsupported production claims are deliberately excluded.</p></article>
              <article><span className="mono">System surface</span><h3>{project.category}</h3><p>{project.summary}</p></article>
              <article><span className="mono">Evidence boundary</span><h3>{project.verified.length} documented checks</h3><p>{project.verified[0] ?? 'Repository documentation is intentionally limited.'}</p></article>
              <article><span className="mono">Implementation surface</span><h3>{project.stack.length ? project.stack.length + ' named technologies' : 'Documentation limited'}</h3><p>{project.stack.length ? project.stack.slice(0, 4).join(' · ') : 'The portfolio does not invent a stack where the repository does not document one.'}</p></article>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="detail-block detail-story-block">
            <span className="mono">How it works</span>
            <ProjectStory project={project} />
          </div>
        </Reveal>

        {project.liveUrl && (
          <Reveal>
            <div className="detail-block detail-live-block">
              <span className="mono">Live surface</span>
              <div>
                <ProjectPreview project={project} large />
                <p className="detail-caption">Interactive preview of the current public surface. The card remains a read-only preview; open the live surface for direct interaction.</p>
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="detail-block">
            <span className="mono">Verified / documented</span>
            <div className="evidence-list">
              {project.verified.length ? project.verified.map((item, idx) => <div key={item}><span>{String(idx + 1).padStart(2, '0')}</span><p>{item}</p></div>) : <div><span>01</span><p>Repository documentation is limited; this page intentionally avoids inventing unsupported production claims.</p></div>}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="detail-block">
            <span className="mono">Technical anatomy</span>
            <div>
              <div className="stack-list">{project.stack.length ? project.stack.map((item) => <span key={item}>{item}</span>) : <span>Repository documentation limited</span>}</div>
              <div className="architecture-strip">
                <span>Input / context</span><i>→</i><span>Core system</span><i>→</i><span>Verification / output</span>
              </div>
            </div>
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
  return <div className="page about-experience">
    <header className="about-opening">
      <div className="about-index mono"><span>03 / THE PERSON</span><span>HYDERABAD — INDIA</span></div>
      <span className="about-sideword" aria-hidden="true">DHR / 26</span>
      <h1>MADE OF<br/><em>CURIOSITY.</em></h1>
      <div className="about-opening-bottom"><p>I'm Poduvu Dharantej Reddy — a founder, product engineer and AI systems builder. I like the places where an idea has to become an actual working system.</p><span className="mono">SCROLL / THE WORKING PHILOSOPHY ↓</span></div>
      <EditorialImage asset="about" className="about-real-image"/>
    </header>
    <section className="about-statement">
      <span className="mono">WHO I AM / WHAT I DO</span>
      <Reveal><p>I build products and technical systems without separating product direction from implementation. <em>Interface, runtime, state, infrastructure and verification</em> are parts of one experience.</p></Reveal>
    </section>
    <section className="about-principles">
      <div className="about-principles-sticky"><span className="mono">THE WORKING PRINCIPLES</span><h2>FROM FIRST<br/><em>PRINCIPLES.</em></h2><p>Across independent projects and work at Aphelion, the method stays connected.</p></div>
      <div className="about-principles-list">
        {[
          ['01','Understand before building','Study the problem, its real constraints and the people or processes involved.'],
          ['02','Design the whole system','Shape user experience, state, interfaces, data and execution as one architecture.'],
          ['03','Build end to end','Move between frontend, backend, orchestration and infrastructure without treating them as unrelated work.'],
          ['04','Verify the result','Canonical state, explicit mutation boundaries, recoverability and proof of completion matter more than surface-level claims.']
        ].map(([n,title,description])=><Reveal key={n}><article className="about-principle"><span className="mono">{n}</span><h3>{title}</h3><p>{description}</p><div className="principle-motion" aria-hidden="true"><span/><span/><span/></div></article></Reveal>)}
      </div>
    </section>
    <section className="about-company">
      <span className="mono">THE COMPANY / APHELION</span><h2>ONE COMPANY.<br/><em>CONNECTED LAYERS.</em></h2>
      <p>At Aphelion, the public product architecture spans Dvange and DAISH at the experience layer, Nexus and Dot OS in core computing, and S25, Suttle and Swud across platform infrastructure.</p>
      <a href="https://www.aphelion.life/" target="_blank" rel="noreferrer">EXPLORE APHELION ↗</a>
    </section>
    <section className="about-facts">
      {[
        ['01 / EDUCATION','CBIT Hyderabad','B.Tech in Artificial Intelligence & Data Science, 2026.'],
        ['02 / COMPANY','Aphelion','Founder; product and systems engineering across the company stack.'],
        ['03 / INDEPENDENT WORK','RÆDIUS → ARKHE → BEYOND','Across the portfolio: RÆDIUS, ARKHE, Airadise, Codebase OS, SPOOL, FAULTLINE, LAYA, GRELION, Maleu Reel Studio, Zachitan and more.']
      ].map(([label,title,description])=><Reveal key={label}><article><span className="mono">{label}</span><h3>{title}</h3><p>{description}</p></article></Reveal>)}
    </section>
    <div className="about-next"><Link to="/experience">SEE THE TIMELINE ↗</Link><Link to="/projects">THE FULL WORK ↗</Link></div>
  </div>;
}

function ExperiencePage() {
  setTitle('Experience — Dharantej Reddy');
  const rows = [
    ['Now', 'Founder & Builder', 'Aphelion', 'Founded and build products, platform systems and core-computing infrastructure.'],
    ['2025 — present', 'React Native Developer Intern', 'Anshap Services Pvt Ltd', 'React Native and backend/API engineering on an AI voice and mental-health product using Django/FastAPI, REST, Firebase and NLP-oriented flows.'],
    ['2022 — 2026', 'B.Tech — AI & Data Science', 'CBIT Hyderabad', 'Undergraduate engineering alongside independent product and systems work.'],
    ['2024', 'Hackathon Winner', 'Aurora University', 'Winner of Aurora University hackathon.'],
    ['2023', 'Hackathon Finalist', 'Smart India Hackathon · BITS AI', 'Finalist in competitive engineering and AI hackathons.']
  ];
  return <div className="page experience-experience">
    <header className="experience-opening">
      <div className="mono experience-overline"><span>04 / AN ONGOING TIMELINE</span><span>THE WORK IS THE STORY</span></div>
      <h1>THE PATH<br/><em>ISN'T LINEAR.</em></h1>
      <div className="experience-opening-bottom"><span className="mono">WORK — EDUCATION — COMPETITION</span><p>From engineering education and competitions to building products professionally and founding Aphelion. The journey is still being written.</p></div>
      <EditorialImage asset="experience" className="experience-real-image"/>
    </header>
    <section className="experience-chronicle">
      <div className="chronicle-rail"><span className="mono">CHRONOLOGY / SELECTED MILESTONES</span><div className="chronicle-line" aria-hidden="true"/><strong>2023<span>→</span>26</strong><p>Each moment shaped a different part of the craft.</p></div>
      <div className="chronicle-events">
        {rows.map((row,index)=><Reveal key={row[0]+row[1]}><article className="chronicle-event">
          <div className="chronicle-top"><span className="mono">0{index+1} / 05</span><span className="mono">{row[0]}</span></div>
          <h2>{row[1]}</h2><h3>{row[2]}</h3><p>{row[3]}</p><span className="chronicle-endline" aria-hidden="true">━━━━ ●</span>
        </article></Reveal>)}
        <a className="chronicle-resume" href="/assets/Poduvu_Dharantej_Reddy_Resume.pdf" target="_blank" rel="noreferrer">OPEN THE RÉSUMÉ <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  </div>;
}

function ContactPage() {
  setTitle('Contact — Dharantej Reddy');
  return <div className="page contact-experience">
    <header className="contact-opening">
      <div className="contact-topline mono"><span>05 / GET IN TOUCH</span><span>FOR PRODUCTS, ENGINEERING & RESEARCH</span></div>
      <EditorialImage asset="contact" className="contact-real-image"/>
      <span className="contact-mini mono">AN OPEN LINE BETWEEN AN IDEA AND ITS NEXT STEP</span>
      <h1>GOOD THINGS<br/>START WITH<br/><em>A CONVERSATION.</em></h1>
      <a className="contact-main-email" href="mailto:dharan.poduvu@gmail.com"><span>WRITE AN EMAIL</span><strong>dharan.poduvu@gmail.com</strong><span aria-hidden="true">↗</span></a>
    </header>
    <section className="contact-connections">
      <div><span className="mono">OTHER CONNECTIONS</span><h2>Find the work.<br/>Follow the thinking.</h2></div>
      <div className="contact-paths">
        <a href="https://github.com/dharan1007" target="_blank" rel="noreferrer"><span className="mono">01 / GITHUB</span><strong>View the repositories</strong><span>↗</span></a>
        <a href="/assets/Poduvu_Dharantej_Reddy_Resume.pdf" target="_blank" rel="noreferrer"><span className="mono">02 / RÉSUMÉ</span><strong>Read the experience</strong><span>↗</span></a>
        <a href="https://www.aphelion.life/" target="_blank" rel="noreferrer"><span className="mono">03 / APHELION</span><strong>Explore the company</strong><span>↗</span></a>
        <Link to="/projects"><span className="mono">04 / PORTFOLIO</span><strong>Explore the systems</strong><span>↗</span></Link>
      </div>
    </section>
  </div>;
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
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' }));
    } else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname, location.hash]);

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
