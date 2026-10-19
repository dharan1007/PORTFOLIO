import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { SITE } from './content.js';
import Monogram from './Monogram.jsx';
import {
  SplitText, BlurText, ShinyText, CountUp, DecryptedText,
  AnimatedContent, FadeContent, StarBorder, Sparkles, Spotlight, Aurora, ParticleField
} from './bits.jsx';
import InfiniteMenu from './reactbits/InfiniteMenu.jsx';
import Lanyard from './reactbits/Lanyard.jsx';
import DomeGallery from './reactbits/DomeGallery.jsx';
import GradientWaves from './reactbits/GradientWaves.jsx';
import TearTicket from './reactbits/TearTicket.jsx';
import { tile, cardFront, cardBack } from './tiles.js';

const SECTIONS = ['hero', 'manifesto', 'journey', 'toolkit', 'projects', 'contact'];

/* ─────────────────────────────  LOADER  ───────────────────────────── */
function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    document.body.classList.add('is-locked');
    // setInterval (not rAF) so the loader still completes in a backgrounded
    // tab where requestAnimationFrame is throttled to a halt.
    const start = performance.now();
    const dur = 1600;
    const id = setInterval(() => {
      const p = Math.min((performance.now() - start) / dur, 1);
      setPct(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p >= 1) {
        clearInterval(id);
        setLeaving(true);                 // CSS slide-up (not rAF-driven)
        setTimeout(onDone, 950);           // unmount via timer, robust in hidden tabs
      }
    }, 40);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div className={`loader ${leaving ? 'is-done' : ''}`}>
      <div className="loader__mono">dtr</div>
      <div className="loader__bar"><span style={{ width: pct + '%' }} /></div>
      <div className="loader__pct">{pct}</div>
    </div>
  );
}

/* ─────────────────────────────  CURSOR  ───────────────────────────── */
function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current; let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    const move = (e) => { x = e.clientX; y = e.clientY; };
    window.addEventListener('mousemove', move);
    const loop = () => { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; el.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
    loop();
    const over = (e) => el.classList.toggle('is-hover', !!e.target.closest('a,button,.toolkit__card,.projects__item'));
    document.addEventListener('mouseover', over);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over); };
  }, []);
  return <div className="cursor" ref={ref} aria-hidden="true" />;
}

/* ─────────────────────────────  HEADER  ───────────────────────────── */
function Header() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = 0;
    const onScroll = () => { const y = scrollY; setHidden(y > last && y > 200); last = y; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const go = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <header className={`site-header ${hidden ? 'is-hidden' : ''}`}>
      <a className="site-header__logo" href="#hero" onClick={go('hero')}>dtr</a>
      <nav className="site-header__nav">
        <a href="#journey" onClick={go('journey')}>Journey</a>
        <a href="#toolkit" onClick={go('toolkit')}>Toolkit</a>
        <a href="#projects" onClick={go('projects')}>Work</a>
        <a className="pill" href="#contact" onClick={go('contact')}>Contact</a>
      </nav>
    </header>
  );
}

/* ─────────────────────────  SCROLL NAV  ───────────────────────── */
function ScrollNav() {
  const [active, setActive] = useState('hero');
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  const go = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  const labels = { hero: 'Intro', manifesto: 'Manifesto', journey: 'Journey', toolkit: 'Toolkit', projects: 'Work', contact: 'Contact' };
  return (
    <nav className="scroll-nav" aria-label="Section navigation">
      {SECTIONS.map((id) => (
        <button key={id} className={active === id ? 'active' : ''} onClick={go(id)} aria-label={labels[id]}>
          <em>{labels[id]}</em><span />
        </button>
      ))}
    </nav>
  );
}

/* ─────────────────────────────  HERO  ───────────────────────────── */
function Hero() {
  const go = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <section className="hero section" id="hero">
      <div className="hero__fallback" aria-hidden="true">dtr</div>
      <Aurora />
      <Spotlight />
      <ParticleField count={16} />
      <Monogram />
      <div className="hero__content">
        <p className="hero__eyebrow"><ShinyText text="Portfolio — 2026" /></p>
        <h1 className="hero__name">
          <SplitText text="Dharantej" />{' '}
          <span className="it"><SplitText text="Reddy" delay={0.2} /></span>
        </h1>
        <p className="hero__role">{SITE.role}</p>
      </div>
      <a className="hero__scroll" href="#manifesto" onClick={go('manifesto')}>
        <span>Scroll</span><i />
      </a>
    </section>
  );
}

/* ───────────────────────────  MANIFESTO  ─────────────────────────── */
function Manifesto() {
  return (
    <section className="manifesto section container" id="manifesto">
      <p className="manifesto__text"><BlurText text={SITE.manifesto} /></p>
    </section>
  );
}

/* ─────────────────────────────  STATS  ───────────────────────────── */
function Stats() {
  return (
    <section className="stats section">
      <div className="container stats__grid">
        {SITE.stats.map((s, i) => (
          <FadeContent key={i} delay={i * 0.08}>
            <div className="stats__num"><CountUp to={s.value} /><span className="suf">{s.suffix}</span></div>
            <div className="stats__label">{s.label}</div>
          </FadeContent>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────────  JOURNEY  ─────────────────────────── */
function Journey() {
  const pinRef = useRef(null);
  const steps = SITE.journey.steps;
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] });
  const [idx, setIdx] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setIdx(Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999)));
  });
  return (
    <section className="journey section" id="journey">
      <div className="journey__intro container">
        <span className="eyebrow">— My journey</span>
        <h2 className="section-title">A path shaped by<br />curiosity.</h2>
      </div>
      <div className="journey__pin" ref={pinRef}>
        <div className="journey__stage">
          <div className="journey__glow" aria-hidden="true" />
          <div className="journey__steps">
            {steps.map((s, i) => (
              /* centering lives on the static wrapper — Framer writes an inline
                 transform for y/filter, which would override a transform here */
              <div key={i} className="journey__slot">
                <motion.div
                  className={`journey__step is-${s.style}`}
                  animate={{ opacity: i === idx ? 1 : 0, y: i === idx ? 0 : (i > idx ? 46 : -46), filter: i === idx ? 'blur(0px)' : 'blur(6px)' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  {s.text}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────  TOOLKIT  ─────────────────────────── */
function Toolkit() {
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const [overflow, setOverflow] = useState(0);
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -overflow]);

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current; if (!t) return;
      setOverflow(Math.max(0, t.scrollWidth - window.innerWidth + 80));
    };
    measure();
    window.addEventListener('resize', measure);
    const id = setTimeout(measure, 400); // after fonts/layout settle
    return () => { window.removeEventListener('resize', measure); clearTimeout(id); };
  }, []);

  const card = (t) => (
    <StarBorder key={t} className="toolkit__card-wrap"><span className="toolkit__card">{t}</span></StarBorder>
  );

  return (
    <section className="toolkit section" id="toolkit">
      <div className="toolkit__pin" ref={pinRef}>
        <div className="toolkit__sticky">
          <div className="toolkit__head container">
            <span className="eyebrow">— Toolkit</span>
            <h2 className="section-title">What I build with.</h2>
          </div>
          <motion.div className="toolkit__track" ref={trackRef} style={{ x }}>
            <div className="toolkit__group">
              <h3>{SITE.toolkit.frontLabel}</h3>
              <div className="toolkit__cards">{SITE.toolkit.front.map(card)}</div>
            </div>
            <div className="toolkit__group">
              <h3>{SITE.toolkit.designLabel}</h3>
              <div className="toolkit__cards">{SITE.toolkit.design.map(card)}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────  PROJECTS  ─────────────────────────── */
function Projects() {
  const [hover, setHover] = useState(null);
  const posRef = useRef({ x: 0, y: 0 });
  const boxRef = useRef(null);
  useEffect(() => {
    const move = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (boxRef.current) { boxRef.current.style.left = e.clientX + 'px'; boxRef.current.style.top = e.clientY + 'px'; }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <section className="projects section" id="projects">
      <div className="projects__head container">
        <span className="eyebrow">— Selected work</span>
        <h2 className="section-title"><DecryptedText text="Projects." /></h2>
      </div>
      <div className="projects__list">
        {SITE.projects.map((p, i) => (
          <a
            key={i} className="projects__item" href="#projects"
            onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)}
          >
            <span className="projects__name">{p.name}</span>
            <span className="projects__tag">{p.tag}</span>
          </a>
        ))}
      </div>
      <div
        ref={boxRef}
        className={`projects__preview ${hover ? 'show' : ''}`}
        style={hover ? { background: `linear-gradient(135deg, hsl(${hover.hue} 72% 56%), hsl(${hover.hue + 20} 60% 34%))` } : undefined}
        aria-hidden="true"
      />
    </section>
  );
}

/* ───────────────────────────  GALLERY  ─────────────────────────── */
function Gallery() {
  const images = useMemo(
    () => SITE.gallery.words.map((w) => ({ src: tile(w.text, w.hue), alt: w.text })),
    []
  );
  return (
    <section className="gallery section" id="gallery">
      <div className="gallery__head container">
        <span className="eyebrow">{SITE.gallery.eyebrow}</span>
        <h2 className="section-title">{SITE.gallery.title}</h2>
      </div>
      <div className="gallery__dome">
        <DomeGallery
          images={images}
          overlayBlurColor="#17130F"
          grayscale={false}
          imageBorderRadius="18px"
          openedImageBorderRadius="24px"
        />
      </div>
    </section>
  );
}

/* ────────────────────────────  REEL  ──────────────────────────── */
function Reel() {
  const items = useMemo(
    () => SITE.reel.items.map((r) => ({ ...r, image: tile(r.title, r.hue) })),
    []
  );
  return (
    <section className="reel section" id="reel">
      <div className="reel__head container">
        <span className="eyebrow">{SITE.reel.eyebrow}</span>
        <h2 className="section-title">{SITE.reel.title}</h2>
      </div>
      <div className="reel__stage">
        <InfiniteMenu
          items={items}
          count={120}
          theme="light"
          accentColor={SITE.accent}
          dim={0.45}
          autoplay={3}
        />
      </div>
    </section>
  );
}

/* ──────────────────────────  COLLECT  ─────────────────────────── */
function Collect() {
  const [claimed, setClaimed] = useState(false);
  const front = useMemo(() => cardFront(SITE), []);
  const back = useMemo(() => cardBack(SITE), []);
  const t = SITE.collect.ticket;
  return (
    <section className="collect section" id="collect">
      <div className="collect__head container">
        <span className="eyebrow">{SITE.collect.eyebrow}</span>
        <h2 className="section-title">{SITE.collect.title}</h2>
      </div>
      <div className="collect__row">
        <div className="collect__item">
          <div className="collect__lanyard">
            <Lanyard
              frontImage={front}
              backImage={back}
              cardColor="#F4EEE4"
              strapColor="#17130F"
              metal="silver"
              finish="glossy"
              size={0.62}
              breeze={0.35}
            />
          </div>
          <p className="collect__cap">{SITE.collect.lanyardCaption}</p>
        </div>
        <div className="collect__item">
          <div className="collect__ticket">
            <TearTicket
              background="#17130F"
              color="#F4EEE4"
              borderColor="rgba(210,26,46,0.55)"
              rotate={3}
              onTear={() => setClaimed(true)}
              ariaLabel="Tear off the ticket stub"
              stub={
                <div className="ticket__stub">
                  <span className="ticket__stub-label">{t.stubLabel}</span>
                  <span className="ticket__no">{t.stubNo}</span>
                  <span className="ticket__stub-name">{t.stubName}</span>
                </div>
              }
            >
              <div className="ticket__body">
                <span className="ticket__kicker">{t.kicker}</span>
                <h3>{t.headline}</h3>
                <p>{t.note}</p>
              </div>
            </TearTicket>
          </div>
          <p className="collect__cap">
            {claimed ? (
              <a href={`mailto:${SITE.footer.email}`}>{SITE.collect.claimedCaption}</a>
            ) : SITE.collect.ticketCaption}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────  NEXT  ───────────────────────────── */
function Next() {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const orbRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start 0.9', 'end 0.5'] });

  useEffect(() => {
    const place = (p) => {
      const path = pathRef.current, orb = orbRef.current, svg = wrapRef.current?.querySelector('svg');
      if (!path || !orb || !svg) return;
      const len = path.getTotalLength();
      const pt = path.getPointAtLength(len * Math.max(0, Math.min(1, p)));
      const r = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      orb.style.left = (pt.x * (r.width / vb.width)) + 'px';
      orb.style.top = (pt.y * (r.height / vb.height)) + 'px';
    };
    place(0);
    const unsub = scrollYProgress.on('change', place);
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <section className="next section" id="next" ref={wrapRef}>
      <div className="next__waves" aria-hidden="true">
        <GradientWaves
          lightMode
          horizonColor="#F2C7CD"
          waveColor="#D21A2E"
          crestColor="#FFFFFF"
          speed={0.3}
          amplitude={1.8}
          waveScale={0.55}
          fogDepth={16}
          lightAngle={120}
          opacity={0.5}
          grain={0.15}
          mouseInteraction
          swellOnClick
        />
      </div>
      <div className="next__curve">
        <svg viewBox="0 0 1000 260" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path id="nextPath" ref={pathRef} fill="none" d="M10,180 C210,40 390,40 500,130 C610,220 790,220 990,80" />
          <text className="next__text">
            <textPath href="#nextPath" startOffset="0">
              <tspan>{SITE.next.prefix} </tspan>
              <tspan className="next__suffix">{SITE.next.suffix}</tspan>
            </textPath>
          </text>
        </svg>
        <span className="next__orb" ref={orbRef} aria-hidden="true" />
      </div>
    </section>
  );
}

/* ───────────────────────────  FOOTER  ─────────────────────────── */
function Footer() {
  return (
    <footer className="footer section" id="contact">
      <div className="footer__bg" aria-hidden="true" />
      <Sparkles count={14} color="#F2C7CD" />
      <div className="container footer__inner">
        <div>
          <p className="footer__headline">
            <span>{SITE.footer.lines[0]}</span><br />
            <span className="accent">{SITE.footer.lines[1]}</span><br />
            <span className="muted">{SITE.footer.lines[2]}</span>
          </p>
          <p className="footer__copy">© {SITE.footer.copyright}</p>
        </div>
        <nav className="footer__nav">
          <div className="footer__group">
            <p>Explore</p>
            <a href="#journey">Journey</a>
            <a href="#toolkit">Toolkit</a>
            <a href="#projects">Projects</a>
          </div>
          <div className="footer__group">
            <p>Contact</p>
            {SITE.footer.links.map((l, i) => (
              <a key={i} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{l.label}</a>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
}

/* ─────────────────────────────  APP  ───────────────────────────── */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { if (loaded) document.body.classList.remove('is-locked'); }, [loaded]);
  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Cursor />
      <Header />
      <ScrollNav />
      <main>
        <Hero />
        <Manifesto />
        <Stats />
        <Journey />
        <Toolkit />
        <Projects />
        <Gallery />
        <Reel />
        <Collect />
        <Next />
        <Footer />
      </main>
    </>
  );
}
