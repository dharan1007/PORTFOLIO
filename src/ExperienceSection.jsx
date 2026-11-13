import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { experienceArchive as archive } from "./experience-data.js";
import "./experience-section.css";

function EngineeringIndex() {
  const [category, setCategory] = useState(archive.stack[0].category);
  const group = archive.stack.find((entry) => entry.category === category);
  return (
    <div className="exp-stack-index">
      <h4>Engineering index</h4>
      <div
        className="exp-stack-categories"
        role="group"
        aria-label="Engineering technology categories"
      >
        {archive.stack.map((entry) => (
          <button
            key={entry.category}
            type="button"
            aria-pressed={category === entry.category}
            onClick={() => setCategory(entry.category)}
          >
            {entry.category}
          </button>
        ))}
      </div>
      <p className="exp-stack-tools" aria-live="polite">
        {group.tools.join(" / ")}
      </p>
      <p className="exp-fine-print">
        Documented tools across the broader engineering practice; usage varies
        by product and role.
      </p>
    </div>
  );
}

function ProductArchitecture() {
  const [selected, setSelected] = useState(null);
  return (
    <div
      className="exp-architecture"
      aria-label="Illustrative product architecture"
    >
      <p className="exp-kicker">Engineering artifact / 01</p>
      <div className="exp-architecture-path">
        {archive.architecture.map((layer, index) => (
          <button
            key={layer}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(selected === index ? null : index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {layer}
            <i aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="exp-fine-print">
        Illustrative engineering layers, not an exact product architecture or
        product screenshot.
      </p>
    </div>
  );
}

function ExperienceRecord({ record, index, elementRef }) {
  return (
    <article
      ref={elementRef}
      className={`exp-record exp-record--${record.id}`}
      id={`experience-${record.id}`}
      aria-labelledby={`experience-${record.id}-heading`}
    >
      <div className="exp-record-inner" data-exp-reveal>
        <div className="exp-record-topline">
          <span>Record {String(index + 1).padStart(2, "0")}</span>
          <span>
            {record.duration ||
              (record.id === "anshap"
                ? "Internship record"
                : "Product development")}
          </span>
        </div>
        <p className="exp-kicker">{record.category}</p>
        <h3 id={`experience-${record.id}-heading`}>{record.organization}</h3>
        <p className="exp-role">{record.role}</p>
        {record.dateLabel && (
          <p className="exp-date">
            <time dateTime={record.startDate}>
              {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(record.startDate))}
            </time>
            <span aria-hidden="true">&nbsp;&mdash;&nbsp;</span>
            <time dateTime={record.endDate}>
              {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(record.endDate))}
            </time>
          </p>
        )}
        <p className="exp-overview">{record.overview}</p>
        <div className="exp-product-records">
          {record.products.map((product, i) => (
            <div key={product.name} className="exp-product-record">
              <span className="exp-product-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="exp-kicker">{product.label}</p>
                <h4>{product.name}</h4>
                <p>{product.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="exp-responsibilities">
          <h4>Engineering responsibilities</h4>
          <ul>
            {record.responsibilities.map((responsibility) => (
              <li key={responsibility}>{responsibility}</li>
            ))}
          </ul>
        </div>
        {record.id === "aphelion" ? (
          <EngineeringIndex />
        ) : (
          <div className="exp-record-tools">
            <h4>Technical implementation</h4>
            <p>{record.technologies.join(" / ")}</p>
          </div>
        )}
        <div className="exp-outcomes">
          <h4>Documented work</h4>
          <ul>
            {record.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </div>
        {record.document && (
          <a
            className="exp-original-record"
            href={record.document}
            target="_blank"
            rel="noopener noreferrer"
          >
            View original internship certificate &nearr;
          </a>
        )}
        {record.mentor && (
          <p className="exp-mentor">
            Mentor <span>{record.mentor.name}</span> / {record.mentor.title}
          </p>
        )}
        <div className="exp-record-foot">
          <span>{index ? "Internship record" : "Founder-led engineering"}</span>
          <span>Dharantej Reddy</span>
        </div>
      </div>
      {record.id === "aphelion" && (
        <aside className="exp-artifact">
          <ProductArchitecture />
        </aside>
      )}
      {record.id === "anshap" && (
        <aside
          className="exp-mobile-artifact"
          aria-label="Illustrative mobile application modules"
        >
          <div className="exp-mobile-paper">
            <p className="exp-kicker">Mobile development / 02</p>
            <span className="exp-mobile-title">
              Interfaces.
              <br />
              Interactions.
              <br />
              Infrastructure.
            </span>
            <ul>
              <li>Onboarding & navigation</li>
              <li>Chat & asynchronous APIs</li>
              <li>Journaling & mood tracking</li>
              <li>Authentication & data</li>
            </ul>
            <p className="exp-fine-print">
              Abstract module index. No fabricated application screenshots.
            </p>
          </div>
        </aside>
      )}
    </article>
  );
}

export default function ExperienceSection({ paused = false, onMeasure }) {
  const root = useRef(null), iframe = useRef(null), film = useRef(null), videoOnly = useRef(false), records = useRef([]), visible = useRef(false), pointerFrame = useRef(0), sceneStatus = useRef("waiting");
  const [liveScene, setLiveScene] = useState(false);
  const [near, setNear] = useState(false), [sceneState, setSceneState] = useState("waiting"), [sound, setSound] = useState(false), [active, setActive] = useState(-1), [audioError, setAudioError] = useState("");
  const [sceneError, setSceneError] = useState("");
  const [sceneAttempt, setSceneAttempt] = useState(0);
  sceneStatus.current = sceneState;
  const send = (type, values = {}) => iframe.current?.contentWindow?.postMessage({ source: "portfolio-experience", type, ...values }, "*");
  useLayoutEffect(() => {
    if (!root.current || !onMeasure) return;
    const measure = () => onMeasure(root.current.getBoundingClientRect().height);
    const observer = new ResizeObserver(measure);
    observer.observe(root.current); measure();
    return () => observer.disconnect();
  }, [onMeasure]);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const loader = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setNear(true); loader.disconnect(); }
    }, { rootMargin: `${Math.max(1200, innerHeight * 2)}px` });
    loader.observe(node);
    let introTimeout = 0, recoveryTimeout = 0;
    const syncPlayback = () => {
      clearTimeout(introTimeout);
      const bounds = node.getBoundingClientRect();
      visible.current = bounds.top < innerHeight && bounds.bottom > 0;
      const playing = visible.current && !document.hidden && !paused;
      if (playing) film.current?.play().catch(() => {}); else film.current?.pause();
      send("paused", { active: paused || videoOnly.current });
      send("visible", { visible: playing && !videoOnly.current });
      if (visible.current && !document.hidden && !["ready", "error"].includes(sceneStatus.current)) {
        introTimeout = setTimeout(() => setSceneState(current => current === "ready" ? current : "slow"), 15000);
      }
    };
    const visibility = new IntersectionObserver((entries) => {
      visible.current = entries.some((entry) => entry.isIntersecting);
      syncPlayback();
    });
    visibility.observe(node);
    const current = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(Number(entry.target.dataset.record));
    }, { rootMargin: "-22% 0px -48% 0px" });
    records.current.filter(Boolean).forEach((element, i) => { element.dataset.record = String(i); current.observe(element); });
    const message = (event) => {
      if (event.source !== iframe.current?.contentWindow || event.data?.source !== "experience-valley") return;
      const { type } = event.data;
      if (type === "frame-rate" && visible.current && !document.hidden && !paused && !videoOnly.current) {
        if (event.data.fps >= 12) setLiveScene(true);
        else if (event.data.elapsed >= 4 && event.data.fps < 8) {
          videoOnly.current = true; setLiveScene(false);
          send("paused", { active: true }); send("visible", { visible: false });
        }
      }
      if (["ready", "booted", "intro-complete"].includes(type)) {
        setSceneState(current => type === "booted" && current !== "ready" ? "loading" : "ready");
        syncPlayback();
      }
      if (type === "error") {
        setLiveScene(false);
        setSceneState("error"); setSceneError(typeof event.data.message === "string" ? event.data.message.slice(0, 200) : "The background renderer could not start.");
        if (sceneAttempt < 2 && !recoveryTimeout) recoveryTimeout = setTimeout(() => {
          setSceneState("loading"); setSceneError(""); setSceneAttempt(value => value + 1);
        }, 1200);
      }
      if (type === "sound") setSound(event.data.active === true);
      if (type === "audio-error") { setSound(false); setAudioError("Sound is unavailable in this browser."); }
    };
    const move = (event) => {
      if (paused || !visible.current || event.pointerType === "touch" || pointerFrame.current) return;
      pointerFrame.current = requestAnimationFrame(() => {
        pointerFrame.current = 0;
        const box = iframe.current?.getBoundingClientRect();
        if (box) send("pointer", { x: (event.clientX - box.left) / Math.max(1, box.width), y: (event.clientY - box.top) / Math.max(1, box.height) });
      });
    };
    const wheel = (event) => { if (!paused && visible.current) send("wheel", { deltaY: event.deltaY }); };
    let previousTouchY = null;
    const touchStart = (event) => { previousTouchY = event.touches[0]?.clientY ?? null; };
    const touchMove = (event) => {
      const y = event.touches[0]?.clientY;
      if (!Number.isFinite(y)) return;
      if (!paused && visible.current && previousTouchY !== null) send("wheel", { deltaY: Math.max(-160, Math.min(160, 20 * (previousTouchY - y))) });
      previousTouchY = y;
    };
    const touchEnd = () => { previousTouchY = null; };
    const tabVisibility = syncPlayback;
    window.addEventListener("message", message);
    node.addEventListener("pointermove", move, { passive: true }); node.addEventListener("wheel", wheel, { passive: true });
    node.addEventListener("touchstart", touchStart, { passive: true }); node.addEventListener("touchmove", touchMove, { passive: true });
    node.addEventListener("touchend", touchEnd, { passive: true }); node.addEventListener("touchcancel", touchEnd, { passive: true });
    document.addEventListener("visibilitychange", tabVisibility);
    window.addEventListener("pageshow", tabVisibility);
    node.addEventListener("pointerdown", syncPlayback, { passive: true });
    return () => {
      loader.disconnect(); visibility.disconnect(); current.disconnect();
      clearTimeout(introTimeout);
      clearTimeout(recoveryTimeout);
      cancelAnimationFrame(pointerFrame.current);
      window.removeEventListener("message", message);
      node.removeEventListener("pointermove", move); node.removeEventListener("wheel", wheel);
      node.removeEventListener("touchstart", touchStart); node.removeEventListener("touchmove", touchMove);
      node.removeEventListener("touchend", touchEnd); node.removeEventListener("touchcancel", touchEnd);
      document.removeEventListener("visibilitychange", tabVisibility);
      window.removeEventListener("pageshow", tabVisibility);
      node.removeEventListener("pointerdown", syncPlayback);
    };
  }, [paused, sceneAttempt]);
  useEffect(() => {
    const node = root.current; let context, cancelled = false;
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.from(".exp-intro [data-exp-entrance]", { y: 35, opacity: 0, duration: 1.2, stagger: 0.13, ease: "power3.out", scrollTrigger: { trigger: node, start: "top 75%", once: true } });
        gsap.utils.toArray("[data-exp-reveal]").forEach((element) => gsap.from(element, { y: 45, rotateX: 3, opacity: 0, duration: 1.05, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%", once: true } }));
      }, node);
    }).catch(() => {});
    return () => { cancelled = true; context?.revert(); };
  }, [paused]);
  useEffect(() => {
    send("paused", { active: paused || videoOnly.current });
    send("visible", { visible: visible.current && !document.hidden && !paused && !videoOnly.current });
  }, [paused]);
  function visit(index) {
    records.current[index]?.scrollIntoView({ behavior: paused || matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
  return (
    <section className={`exp-section exp-valley ${paused ? "exp-paused" : ""} ${sceneState === "error" ? "exp-scene-failed" : ""}`} ref={root} aria-labelledby="experience-archive-heading" data-valley-state={sceneState} data-live-scene={liveScene}>
      <div className="exp-scene" aria-hidden="true">
        <video ref={film} className="exp-background-film" src="/assets/experience-valley-loop.mp4" poster="/assets/experience-valley-poster.webp" autoPlay muted loop playsInline preload="auto" onCanPlay={() => { if (visible.current && !document.hidden && !paused) film.current?.play().catch(() => {}); }} />
        {near && <iframe key={sceneAttempt} ref={iframe} onLoad={() => { const bounds = root.current.getBoundingClientRect(); visible.current = bounds.top < innerHeight && bounds.bottom > 0; send("paused", { active: paused }); send("visible", { visible: visible.current && !document.hidden && !paused }); }} src="/experience-valley/index.html" title="Interactive flower valley background" sandbox="allow-scripts" allow="autoplay" tabIndex={-1} />}
        <div className="exp-scene-wash" />
        <div className="exp-valley-loader" role="status"><span/><b className="sr-only">Preparing the flower valley</b></div>
      </div>
      <div className="exp-archive-content">
        <header className="exp-intro">
          <p className="exp-kicker" data-exp-entrance>Professional journey / Dharantej Reddy</p>
          <h2 id="experience-archive-heading" data-exp-entrance>EXPERIENCE</h2>
          <p className="exp-handwritten" data-exp-entrance>{archive.annotation}</p>
          <p className="exp-intro-copy" data-exp-entrance>{archive.introduction}</p>
          <div className="exp-valley-actions" data-exp-entrance>
            <button type="button" className="exp-explore" onClick={() => visit(0)} onMouseEnter={() => send("hover", { active: true })} onMouseLeave={() => send("hover", { active: false })} onFocus={() => send("hover", { active: true })} onBlur={() => send("hover", { active: false })}>Explore the records <span aria-hidden="true">↗</span></button>
            <span>Founder & product engineer<br />React Native developer</span>
          </div>
          <div className="exp-intro-bottom" data-exp-entrance><span>Product engineering<br />Software development / AI systems</span><span>Two records<br />One engineering practice</span></div>
          <div className="exp-valley-controls"><span className="exp-scene-caption">{sceneState === "waiting" || sceneState === "loading" ? "Entering the valley" : sceneState === "error" ? "Valley unavailable / records remain accessible" : "Move to explore / scroll to continue"}</span></div>
          {audioError && <p className="exp-audio-status" role="status">{audioError}</p>}
        </header>
        {archive.records.map((record, index) => <ExperienceRecord key={record.id} record={record} index={index} elementRef={(element) => { records.current[index] = element; }} />)}
        <footer className="exp-section-end"><p>From application modules<br /><em>to connected systems.</em></p><span>The archive continues ↓</span></footer>
        {sceneState === "error" && <p className="exp-scene-status" role="status">{sceneError || "The background renderer could not start."} <button type="button" onClick={() => { setSceneState("loading"); setSceneError(""); setSceneAttempt(value => value + 1); }}>Reload background</button></p>}
      </div>
    </section>
  );
}
