import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const stages = [
 { number:'01', title:'Observe the gap.', verb:'NOTICE', text:'Start with the behavior people need, not a feature checklist. Map the friction, constraints and real-world context before sketching the interface.', label:'PROBLEM → INTENT' },
 { number:'02', title:'Find the structure.', verb:'DESIGN', text:'Turn intent into a system: interactions, state, contracts, boundaries and the technical decisions that make the experience coherent.', label:'INTENT → ARCHITECTURE' },
 { number:'03', title:'Make it tangible.', verb:'BUILD', text:'Bring product, frontend, backend and infrastructure together. Each layer matters because someone eventually has to use the whole thing.', label:'ARCHITECTURE → PRODUCT' },
 { number:'04', title:'Prove it works.', verb:'VERIFY', text:'Test the real path, investigate failures, record the limitations and improve the next version. A convincing demo is not the same thing as operating evidence.', label:'PRODUCT → EVIDENCE' }
] as const;

export function ScrollNarrative() {
  const host = useRef<HTMLElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const sections = useRef<Array<HTMLDivElement | null>>([]);
  const [active,setActive] = useState(0);

  useEffect(()=>{
    const node=host.current, visualNode=visual.current;
    if(!node || !visualNode) return;
    const observer = new IntersectionObserver(entries=>{
      const visible = entries.filter(item=>item.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
      if(visible[0]) {
        const index=Number((visible[0].target as HTMLElement).dataset.index);
        if(Number.isFinite(index)) setActive(index);
      }
    },{rootMargin:'-16% 0px -25% 0px',threshold:[0,.15,.4,.7]});
    sections.current.forEach(section=>section&&observer.observe(section));
    let raf=0;
    const scroll=()=>{
      if(raf) return;
      raf=requestAnimationFrame(()=>{
        raf=0;
        const rect=node.getBoundingClientRect(), span=Math.max(1,rect.height-window.innerHeight);
        const value=Math.max(0,Math.min(1,-rect.top/span));
        visualNode.style.setProperty('--story-progress',String(value));
      });
    };
    window.addEventListener('scroll',scroll,{passive:true});
    window.addEventListener('resize',scroll,{passive:true});
    scroll();
    return()=>{observer.disconnect();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);cancelAnimationFrame(raf);};
  },[]);

  return (
    <section className="scroll-saga" id="method" ref={host} aria-label="How ideas become systems">
      <div className="saga-visual" ref={visual} data-active={active}>
        <div className="saga-visual-heading"><span className="mono">02 / THE METHOD</span><span className="mono">SCROLL TO CONNECT ↓</span></div>
        <div className="saga-diagram" aria-hidden="true">
          <svg viewBox="0 0 600 650" preserveAspectRatio="xMidYMid meet">
            <defs><linearGradient id="saga-beam" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dfbb94"/><stop offset=".6" stopColor="#e9dbe0"/><stop offset="1" stopColor="#ccbdb3"/></linearGradient></defs>
            <path className="saga-guide" d="M100 120 C350 50 505 165 372 300 S80 400 227 519 S465 520 502 580"/>
            <path className="saga-beam" pathLength="1" d="M100 120 C350 50 505 165 372 300 S80 400 227 519 S465 520 502 580"/>
            {[[100,120],[372,300],[227,519],[502,580]].map(([x,y],i)=><g className={'saga-beacon '+(i===active?'is-active':'')} key={i}><circle cx={x} cy={y} r="33" className="beacon-outer"/><circle cx={x} cy={y} r="10" className="beacon-core"/><text x={x} y={y-51} textAnchor="middle">{String(i+1).padStart(2,'0')}</text></g>)}
          </svg>
          <div className="saga-center-copy"><span className="mono">CURRENT PHASE</span><strong>{stages[active].verb}</strong><span className="mono">{stages[active].label}</span></div>
        </div>
        <div className="saga-bottom"><span className="mono">ONE CONNECTED PROCESS</span><div className="saga-marks">{stages.map((stage,i)=><span key={stage.number} className={i===active?'is-active':''}/>)}</div></div>
      </div>
      <div className="saga-copy">
        <div className="saga-intro"><span className="mono">THE OPERATING PRINCIPLE</span><h2>From a question to something real.</h2><p>Building isn't a collection of isolated skills. It's a connected sequence of decisions, each changing the next.</p></div>
        {stages.map((stage,i)=>(
          <div className={'saga-step '+(i===active?'is-active':'')} key={stage.number} data-index={i} ref={node=>{sections.current[i]=node;}}>
            <span className="saga-step-number">{stage.number} / 04</span>
            <h3>{stage.title}</h3><p>{stage.text}</p><span className="saga-step-end mono">{stage.label}</span>
          </div>
        ))}
        <div className="saga-outro"><span className="mono">THE RESULT</span><p>Work worth showing, with its architecture and limitations visible.</p><Link to="/projects">EXPLORE THE SYSTEMS ↗</Link></div>
      </div>
    </section>
  );
}
