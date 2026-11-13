import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { education as academic, educationCaseAt, fitEducationFrame } from "./education-data.js";
import "./education-section.css";


const CF = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";
const HX = (filename, width = 2048) => `https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(CF + filename)}&w=${width}&q=85`;
const media = {
  plate: HX("hf_20261111_001031_a09dc558-2c69-4e05-83a4-5f01ebdd1363.png"),
  casePlate: HX("hf_20261111_001031_4a7c3fd9-2168-4219-9736-096a17bbb0e2.png"),
  cut: HX("hf_20261111_001143_ec356b1a-50a2-4b50-82fc-e346c914a406.png"),
  badge: HX("hf_20261111_001143_65c037e6-0768-4b12-9f17-17be132ce16b.png", 1200),
  transition: CF + "hf_20261111_001144_2b054228-95af-41d5-922d-b02979fe485b.mp4",
};
const cases = [
  { title: "The academic record", label: "Qualification / 2026", description: "A foundation in computer science, focused on artificial intelligence and data science." },
  { title: "The disciplines", label: "Technical foundation", description: "Connected areas of learning, from computational foundations to intelligent systems." },
  { title: "Beyond the classroom", label: "Achievements / 2023–24", description: "Recognition through participation, problem-solving and innovation." },
  { title: "The academic journey", label: "Milestones / graduation", description: "A record of learning, participation and progression toward an engineering qualification." },
];

function EducationWordmark({ mobile = false }) {
  const gradient = `edu-wordmark-gradient${mobile ? "-mobile" : ""}`;
  return <svg className={`edu-wordmark ${mobile ? "edu-wordmark-mobile" : ""}`} viewBox="0 0 1440 260" role="img" aria-label="Education"><defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="white" /><stop offset="1" stopColor="white" stopOpacity=".28" /></linearGradient></defs><text x="14" y="214" textLength="1412" lengthAdjust="spacingAndGlyphs" fill={`url(#${gradient})`}>EDUCATION</text></svg>;
}
function AcademicBadge({ mobile = false }) {
  return <div className={`edu-badge-rig ${mobile ? "edu-badge-mobile" : ""}`} aria-label={`${academic.degreeShort}, ${academic.specialization}, ${academic.shortInstitution}, ${academic.graduation}`}>
    <div className="edu-badge-swing"><img src={media.badge} alt="" width="582" height="1030" decoding="async" loading="lazy" /><div className="edu-badge-copy"><span>Education record</span><strong>{academic.graduation}</strong><b>{academic.degreeShort}</b><p>{academic.specializationLines[0]}<br />{academic.specializationLines[1]}</p><small>{academic.shortInstitution} / {academic.city}</small></div></div>
  </div>;
}
function RecordPanel() {
  return <div className="edu-paper-panel edu-record-panel"><div className="edu-paper-top"><span>Personal academic summary</span><span>{academic.shortInstitution} / {academic.graduation}</span></div><h3>Academic<br />record</h3><p className="edu-record-institution">{academic.institution}</p><p className="edu-paper-location">{academic.location}</p><div className="edu-degree-line"><strong>{academic.degree}</strong><span>{academic.department}</span></div><div className="edu-score-row"><div><span className="edu-small-label">Academic performance</span><p className="edu-score-number" aria-hidden="true"><span data-edu-score-number>{academic.cgpa.toFixed(1)}</span><small> / {academic.cgpaScale}</small></p><span className="edu-small-label">Approximately · CGPA</span></div><div className="edu-score-ring" role="meter" aria-label="Approximate CGPA" aria-valuemin={0} aria-valuemax={academic.cgpaScale} aria-valuenow={academic.cgpa} aria-valuetext={`Approximately ${academic.cgpa} out of ${academic.cgpaScale} CGPA`}><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43" /><circle cx="50" cy="50" r="43" pathLength="100" strokeDasharray={`${academic.cgpa / academic.cgpaScale * 100} 100`} /></svg><span>CGPA<small>{academic.cgpaScale}-POINT SCALE</small></span></div></div><dl className="edu-record-grid">{[["Degree", academic.degreeShort], ["Specialization", academic.streamShort], ["Institution", academic.shortInstitution], ["Location", academic.city], ["Academic status", academic.status], ["Graduation", String(academic.graduation)]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>;
}
function DisciplinesPanel() {
  return <div className="edu-paper-panel edu-disciplines-panel"><div className="edu-paper-top"><span>Academic specialization</span><span>Subject index / 11</span></div><h3>The disciplines</h3><p className="edu-panel-introduction">Building the foundation for intelligent systems.</p><div className="edu-discipline-map">{academic.disciplines.map((group) => <section className="edu-discipline-group" key={group.id}><h4><span>{group.id}</span>{group.title}</h4><ul>{group.subjects.map((subject) => <li key={subject}>{subject}</li>)}</ul></section>)}</div><p className="edu-paper-footnote">Areas of technical learning and experience; not individual course grades or a complete official university syllabus.</p></div>;
}
function AchievementsPanel() {
  return <div className="edu-paper-panel edu-achievements-panel"><div className="edu-paper-top"><span>Achievements &amp; recognition</span><span>Three records</span></div><h3>Beyond the<br />classroom</h3><p className="edu-panel-introduction">Recognition through participation, problem-solving and innovation.</p><div className="edu-credentials">{academic.achievements.map((award) => <article key={award.id} className={`edu-credential ${award.recognition === "Winner" ? "edu-winner" : ""}`}><span className="edu-award-id">Record {award.id}<small>{award.year}</small></span><h4>{award.title}</h4><span className="edu-award-stamp">{award.recognition}</span></article>)}</div></div>;
}
function JourneyPanel() {
  return <div className="edu-paper-panel edu-journey-panel"><div className="edu-paper-top"><span>Academic milestones</span><span>{academic.shortInstitution} / India</span></div><h3>The academic<br />journey</h3><div className="edu-milestones"><article><span>2023</span><div><h4>Participation. Recognition.</h4>{academic.achievements.filter((a) => a.year === 2023).map((award) => <p key={award.id}>{award.title} · {award.recognition}</p>)}</div></article><article><span>2024</span><div><h4>Building beyond the syllabus.</h4>{academic.achievements.filter((a) => a.year === 2024).map((award) => <p key={award.id}>{award.title} · {award.recognition}</p>)}</div></article><article><span>{academic.graduation}</span><div><h4>{academic.status} · {academic.degreeShort}</h4><p>{academic.specialization}</p><p>{academic.shortInstitution} · Approximately {academic.cgpa}/{academic.cgpaScale} CGPA</p></div></article></div><p className="edu-journey-note">Keep learning. Keep building.</p></div>;
}
const panels = [RecordPanel, DisciplinesPanel, AchievementsPanel, JourneyPanel];

export default function EducationSection({ paused = false, onMeasure }) {
  const rootRef = useRef(null), stageRef = useRef(null), frameRef = useRef(null), videoRef = useRef(null), plateRef = useRef(null);
  const phaseRef = useRef("hero"), desiredCaseRef = useRef(0), actionRef = useRef(null), countedRef = useRef(false), enteredRef = useRef(false);
  const [phase, setPhase] = useState("hero"), [active, setActive] = useState(0), [mobile, setMobile] = useState(false), [failedVideo, setFailedVideo] = useState(false), [reduce, setReduce] = useState(paused);
  const [videoSource, setVideoSource] = useState(null);
  useLayoutEffect(() => {
    const root = rootRef.current, stage = stageRef.current, frame = frameRef.current;
    if (!root) return;
    const measure = () => {
      if (stage) {
        const bounds = stage.getBoundingClientRect();
        setMobile(bounds.width <= 820);
        const pose = fitEducationFrame(bounds.width, bounds.height, phaseRef.current === "case");
        if (frame) {
          frame.style.transform = `translate3d(${pose.x}px,${pose.y}px,0) scale(${pose.scale})`;
          frame.style.setProperty("--edu-visible-left", `${pose.visibleLeft}px`);
          frame.style.setProperty("--edu-wordmark-width", `${pose.wordmarkWidth}px`);
          frame.style.setProperty("--edu-badge-left", `${pose.badgeLeft}px`);
          frame.style.setProperty("--edu-badge-top", `${pose.badgeTop}px`);
          frame.style.setProperty("--edu-script-left", `${pose.scriptLeft}px`);
          const screen = root.querySelector(".edu-current-panel");
          if (screen) screen.style.transform = bounds.width <= 820 ? "" : frame.style.transform;
        }
      }
      onMeasure?.(root.getBoundingClientRect().height);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(root); if (stage) observer.observe(stage);
    window.addEventListener("resize", measure, { passive: true });
    actionRef.current = measure; measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); actionRef.current = null; };
  }, [onMeasure, reduce]);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(paused || preference.matches);
    update(); preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, [paused]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return;
    let cancelled = false, blobURL = null;
    const controller = new AbortController();
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return; observer.disconnect();
      try {
        const response = await fetch(media.transition, { signal: controller.signal });
        if (!response.ok) throw new Error(`Transition request ${response.status}`);
        const blob = await response.blob(); if (cancelled) return;
        blobURL = URL.createObjectURL(blob); setVideoSource(blobURL);
      } catch (error) { if (!cancelled && error.name !== "AbortError") setVideoSource(media.transition); }
    }, { rootMargin: "900px" });
    observer.observe(root);
    return () => { cancelled = true; controller.abort(); observer.disconnect(); if (blobURL) URL.revokeObjectURL(blobURL); };
  }, [reduce]);
  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current, stage = stageRef.current;
    let stopped = false, frame = 0, playback = 0, handoffTimer = 0, reverseTimer = 0, visible = false, entered = false, returning = false, wantsDive = false;
    const animations = [], timers = [];
    let photoReady;
    const setPhaseNow = (next) => { phaseRef.current = next; setPhase(next); requestAnimationFrame(() => actionRef.current?.()); };
    const finishDive = () => {
      cancelAnimationFrame(playback); playback = 0; stage?.classList.add("edu-handoff");
      handoffTimer = setTimeout(() => { if (stopped) return; videoRef.current?.pause(); setPhaseNow("case"); setActive(desiredCaseRef.current); stage?.classList.remove("edu-handoff", "edu-clip-running"); }, 260);
    };
    const playDive = async () => {
      if (phaseRef.current !== "hero" || returning || !wantsDive || stopped) return;
      const clip = videoRef.current; if (!clip || clip.readyState < 2) return;
      setPhaseNow("dive");
      try {
        clip.currentTime = 0; clip.playbackRate = 1.8; await clip.play();
        requestAnimationFrame(() => requestAnimationFrame(() => { if (!stopped && phaseRef.current === "dive") stage?.classList.add("edu-clip-running"); }));
        const tick = () => {
          if (stopped || phaseRef.current !== "dive") return;
          const p = clip.duration ? Math.min(1, clip.currentTime / clip.duration) : 0;
          clip.playbackRate = Math.max(1.2, 1.8 + 2.4 * Math.sin(Math.PI * Math.min(p * 1.08, 1)));
          if (p >= .995 || clip.ended) finishDive(); else playback = requestAnimationFrame(tick);
        }; playback = requestAnimationFrame(tick);
      } catch { setFailedVideo(true); finishDive(); }
    };
    const reverse = () => {
      if (phaseRef.current === "hero" || returning) return; returning = true; wantsDive = false;
      clearTimeout(handoffTimer); cancelAnimationFrame(playback); videoRef.current?.pause(); stage?.classList.remove("edu-clip-running", "edu-handoff"); stage?.classList.add("edu-reversing"); setPhaseNow("hero");
      reverseTimer = setTimeout(() => { stage?.classList.remove("edu-reversing"); returning = false; }, 900);
    };
    const onScroll = () => {
      frame = 0; if (!root || !stage || !visible) return;
      const bounds = root.getBoundingClientRect(), progress = Math.max(0, Math.min(1, (78 - bounds.top) / Math.max(1, bounds.height - stage.clientHeight)));
      const nextCase = educationCaseAt(progress); desiredCaseRef.current = nextCase;
      if (phaseRef.current === "case") setActive((current) => current === nextCase ? current : nextCase);
      if (progress < .018) reverse();
      if (progress > .055 && visible && phaseRef.current === "hero" && !returning) { wantsDive = true; if (failedVideo) { setPhaseNow("case"); setActive(nextCase); } else playDive(); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(onScroll); };
    const clip = videoRef.current, ready = () => { if (wantsDive) playDive(); };
    clip?.addEventListener("loadeddata", ready);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) clip?.pause(); else if (phaseRef.current === "dive") clip?.play().catch(() => finishDive()); schedule(); }, { threshold: 0 });
    if (stage) visibility.observe(stage);
    window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule, { passive: true });
    const entrance = async () => {
      if (entered || enteredRef.current || stopped) return; entered = true;
      const timeout = new Promise((resolve) => timers.push(setTimeout(resolve, 2500))), photo = plateRef.current;
      const loaded = photo?.complete ? Promise.resolve() : new Promise((resolve) => { photoReady = resolve; photo?.addEventListener("load", photoReady, { once: true }); photo?.addEventListener("error", photoReady, { once: true }); });
      await Promise.race([Promise.all([document.fonts?.ready, loaded]), timeout]); if (stopped || enteredRef.current) return;
      enteredRef.current = true;
      root.classList.add("edu-entered");
      for (const node of root.querySelectorAll(".edu-wordmark")) animations.push(node.animate([{ opacity: 0, clipPath: "inset(100% 0 0 0)", translate: "0 75px" }, { opacity: 1, clipPath: "inset(0 0 0 0)", translate: "0 0" }], { duration: 1100, delay: 260, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" }));
      for (const node of root.querySelectorAll(".edu-script")) animations.push(node.animate([{ clipPath: "inset(0 100% 0 0)", opacity: 0 }, { clipPath: "inset(0 0 0 0)", opacity: 1 }], { duration: 900, delay: 1050, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" }));
      for (const node of root.querySelectorAll(".edu-badge-rig")) animations.push(node.animate([{ translate: "0 -420px", rotate: "-9deg" }, { translate: "0 0", rotate: "3deg", offset: .72 }, { translate: "0 0", rotate: "0deg" }], { duration: 1500, delay: 700, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" }));
    };
    const entry = new IntersectionObserver(([e]) => { if (e.isIntersecting) { entrance(); entry.disconnect(); } }, { threshold: .04 }); if (stage) entry.observe(stage);
    timers.push(setTimeout(() => { if (!stopped) root?.classList.add("edu-entered"); }, 4000));
    if (failedVideo && phaseRef.current === "dive") { setPhaseNow("case"); setActive(desiredCaseRef.current); stage?.classList.remove("edu-clip-running", "edu-handoff"); }
    schedule();
    return () => { stopped = true; cancelAnimationFrame(frame); cancelAnimationFrame(playback); clearTimeout(handoffTimer); clearTimeout(reverseTimer); timers.forEach(clearTimeout); visibility.disconnect(); entry.disconnect(); animations.forEach((animation) => animation.cancel()); if (photoReady) { plateRef.current?.removeEventListener("load", photoReady); plateRef.current?.removeEventListener("error", photoReady); } clip?.removeEventListener("loadeddata", ready); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [reduce, failedVideo, videoSource]);
  useEffect(() => {
    actionRef.current?.(); if (phase !== "case" || reduce) return;
    const node = rootRef.current?.querySelector(".edu-current-panel"); if (!node) return;
    const animations = [node.animate([{ opacity: .15, translate: "0 14px" }, { opacity: 1, translate: "0 0" }], { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" })];
    let countFrame = 0;
    const score = node.querySelector("[data-edu-score-number]"), ring = node.querySelector(".edu-score-ring circle + circle");
    if (active === 0 && !countedRef.current && score && ring) {
      countedRef.current = true; const start = performance.now(); score.textContent = "0.0"; ring.style.strokeDasharray = "0 100";
      const tick = (now) => { const p = Math.min(1, (now - start) / 1450), eased = 1 - Math.pow(1 - p, 3); score.textContent = (academic.cgpa * eased).toFixed(1); ring.style.strokeDasharray = `${academic.cgpa / academic.cgpaScale * 100 * eased} 100`; if (p < 1) countFrame = requestAnimationFrame(tick); else node.classList.add("edu-score-complete"); };
      countFrame = requestAnimationFrame(tick);
    }
    if (active === 1) node.querySelectorAll(".edu-discipline-group").forEach((group, i) => { animations.push(group.animate([{ opacity: 0, translate: "-12px 12px", clipPath: "inset(0 100% 0 0)" }, { opacity: 1, translate: "0 0", clipPath: "inset(0 0 0 0)" }], { duration: 850, delay: 100 + i * 140, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" })); group.querySelectorAll("li").forEach((subject, j) => animations.push(subject.animate([{ opacity: 0, translate: "0 7px" }, { opacity: 1, translate: "0 0" }], { duration: 550, delay: 250 + i * 140 + j * 60, easing: "ease-out", fill: "backwards" }))); });
    if (active === 2) node.querySelectorAll(".edu-credential").forEach((credential, i) => { animations.push(credential.animate([{ opacity: 0, translate: "0 35px", rotate: "-5deg" }, { opacity: 1, translate: "0 0", rotate: "0deg" }], { duration: 900, delay: 120 + i * 190, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" })); const stamp = credential.querySelector(".edu-award-stamp"); if (stamp) animations.push(stamp.animate([{ opacity: 0, scale: 1.5 }, { opacity: 1, scale: .95, offset: .7 }, { opacity: 1, scale: 1 }], { duration: 550, delay: 500 + i * 190, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" })); });
    return () => { animations.forEach((animation) => animation.cancel()); cancelAnimationFrame(countFrame); if (score) score.textContent = academic.cgpa.toFixed(1); if (ring) ring.style.strokeDasharray = `${academic.cgpa / academic.cgpaScale * 100} 100`; };
  }, [active, phase, reduce, mobile]);
  function choose(next) {
    const index = (next + panels.length) % panels.length, root = rootRef.current, stage = stageRef.current; if (!root || !stage) return;
    setActive(index); desiredCaseRef.current = index;
    window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top - 78 + (.2 + index * .21) * (root.clientHeight - stage.clientHeight), behavior: reduce ? "instant" : "smooth" });
  }
  const Panel = panels[active];
  if (reduce) return <section className="edu-archive edu-static" ref={rootRef} aria-labelledby="edu-static-heading"><div className="edu-static-heading"><p>The academic archive</p><h2 id="edu-static-heading">Education</h2><span>academic journey</span></div>{panels.map((StaticPanel, index) => <article key={cases[index].title} aria-label={cases[index].title}><StaticPanel /></article>)}</section>;
  return <section className="edu-archive" ref={rootRef} aria-label="Education — the academic archive" data-education-source="owner-supplied" data-education-phase={phase}>
    <div className={`edu-dive-stage edu-phase-${phase} ${mobile ? "edu-mobile" : ""}`} ref={stageRef}>
      
      <div className="edu-photographic-frame" ref={frameRef} aria-hidden="true">
        <img className="edu-photo edu-hero-photo" ref={plateRef} src={media.plate} alt="" width="1440" height="956.25" loading="lazy" decoding="async" />
        <img className="edu-photo edu-case-photo" src={media.casePlate} alt="" width="1440" height="956.25" loading="lazy" decoding="async" />
        <EducationWordmark />
        <img className="edu-photo edu-person-cut" src={media.cut} alt="" width="1440" height="956.25" loading="lazy" decoding="async" />
        <AcademicBadge /><span className="edu-script">academic journey</span>
        <video ref={videoRef} className="edu-transition-clip" src={videoSource || undefined} muted playsInline preload="auto" onError={() => setFailedVideo(true)} aria-hidden="true" />
      </div>
      {mobile && phase !== "case" && <div className="edu-mobile-hero" aria-hidden="true"><EducationWordmark mobile /><span className="edu-script">academic journey</span><AcademicBadge mobile /></div>}
      {phase !== "case" && <div className="edu-hero-metadata"><span className="edu-section-eyebrow">Education / {academic.graduation}</span><h2>{academic.degreeShort}<br />{academic.specialization}</h2><p>{academic.institution}<br /><span>{academic.city}, {academic.country} · {academic.status}</span></p><div><span>Approximately {academic.cgpa}/{academic.cgpaScale} CGPA</span><span>Scroll to open the archive ↓</span></div></div>}
      <div className="edu-case-content" aria-hidden={phase !== "case"} inert={phase !== "case"}>
        <div className="edu-case-ticket"><span>Education / Record {String(active + 1).padStart(2, "0")}</span><h2>{cases[active].title}</h2><p>{cases[active].label}</p><i aria-hidden="true" /><button className="edu-ticket-return" onClick={() => rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} aria-label="Return to the academic studio" title="Return to academic studio">↖</button></div>
        <div className="edu-case-description"><span>{academic.shortInstitution} / {academic.city}</span><p>{cases[active].description}</p><button onClick={() => rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>Academic studio <span aria-hidden="true">↖</span></button></div>
        <div className={`edu-current-panel ${mobile ? "edu-mobile-paper" : "edu-laptop-screen"}`} tabIndex={mobile ? 0 : undefined} role="region" aria-label={cases[active].title}><Panel /></div>
        <div className="edu-case-navigation"><button onClick={() => choose(active - 1)} aria-label="Previous education record"><span aria-hidden="true">←</span></button><span>{String(active + 1).padStart(2, "0")}<i />04</span><button onClick={() => choose(active + 1)} aria-label="Next education record"><span aria-hidden="true">→</span></button></div>
      </div>
      <span className="edu-illustration-note">Illustrative academic studio · academic details supplied by the portfolio owner</span>
    </div>
  </section>;
}
