import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import { animate } from "animejs";

import Lenis from "lenis";

import CinematicStage from "./CinematicStage.jsx";

import "./scene-effects.css";
import ProjectsSection from "./ProjectsSection.jsx";

import SignalHero from "./SignalHero.jsx";

import EducationSection from "./EducationSection.jsx";

import ExperienceSection from "./ExperienceSection.jsx";

import CertificationsSection from "./CertificationsSection.jsx";

import data from "./project-data.json";

import ContactSection from "./ContactSection";

import PremiumBackdrop from "./PremiumBackdrop.jsx";

import {
  chapters,
  shots,
  featuredIds,
  storyAt,
  smooth,
  updateContactSpan,
  updateSectionSpan,
} from "./story.js";

import "./cinematic.css";

const linkedIn = "https://www.linkedin.com/in/dharantej-reddy1727185/";

const contacts = [
  ["Email", "mailto:dharan.poduvu@gmail.com", "dharan.poduvu@gmail.com"],

  ["Phone", "tel:+918639961561", "+91 86399 61561"],

  ["LinkedIn", linkedIn, "Professional profile"],

  ["GitHub", "https://github.com/dharan1007", "dharan1007"],
];

const External = ({ href, children, ...props }) => (
  <a
    href={href}

    {...(href?.startsWith("https:")
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {})}

    {...props}
  >
    {children}

    <span aria-hidden="true"> ↗</span>
  </a>
);

function Details({ shot }) {
  return (
    <>
      <p className="eyebrow">{shot.subtitle}</p>

      <h1>{shot.title}</h1>

      <p className="description">{shot.description}</p>

      {shot.stack && (
        <ul className="tech-pills" aria-label="Technology stack">
          {shot.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}

      <div className="scene-links">
        {shot.liveUrl && <External href={shot.liveUrl}>Visit project</External>}

        {shot.sourceUrl && <External href={shot.sourceUrl}>Source</External>}

        {shot.id === "about" && (
          <External href={linkedIn}>More about me</External>
        )}

        {shot.id === "certifications" && (
          <External href={linkedIn}>View professional profile</External>
        )}

        {shot.id === "airadise" && (
          <External href="https://www.aphelion.life/products">
            Explore at Aphelion
          </External>
        )}

        {shot.id === "aphelion" && (
          <External href="https://www.aphelion.life/">
            Discover Aphelion
          </External>
        )}
      </div>

      {shot.id === "contact" && (
        <div className="contact-lines">
          {contacts.map(([label, url, value]) => (
            <External key={label} href={url}>
              <small>{label}</small>

              {value}
            </External>
          ))}
        </div>
      )}

      {shot.id === "aphelion" && (
        <p className="product-line">RÆDIUS · Airadise · ARKHE · Dot OS</p>
      )}
    </>
  );
}

function Archive({ close }) {
  const dialog = useRef();

  useEffect(() => {
    dialog.current.showModal();

    return () => dialog.current?.close();
  }, []);

  return (
    <dialog
      className="archive-dialog"

      ref={dialog}

      onCancel={close}

      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="archive-heading">
        <div>
          <p className="eyebrow">Beyond the six featured projects</p>

          <h2>The project archive.</h2>
        </div>

        <button onClick={close} autoFocus>
          Close ×
        </button>
      </div>

      <div className="archive-grid">
        {data.projects

          .filter((p) => !featuredIds.includes(p.id))

          .map((p) => {
            const repo = data.repositories.find((r) => r.name === p.repo);

            return (
              <article key={p.id}>
                <p className="eyebrow">{p.category}</p>

                <h3>{p.name}</h3>

                {p.availability && (
                  <p className="availability">{p.availability}</p>
                )}

                <p>{p.tagline || p.summary}</p>

                <ul className="tech-pills">
                  {p.stack?.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>

                <div className="scene-links">
                  {p.liveUrl && (
                    <External href={p.liveUrl}>
                      {p.liveLabel || "Website"}
                    </External>
                  )}

                  {repo?.visibility === "public" && (
                    <External href={repo.url}>Repository</External>
                  )}
                </div>
              </article>
            );
          })}
      </div>

      <p className="archive-note">Additional repositories</p>

      <div className="repo-links">
        {data.repositories

          .filter((r) => !data.projects.some((p) => p.repo === r.name))

          .map((r) =>
            r.visibility === "public" ? (
              <External key={r.name} href={r.url}>
                {r.name}
              </External>
            ) : (
              <span key={r.name}>
                {r.name} <small>Private</small>
              </span>
            ),
          )}
      </div>
    </dialog>
  );
}

export default function CinematicApp() {
  // Layout selection must not replace interactive projects with the obsolete reading page.
  const reduced = false;

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem("portfolio-sidebar");

      return saved ? saved === "open" : innerWidth > 760;
    } catch {
      return innerWidth > 760;
    }
  });

  const toggleRef = useRef(null);

  const [, layoutChanged] = useState(0);

  const measureContact = useCallback((height) => {
    const previous = shots.at(-1).start * innerHeight;

    if (updateContactSpan(height / Math.max(1, innerHeight))) {
      const shift = shots.at(-1).start * innerHeight - previous;

      if (window.scrollY >= previous - 1 && Math.abs(shift) > 0.5)
        window.scrollBy({ top: shift, behavior: "instant" });

      layoutChanged((n) => n + 1);
    }
  }, []);

  useLayoutEffect(() => {
    if (reduced) return;

    const measure = () => {
      let changed = false;

      const page = window.scrollY / Math.max(1, innerHeight);

      const anchor = shots[storyAt(page).index];

      const previousStart = anchor.start;

      document.querySelectorAll(".native-chapter").forEach((node) => {
        if (node.id === "projects") {
          const projects = shots.filter(shot => shot.kind === "project");
          const span = node.getBoundingClientRect().height / Math.max(1, innerHeight) / projects.length;
          projects.forEach(shot => { changed = updateSectionSpan(shot.id, span) || changed; });
          return;
        }
        changed =
          updateSectionSpan(
            node.id,
            node.getBoundingClientRect().height / Math.max(1, innerHeight),
          ) || changed;
      });

      if (changed) {
        const shift = (anchor.start - previousStart) * innerHeight;

        if (Math.abs(shift) > 0.5)
          window.scrollBy({ top: shift, behavior: "instant" });

        layoutChanged((n) => n + 1);
      }
    };

    const observer = new ResizeObserver(measure);

    document
      .querySelectorAll(".native-chapter")
      .forEach((node) => observer.observe(node));

    measure();

    return () => observer.disconnect();
  }, [reduced]);

  const [state, setState] = useState(() => storyAt(0)),
    [loading, setLoading] = useState({ loaded: 0, total: 0, errors: [] }),
    [archive, setArchive] = useState(false),
    [notice, setNotice] = useState("");

  const lenis = useRef(),
    caption = useRef(),
    active = shots[state.active] || shots[0];

  useEffect(() => {
    try {
      localStorage.setItem(
        "portfolio-sidebar",

        sidebarOpen ? "open" : "closed",
      );
    } catch {}
  }, [sidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const key = (e) => {
      if (document.querySelector("dialog[open]")) return;

      if (e.key === "Escape") {
        setSidebarOpen(false);

        toggleRef.current?.focus();
      }

      if (innerWidth <= 760 && e.key === "Tab") {
        const nodes = [
          toggleRef.current,

          ...document.querySelectorAll(
            "#chapter-navigation a,#chapter-navigation button",
          ),
        ].filter(Boolean);

        const index = nodes.indexOf(document.activeElement);

        e.preventDefault();

        nodes[
          (index + (e.shiftKey ? -1 : 1) + nodes.length) % nodes.length
        ]?.focus();
      }
    };

    window.addEventListener("keydown", key);

    return () => window.removeEventListener("keydown", key);
  }, [sidebarOpen]);

  useEffect(() => {
    document.documentElement.classList.add("journey-html");

    return () => document.documentElement.classList.remove("journey-html");
  }, []);

  useEffect(() => {
    if (reduced) return;

    const scroll = new Lenis({
      lerp: 0.085,

      smoothWheel: true,

      syncTouch: false,

      autoRaf: true,

      prevent: (node) => node.closest("dialog,.edu-mobile-paper"),
    });

    lenis.current = scroll;

    return () => {
      scroll.destroy();

      lenis.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;

    const node = caption.current;

    if (!node) return;

    const a = animate(node, {
      translateY: [18, 0],

      duration: 650,

      ease: "outQuart",
    });

    return () => a.cancel();
  }, [state.active, reduced]);

  useEffect(() => {
    if (!reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries

          .filter((entry) => entry.isIntersecting)

          .sort(
            (a, b) => b.intersectionRect.height - a.intersectionRect.height,
          )[0];

        if (!visible) return;

        const shot = shots.find((s) => visible.target.id === `reading-${s.id}`);

        if (shot) setState(storyAt(shot.start));
      },

      { rootMargin: "-35% 0px -55% 0px" },
    );

    document

      .querySelectorAll(
        ".reading-chapter,.reading-contact-shell,.reading-aphelion-shell,.reading-native-shell",
      )

      .forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    const change = () => {
      const id = location.hash.slice(1);

      if (id) go(id, true);
    };

    change();

    window.addEventListener("hashchange", change);

    return () => window.removeEventListener("hashchange", change);
  }, [reduced]);

  function go(id, instant = false) {
    const shot =
      shots.find((s) => s.id === id) || shots.find((s) => s.chapter === id);

    if (!shot) return;

    if (reduced) {
      document

        .getElementById(`reading-${shot.id}`)

        ?.scrollIntoView({ behavior: "instant" });

      return;
    }

    const top = shot.index ? Math.ceil(shot.start * innerHeight) + 1 : 0;

    if (lenis.current)
      lenis.current.scrollTo(top, { immediate: instant, duration: 1.3 });
    else window.scrollTo({ top, behavior: instant ? "instant" : "smooth" });
  }

  function navigate(e, id) {
    e.preventDefault();

    history.replaceState(null, "", `#${id}`);

    go(id);

    if (innerWidth <= 760) {
      setSidebarOpen(false);

      toggleRef.current?.focus({ preventScroll: true });
    }
  }

  function ready(s) {
    setLoading(s);

    if (s.failed) {
      setReduced(true);

      setNotice(
        "The interactive scene is unavailable on this device. All content is available below.",
      );
    }
  }

  return (
    <div
      className={`journey ${reduced ? "reading-mode" : "cinema-mode"} ${sidebarOpen ? "nav-expanded" : "nav-collapsed"}`}

      data-current={active.chapter}

      data-position={state.position.toFixed(5)}

      data-contact-pages={shots.find((s) => s.id === "contact").span.toFixed(5)}

      data-assets={`${loading.loaded}/${loading.total}`}

      data-image-errors={loading.errors?.length || 0}
    >
      <PremiumBackdrop paused={reduced} />

      <a
        className="skip-content"

        href={reduced ? "#reading-about" : "#chapter-navigation"}
      >
        Skip to content
      </a>

      <header className="film-header">
        <a
          className="wordmark"

          href="#about"

          onClick={(e) => navigate(e, "about")}
        >
          <span className="portfolio-monogram">dtr.p</span>
          <span className="sr-only">Dharantej Reddy — home</span>
        </a>

        <p>Engineer. Founder. In pursuit.</p>

        <div className="header-actions">
          <External href="mailto:dharan.poduvu@gmail.com">Let’s talk</External>
        </div>
      </header>

      <div className="sidebar-edge-control">
        <button
          ref={toggleRef}
          className="sidebar-toggle"
          aria-label={sidebarOpen ? "Collapse navigation" : "Expand navigation"}
          aria-controls="chapter-navigation"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((v) => !v)}
        >
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path
              d="M3 4h14v12H3zM7 4v12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d={sidebarOpen ? "m12 8-2 2 2 2" : "m10 8 2 2-2 2"}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </button>
      </div>

      {sidebarOpen && (
        <button
          className="navigation-scrim"

          onClick={() => setSidebarOpen(false)}

          aria-label="Close navigation"

          tabIndex={-1}
        />
      )}

      <aside
        className="chapter-sidebar"

        id="chapter-navigation"

        tabIndex="-1"

        inert={!sidebarOpen}
      >
        <p className="sidebar-label">INDEX / PORTFOLIO</p>

        <nav aria-label="Portfolio chapters">
          <p className="tree-root">
            <span aria-hidden="true">▾</span> dharantej/
          </p>

          {chapters.map(([id, label], i) => (
            <div className="tree-chapter" key={id}>
              <a
                href={`#${id}`}

                className={active.chapter === id ? "current" : ""}

                aria-current={active.chapter === id ? "location" : undefined}

                onClick={(e) => navigate(e, id)}
              >
                <span className="folder-icon" aria-hidden="true" />

                <span>{label}</span>

                <small>{String(i + 1).padStart(2, "0")}</small>
              </a>

              {id === "projects" && (
                <div className="tree-projects">
                  {shots

                    .filter((s) => s.kind === "project")

                    .map((s) => (
                      <a
                        href={`#${s.id}`}

                        key={s.id}

                        className={active.id === s.id ? "selected" : ""}

                        onClick={(e) => navigate(e, s.id)}
                      >
                        <span aria-hidden="true">└</span>

                        {s.title}
                      </a>
                    ))}

                  <button onClick={() => setArchive(true)}>
                    └ Project archive ↗
                  </button>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <span className="status-dot" /> Building at Aphelion
          <External href="https://github.com/dharan1007">GitHub</External>
        </div>
      </aside>

      {!reduced && (
        <>
          <CinematicStage
            reduced={reduced}

            onState={setState}

            onReady={ready}
          />

          {active.id === "aphelion" && (
            <div className="aphelion-film-frame">
              <iframe
                src="/aphelion/index.html"

                title="Aphelion — technology with intent"

                allow="autoplay; fullscreen"
              />
            </div>
          )}

          <main
            className="story-scroll"

            aria-label="Scroll through the portfolio"
          >
            {shots.map((s) => {
              if (s.kind === "project") {
                if (s.id !== "raedius") return null;
                const projects = shots.filter((shot) => shot.kind === "project");
                return <ProjectsSection key="project-gallery" projects={projects} renderProject={project => <>
                  <External className="project-showcase-preview" href={project.liveUrl || project.sourceUrl} aria-label={`Open ${project.title}`}><img src={project.preview} alt={`${project.title} website`} loading="lazy" /></External>
                  <div className="project-showcase-details"><Details shot={project} /></div>
                </>} />;
              }
              return <section key={s.id} id={s.id} className={`story-spacer ${s.id === "contact" ? "contact-shot" : ""} ${["about", "experience", "education", "certifications"].includes(s.id) ? `native-chapter native-${s.id}` : ""}`} style={["about","experience","education","certifications","contact"].includes(s.id) ? undefined : { height: `${s.span * 100}vh` }} aria-label={`${s.title} — ${s.subtitle}`}>
                {s.id === "about" ? <SignalHero paused={reduced} onNavigate={go} /> : s.id === "experience" ? <ExperienceSection paused={reduced} /> : s.id === "education" ? <EducationSection paused={reduced} /> : s.id === "certifications" ? <CertificationsSection paused={reduced} /> : s.id === "contact" ? <ContactSection paused={reduced} onMeasure={measureContact} /> : <span className="sr-only">{s.description}</span>}
              </section>;
            })}
          </main>

          <div className="film-bottom">
            <span>
              SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
            </span>

            <div
              className="film-progress"

              role="progressbar"

              aria-label="Story progress"

              aria-valuenow={Math.round(state.progress * 100)}

              aria-valuemin="0"

              aria-valuemax="100"
            >
              <i style={{ transform: `scaleX(${state.progress})` }} />
            </div>

            <span>{active.chapter.toUpperCase()}</span>
          </div>

          {loading.total > 0 && loading.loaded < loading.total && (
            <div className="asset-status" role="status">
              Preparing the scenes{" "}
              {Math.round((loading.loaded / loading.total) * 100)}%
            </div>
          )}
        </>
      )}

      {reduced && (
        <main className="reading-content">
          {shots.map((s) =>
            ["about", "experience", "education", "certifications"].includes(
              s.id,
            ) ? (
              <div
                key={s.id}
                id={`reading-${s.id}`}
                className="reading-native-shell"
              >
                {s.id === "about" ? (
                  <SignalHero paused onNavigate={go} />
                ) : s.id === "experience" ? (
                  <ExperienceSection paused />
                ) : s.id === "education" ? (
                  <EducationSection paused />
                ) : (
                  <CertificationsSection paused />
                )}
              </div>
            ) : s.id === "contact" ? (
              <div
                id="reading-contact"

                className="reading-contact-shell"

                key={s.id}
              >
                <ContactSection paused />
              </div>
            ) : s.id === "aphelion" ? (
              <div
                id="reading-aphelion"

                className="reading-aphelion-shell"

                key={s.id}
              >
                <iframe
                  src="/aphelion/index.html"

                  title="Aphelion — technology with intent"

                  loading="lazy"
                />
              </div>
            ) : (
              <section
                className={`reading-chapter reading-${s.kind}`}

                key={s.id}

                id={`reading-${s.id}`}
              >
                <div className="reading-picture">
                  {s.kind === "portrait" ? (
                    <span />
                  ) : (
                    <img
                      src={
                        s.kind === "portrait"
                          ? "/assets/01-portrait-v2.webp"
                          : s.preview || s.background
                      }

                      alt={
                        s.kind === "project"
                          ? `${s.title} — ${s.id === "airadise" ? "Aphelion product context" : "actual website capture"}`
                          : ""
                      }

                      loading={s.index ? "lazy" : "eager"}
                    />
                  )}
                </div>

                <div>
                  <span className="scene-number">
                    {String(s.index + 1).padStart(2, "0")}
                  </span>

                  <Details shot={s} />

                  {s.id === "faultline" && (
                    <button
                      className="archive-trigger"

                      onClick={() => setArchive(true)}
                    >
                      Explore the project archive ↗
                    </button>
                  )}
                </div>
              </section>
            ),
          )}
        </main>
      )}

      {notice && (
        <div className="scene-notice" role="status">
          {notice}

          <button onClick={() => setNotice("")} aria-label="Dismiss notice">
            ×
          </button>
        </div>
      )}

      {loading.errors?.length > 0 && !loading.failed && !reduced && (
        <div className="scene-notice" role="status">
          A scene image could not load.{" "}
          <button onClick={() => setReduced(true)}>Open reading view</button>
        </div>
      )}

      {archive && <Archive close={() => setArchive(false)} />}

      <div className="sr-only" aria-live="polite">
        {active.title}
      </div>
    </div>
  );
}

