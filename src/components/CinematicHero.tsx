import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { orderedProjects } from '../data/projects';

/**
 * SOSCALE-inspired cinematic visual language, adapted for a multi-page
 * professional portfolio. The reference film is supplied by the site owner.
 * Its HEVC encoding may be unsupported in some browsers; the CSS fallback
 * is intentionally always available and does not block navigation/content.
 */
const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260930_000857_e98f4291-826d-46eb-9a28-8022b5fb7e62.mp4';

export function CinematicHero() {
  const stageRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [failed, setFailed] = useState(false);
  const [animate, setAnimate] = useState(false);
  const projectCount = orderedProjects().length;

  useEffect(() => {
    let mounted = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const film = filmRef.current;
    if (!film) return;
    const configureMotion = () => {
      if (reduced.matches) {
        film.pause();
        film.currentTime = 0;
        setAnimate(false);
      } else {
        film.play().catch(() => setFailed(true));
        Promise.race([
          document.fonts ? document.fonts.ready : Promise.resolve(),
          new Promise<void>(resolve => window.setTimeout(resolve, 700))
        ]).then(() => { if (mounted) setAnimate(true); });
      }
    };
    configureMotion();
    reduced.addEventListener?.('change', configureMotion);
    return () => { mounted = false; reduced.removeEventListener?.('change', configureMotion); };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const film = filmRef.current;
    const band = bandRef.current;
    if (!stage || !film || !band) return;
    const place = () => {
      const width = stage.clientWidth, height = stage.clientHeight;
      if (!width || !height) return;
      const baseUnit = Math.min(width / 1280, height / 640);
      const compact = width < 1075 || height < 538;
      const scale = Math.max(width / 1920, height / 1080, compact ? Math.max(.95 * width / 1280, height / 956) : .95 * baseUnit);
      const bandHeight = band.getBoundingClientRect().bottom - stage.getBoundingClientRect().top;
      const targetX = compact ? width * .547 : (width - 1280 * baseUnit) / 2 + 700 * baseUnit;
      const targetY = bandHeight + .375 * (height - bandHeight);
      const left = Math.min(0, Math.max(width - 1920 * scale, targetX - 1041 * scale));
      const top = Math.min(0, Math.max(height - 1080 * scale, compact ? height - 956 * scale : -Infinity, targetY - 545 * scale));
      film.style.width = 1920 * scale + 'px';
      film.style.height = 1080 * scale + 'px';
      film.style.left = left + 'px';
      film.style.top = top + 'px';
      film.classList.add('is-placed');
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place);
    observer?.observe(stage);
    window.addEventListener('resize', place, { passive: true });
    place();
    return () => { observer?.disconnect(); window.removeEventListener('resize', place); };
  }, []);

  return (
    <section className={'cinematic-hero ' + (animate ? 'cinema-animate ' : '') + (canPlay && !failed ? 'has-film' : 'fallback-film')} ref={stageRef} aria-labelledby="hero-title">
      <div className="cinema-photo" aria-hidden="true">
        <div className="cinema-fallback" />
        <video
          ref={filmRef} className="cinema-video" autoPlay muted loop playsInline preload="metadata"
          width={1920} height={1080} disablePictureInPicture aria-hidden="true"
          onCanPlay={() => setCanPlay(true)} onError={() => { setFailed(true); setCanPlay(false); }}
        ><source src={HERO_VIDEO} type="video/mp4" /></video>
        <div className="cinema-warmth" />
        <div className="cinema-vignette" />
      </div>
      <div className="cinema-band" ref={bandRef} aria-hidden="true">
        <svg className="cinema-wordmark" viewBox="0 0 1280 190" preserveAspectRatio="none" focusable="false" aria-hidden="true">
          <defs>
            <mask id="cinematic-word-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="1280" height="190">
              <rect width="1280" height="190" fill="#fff" />
              <text x="12" y="161" textLength="1256" lengthAdjust="spacingAndGlyphs" fill="#000"
                fontFamily="'Hanken Grotesk Variable', 'Arial Black', sans-serif" fontSize="189" fontWeight="900"
                letterSpacing="-8">DHARANTEJ</text>
            </mask>
          </defs>
          <rect width="1280" height="190" fill="#000" mask="url(#cinematic-word-cut)" />
          {Array.from({ length: 9 }, (_, index) => (
            <rect key={index} className="cinema-lid" x={index * (1280 / 9)} y="5" width={1280 / 9 + 1} height="182"
              style={{ '--lid-index': index } as CSSProperties} fill="#000" />
          ))}
        </svg>
      </div>
      <div className="cinema-scene-caption mono" aria-hidden="true"><span>01 / FRONTIER</span><span>PRODUCTS · SYSTEMS · RESEARCH</span></div>
      <div className="cinema-bottom">
        <div className="cinema-aside mono"><span>PORTFOLIO / 2026</span><span>FOUNDER — APHELION</span><span>HYDERABAD, INDIA</span></div>
        <div className="cinema-intro">
          <p className="cinema-eyebrow">PODUVU DHARANTEJ REDDY / ENGINEER & FOUNDER</p>
          <h1 id="hero-title">I BUILD WHAT<br /><em>COMES NEXT.</em></h1>
          <p className="cinema-deck">Products, adaptive AI systems and infrastructure — designed, engineered and brought to life from first principles.</p>
          <div className="cinema-actions">
            <Link to="/projects" className="cinema-primary"><span aria-hidden="true">↗</span> EXPLORE THE WORK</Link>
            <Link to="/about" className="cinema-secondary">THE PERSON BEHIND IT <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="cinema-counter mono"><strong>{String(projectCount).padStart(2, '0')}</strong><span>DOCUMENTED PROJECTS</span></div>
      </div>
      <div className="cinema-footline mono"><span>ARCHITECTURE BEFORE AESTHETICS. PROOF BEFORE PROMISES.</span><span>SCROLL TO DISCOVER ↓</span></div>
    </section>
  );
}
