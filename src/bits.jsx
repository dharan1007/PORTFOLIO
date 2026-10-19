/* ============================================================================
   React-Bits-style components (my own implementations), grouped by the four
   React Bits categories: Text Animations · Animations · Components · Backgrounds
   ========================================================================== */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─────────────────────────  TEXT ANIMATIONS  ───────────────────────── */

/** SplitText — each character/word rises into place. */
export function SplitText({ text, by = 'word', className = '', delay = 0, stagger = 0.05, style }) {
  const units = by === 'char' ? text.split('') : text.split(' ');
  const joiner = by === 'char' ? '' : ' ';
  return (
    <motion.span
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {units.map((u, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          variants={{
            hidden: { y: '110%', opacity: 0 },
            show: { y: '0%', opacity: 1, transition: { type: 'spring', stiffness: 90, damping: 16 } }
          }}
        >
          {u}
          {by !== 'char' && joiner}
        </motion.span>
      ))}
    </motion.span>
  );
}

/** BlurText — words blur + slide in. */
export function BlurText({ text, className = '', delay = 0 }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="blur-word"
          initial={{ opacity: 0, filter: 'blur(12px)', y: 12 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: delay + i * 0.06, ease: 'easeOut' }}
          style={{ marginRight: '0.28em' }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/** ShinyText — a light sweep across the text. */
export function ShinyText({ text, className = '' }) {
  return <span className={`shiny ${className}`}>{text}</span>;
}

/** CountUp — animate a number when it enters view. */
export function CountUp({ to, suffix = '', duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf; const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/** DecryptedText — characters scramble then resolve. */
export function DecryptedText({ text, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!inView) return;
    const chars = '!<>-_\\/[]{}—=+*^?#0123456789';
    let frame = 0; let raf;
    const reveal = new Array(text.length).fill(0).map((_, i) => 8 + i * 2);
    const run = () => {
      let s = '';
      for (let i = 0; i < text.length; i++) {
        if (frame >= reveal[i]) s += text[i];
        else if (text[i] === ' ') s += ' ';
        else s += chars[Math.floor(Math.random() * chars.length)];
      }
      setOut(s);
      frame++;
      if (frame <= Math.max(...reveal) + 2) raf = requestAnimationFrame(run);
      else setOut(text);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [inView, text]);
  return <span ref={ref} className={className}>{out}</span>;
}

/* ─────────────────────────  ANIMATIONS  ───────────────────────── */

/** AnimatedContent — staggered rise-in of its children (wrapper). */
export function AnimatedContent({ children, className = '', stagger = 0.08, y = 28, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {Array.isArray(children)
        ? children.map((c, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}>{c}</motion.div>
          ))
        : <motion.div variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>{children}</motion.div>}
    </motion.div>
  );
}

/** FadeContent — simple fade + scale on view. */
export function FadeContent({ children, className = '', delay = 0, scale = 0.96 }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, scale }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────  COMPONENTS  ───────────────────────── */

/** StarBorder — a spinning conic-gradient border around a card. */
export function StarBorder({ children, className = '', dark = false, as: Tag = 'div' }) {
  return (
    <Tag className={`star-border ${dark ? 'star-border--dark' : ''} ${className}`}>
      <div className="star-border__inner">{children}</div>
    </Tag>
  );
}

/** Sparkles — floating twinkling points inside a container. */
export function Sparkles({ count = 18, color = 'var(--cherry)' }) {
  const items = Array.from({ length: count }, () => ({
    left: Math.random() * 100, top: Math.random() * 100,
    size: 2 + Math.random() * 4, dur: 2 + Math.random() * 3, delay: Math.random() * 3
  }));
  return (
    <div className="field" aria-hidden="true">
      {items.map((p, i) => (
        <span key={i} style={{ position: 'absolute', left: p.left + '%', top: p.top + '%', width: p.size, height: p.size, borderRadius: '50%', background: color, opacity: 0.6, animation: `pulse ${p.dur}s ease-in-out ${p.delay}s infinite` }} />
      ))}
    </div>
  );
}

/** Spotlight — a soft light that follows the cursor. */
export function Spotlight({ className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', ((e.clientX - r.left) / r.width) * 100 + '%');
      el.style.setProperty('--sy', ((e.clientY - r.top) / r.height) * 100 + '%');
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return <div ref={ref} className={`spotlight ${className}`} aria-hidden="true" />;
}

/* ─────────────────────────  BACKGROUNDS  ───────────────────────── */

/** Aurora — slow-moving colour blobs. */
export function Aurora({ className = '' }) {
  return (
    <div className={`aurora ${className}`} aria-hidden="true">
      <span /><span /><span />
    </div>
  );
}

/** ParticleField — rising cherry dots. */
export function ParticleField({ count = 22 }) {
  const items = Array.from({ length: count }, () => ({
    left: Math.random() * 100, dur: 8 + Math.random() * 8, delay: -Math.random() * 12, size: 2 + Math.random() * 4
  }));
  return (
    <div className="field" aria-hidden="true">
      {items.map((p, i) => (
        <i key={i} style={{ left: p.left + '%', bottom: '-10px', width: p.size, height: p.size, animationDuration: p.dur + 's', animationDelay: p.delay + 's' }} />
      ))}
    </div>
  );
}
