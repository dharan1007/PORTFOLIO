import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CONTACT_BACKGROUND_VIDEO } from "./contact-background.js";
import "./contact-section.css";
import BunnyForeground from "./BunnyForeground.jsx";

const interests = ["AI & automation", "Web development", "Mobile applications", "Backend systems", "Product engineering", "Other"];
const links = [
  ["Email", "mailto:dharan.poduvu@gmail.com", "dharan.poduvu@gmail.com"],
  ["Mobile", "tel:+918639961561", "+91 86399 61561"],
  ["LinkedIn", "https://www.linkedin.com/in/dharantej-reddy1727185/", "Connect on LinkedIn"],
  ["GitHub", "https://github.com/dharan1007", "dharan1007"],
];

function useTypewriter(text: string, speed = 38, startDelay = 600, enabled = true, instant = false) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!enabled) return;
    if (instant) { setDisplayed(text); return; }
    let interval: ReturnType<typeof setInterval> | undefined;
    let index = 0;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, speed, startDelay, enabled, instant]);
  return { displayed, done: displayed === text };
}

export default function ContactSection({ paused = false, onMeasure }: { paused?: boolean; onMeasure?: (height: number) => void }) {
  const section = useRef<HTMLElement>(null), video = useRef<HTMLVideoElement>(null);
  const entered = useInView(section, { once: true, amount: .12 });
  const inView = useInView(section, { amount: .01 });
  const reduced = useReducedMotion();
  const still = paused || !!reduced;
  const { displayed, done } = useTypewriter("I'd love to\nhear from you!", 38, 600, entered, still);
  const [selected, setSelected] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const email = `mailto:dharan.poduvu@gmail.com?subject=${encodeURIComponent(`Let's talk: ${selected.join(", ")}`)}&body=${encodeURIComponent(`Hi Dharantej,\n\nI'd like to discuss ${selected.join(", ")}.\n\n`)}`;

  useLayoutEffect(() => {
    const node = section.current;
    if (!node || !onMeasure) return;
    const observer = new ResizeObserver(() => onMeasure(node.getBoundingClientRect().height));
    observer.observe(node);
    return () => observer.disconnect();
  }, [onMeasure]);

  useEffect(() => {
    const node = video.current;
    if (!node || !entered || failed) return;
    const desktop = matchMedia("(min-width: 1024px)");
    let previousX: number | null = null, target = node.currentTime || 0, frame = 0, pendingSeek = false;
    const seek = () => {
      frame = 0;
      if (!pendingSeek || !inView || paused || document.hidden || !desktop.matches || node.seeking || !Number.isFinite(node.duration)) return;
      pendingSeek = false;
      if (Math.abs(node.currentTime - target) > .015) node.currentTime = target;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(seek); };
    const sync = () => {
      previousX = null;
      node.muted = true;
      node.autoplay = !paused;
      if (!inView || paused || document.hidden) node.pause();
      else node.play().catch(() => { /* A later touch retries mobile playback. */ });
    };
    const move = (event: MouseEvent) => {
      if (!desktop.matches || !inView || paused || document.hidden) return;
      const bounds = section.current?.getBoundingClientRect();
      if (!bounds || event.clientY < bounds.top || event.clientY > bounds.bottom) { previousX = null; return; }
      if (previousX !== null && Number.isFinite(node.duration) && node.duration > 0) {
        const delta = event.clientX - previousX;
        if (!node.seeking) target = node.currentTime;
        target = Math.max(0, Math.min(Math.max(0, node.duration - .04), target + delta / innerWidth * .8 * node.duration));
        pendingSeek = true;
        schedule();
      }
      previousX = event.clientX;
    };
    const leave = () => { previousX = null; };
    node.addEventListener("seeked", schedule);
    node.addEventListener("loadedmetadata", sync);
    node.addEventListener("canplay", sync);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("blur", leave);
    section.current?.addEventListener("touchstart", sync, { passive: true });
    const container = section.current;
    desktop.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      cancelAnimationFrame(frame); node.pause();
      node.removeEventListener("seeked", schedule); node.removeEventListener("loadedmetadata", sync); node.removeEventListener("canplay", sync);
      window.removeEventListener("mousemove", move); window.removeEventListener("blur", leave);
      container?.removeEventListener("touchstart", sync); desktop.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync);
    };
  }, [entered, inView, paused, failed]);

  const entrance = { initial: still ? false as const : { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };
  return <section ref={section} className="contact-studio relative flex flex-col overflow-x-hidden antialiased lg:block" aria-labelledby="contact-studio-heading">
    <div className="contact-studio-media order-last relative w-full overflow-hidden pointer-events-none lg:absolute lg:inset-0 lg:order-none" aria-hidden="true">
      {entered && !failed && <><video ref={video} crossOrigin="anonymous" src={CONTACT_BACKGROUND_VIDEO} muted playsInline loop preload="auto" className="contact-key-source h-full w-full object-cover object-right lg:object-right-bottom" onLoadedData={() => setReady(true)} onError={() => setFailed(true)} />{ready && <BunnyForeground videoRef={video} />}</>}
      <div className="contact-studio-media-wash" />
    </div>
    <div className="contact-studio-content relative z-10 order-first mx-auto w-full">
      <div className="contact-studio-identity"><span>dtr.p</span><p>CONTACT / PODUVU DHARANTEJ REDDY</p></div>
      <motion.div {...entrance} transition={{ duration: .6 }}>
        <h2 id="contact-studio-heading" aria-label="I'd love to hear from you!">
          <span aria-hidden="true">{displayed}{!done && <span className="contact-type-cursor animate-blink" />}</span>
        </h2>
      </motion.div>
      <motion.p {...entrance} transition={{ duration: .6, delay: .1 }} className="contact-studio-description">Have an idea, a question, or an opportunity?<br />Tell me what you're working on. Let's build something thoughtful.</motion.p>
      <motion.div {...entrance} transition={{ duration: .6, delay: .2 }} className="contact-studio-interests">
        <h3 id="contact-interest-heading">What would you like to build?</h3>
        <p>Select all that apply.</p>
        <div className="contact-interest-pills flex flex-wrap gap-3" role="group" aria-labelledby="contact-interest-heading">
          {interests.map(interest => {
            const active = selected.includes(interest);
            return <motion.button key={interest} type="button" aria-pressed={active} className={active ? "is-selected" : ""} whileHover={still ? undefined : { y: -3 }} whileTap={still ? undefined : { scale: .97 }} onClick={() => setSelected(current => current.includes(interest) ? current.filter(item => item !== interest) : [...current, interest])}>
              {active && <motion.svg initial={still ? false : { scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12 4 4L19 6" /></motion.svg>}{interest}
            </motion.button>;
          })}
        </div>
        <div className="contact-interest-feedback">
          <AnimatePresence mode="wait" initial={false}>
            {selected.length ? <motion.div key="selected" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: still ? 0 : .25 }} className="contact-interest-banner">
              <p role="status">Ready to talk about: <strong>{selected.join(", ")}</strong></p>
              <a href={email} aria-label="Open an email with your selected topics">Let's Go <span aria-hidden="true">↗</span></a>
            </motion.div> : <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: .65 }} exit={{ opacity: 0 }} className="contact-interest-placeholder">Choose a topic above, or reach me directly below.</motion.p>}
          </AnimatePresence>
        </div>
      </motion.div>
      <motion.div {...entrance} transition={{ duration: .6, delay: .3 }} className="contact-studio-links">
        {links.map(([label, href, value]) => <a key={label} href={href} {...(href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}><small>{label}</small><span>{value} ↗</span></a>)}
      </motion.div>
      {failed && <p className="contact-media-status" role="status">The background film couldn't load. You can still reach me using any link above.</p>}
    </div>
  </section>;
}
