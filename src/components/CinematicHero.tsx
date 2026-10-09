import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { orderedProjects } from '../data/projects';
import { EditorialVideo } from './EditorialMedia';

export function CinematicHero() {
  const [animate,setAnimate]=useState(false);
  useEffect(()=>{
    let mounted=true;
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      Promise.race([
        document.fonts ? document.fonts.ready : Promise.resolve(),
        new Promise<void>(resolve=>window.setTimeout(resolve,650))
      ]).then(()=>{if(mounted)setAnimate(true);});
    }
    return()=>{mounted=false;};
  },[]);

  return <section className={'cinematic-hero sculpture-hero '+(animate?'cinema-animate':'')} aria-labelledby="hero-title">
    <div className="cinema-photo sculpture-field" aria-hidden="true">
      <EditorialVideo asset="hero" className="hero-licensed-video" priority/>
      <div className="cinema-warmth"/>
      <div className="cinema-vignette"/>
      <div className="hero-media-note mono">MICROELECTRONICS / REAL FILM</div>
    </div>
    <div className="cinema-band" aria-hidden="true">
      <svg className="cinema-wordmark" viewBox="0 0 1280 190" preserveAspectRatio="none" focusable="false">
        <defs><mask id="cinematic-word-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="1280" height="190">
          <rect width="1280" height="190" fill="white"/>
          <text x="12" y="161" textLength="1256" lengthAdjust="spacingAndGlyphs" fill="#000" fontFamily="'Hanken Grotesk Variable', 'Arial Black', sans-serif" fontSize="189" fontWeight="900" letterSpacing="-8">DHARANTEJ</text>
        </mask></defs>
        <rect width="1280" height="190" fill="#000" mask="url(#cinematic-word-cut)"/>
        {Array.from({length:9},(_,index)=><rect key={index} className="cinema-lid" x={index*1280/9} y="5" width={1280/9+1} height="182" style={{'--lid-index':index} as CSSProperties} fill="#000"/>)}
      </svg>
    </div>
    <div className="cinema-scene-caption mono" aria-hidden="true"><span>01 / PHYSICAL SYSTEMS</span><span>ELECTRONICS · SOFTWARE · INTELLIGENCE</span></div>
    <div className="cinema-bottom">
      <div className="cinema-aside mono"><span>PORTFOLIO / 2026</span><span>FOUNDER — APHELION</span><span>HYDERABAD, INDIA</span></div>
      <div className="cinema-intro">
        <p className="cinema-eyebrow">PODUVU DHARANTEJ REDDY / ENGINEER & FOUNDER</p>
        <h1 id="hero-title">I BUILD WHAT<br/><em>COMES NEXT.</em></h1>
        <p className="cinema-deck">From human connection to adaptive computation. I design products, systems and the infrastructure behind them.</p>
        <div className="cinema-actions">
          <Link to="/projects" className="cinema-primary"><span aria-hidden="true">↗</span> EXPLORE THE WORK</Link>
          <Link to="/about" className="cinema-secondary">THE PERSON BEHIND IT <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="cinema-counter mono"><strong>{String(orderedProjects().length).padStart(2,'0')}</strong><span>DOCUMENTED PROJECTS</span></div>
    </div>
    <div className="cinema-footline mono"><span>ENGINEERING / DESIGN / APPLIED INTELLIGENCE</span><a href="#method">SCROLL INTO THE PROCESS ↓</a></div>
  </section>;
}
