import { useEffect, useRef, useState, type CSSProperties, type PropsWithChildren, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, ArrowRight, MoveUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { FloatObject } from './FloatObject';
import { PortfolioMotionContext } from './PortfolioMotion';
import { ProjectPreview, hasDedicatedWebsite } from './ProjectPreview';
import { orderedProjects, getProjectById, type Project } from '../data/projects';

const featured = ['raedius', 'arkhe', 'spool'] as const;
const accentByProject: Record<string,string> = {
  raedius:'#caa5b1', arkhe:'#c4b5d0', spool:'#a7bcc4'
};
const skills = [
  ['01','Product engineering','Building usable products end to end: interactions, frontend, APIs, persistence, identity and systems integration.'],
  ['02','Adaptive intelligence','Exploring agent environments, local execution and alternative computational architectures with explicit constraints.'],
  ['03','Platform infrastructure','Designing data flows, developer tooling, migration systems and durable operational boundaries.'],
  ['04','Interaction & motion','Shaping purposeful interfaces with typography, motion, performance and a clear route from intent to action.'],
  ['05','Verification & research','Testing real behavior, diagnosing failures and distinguishing documented evidence from experimental ambition.']
] as const;

const gallery = orderedProjects().filter(hasDedicatedWebsite);
const galleryOne = gallery.filter((_,i)=>i%2===0);
const galleryTwo = gallery.filter((_,i)=>i%2===1);

/** Avoid needless viewport animation for visitors who prefer reduced motion. */
function Fade({children,delay=0,y=30,x=0,duration=.7,className=''}:PropsWithChildren<{
 delay?:number;y?:number;x?:number;duration?:number;className?:string
}>){
 const reduced=useReducedMotion();
 return <motion.div className={className}
   initial={reduced?false:{opacity:0,y,x}}
   whileInView={{opacity:1,y:0,x:0}}
   viewport={{once:true,amount:0,margin:'50px'}}
   transition={{duration:reduced?0:duration,delay:reduced?0:delay,ease:[.25,.1,.25,1]}}>
    {children}
 </motion.div>;
}

function ContactPill({label='CONTACT ME',className=''}:{label?:string;className?:string}){
 return <Link className={'creator-contact-pill '+className} to="/contact"><span>{label}</span><ArrowUpRight size={18} strokeWidth={1.9}/></Link>;
}

function Magnet({children}:PropsWithChildren){
 const box=useRef<HTMLDivElement>(null);
 const reduced=useReducedMotion();
 const enabled=usePortfolioMotion();
 const tx=useMotionValue(0),ty=useMotionValue(0);
 const x=useSpring(tx,{stiffness:170,damping:24,mass:.6});
 const y=useSpring(ty,{stiffness:170,damping:24,mass:.6});
 useEffect(()=>{
   if(reduced || !enabled || typeof window==='undefined' || window.matchMedia('(pointer:coarse)').matches){tx.set(0);ty.set(0);return;}
   const onMove=(ev:PointerEvent)=>{
     const rect=box.current?.getBoundingClientRect();
     if(!rect)return;
     const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
     const dx=ev.clientX-cx,dy=ev.clientY-cy;
     if(Math.abs(dx)<rect.width/2+150&&Math.abs(dy)<rect.height/2+150){
       tx.set(Math.max(-34,Math.min(34,dx/3)));
       ty.set(Math.max(-34,Math.min(34,dy/3)));
     } else {tx.set(0);ty.set(0);}
   };
   const reset=()=>{tx.set(0);ty.set(0);};
   window.addEventListener('pointermove',onMove,{passive:true});
   window.addEventListener('blur',reset);
   return()=>{window.removeEventListener('pointermove',onMove);window.removeEventListener('blur',reset);};
 },[reduced,enabled,tx,ty]);
 return <motion.div ref={box} style={reduced||!enabled?undefined:{x,y}} className="creator-magnet">{children}</motion.div>;
}

const sitePages = [
  {path:'/',label:'HOME'},
  {path:'/projects',label:'PROJECTS'},
  {path:'/about',label:'ABOUT'},
  {path:'/experience',label:'EXPERIENCE'},
  {path:'/contact',label:'CONTACT'}
] as const;
const sectionJumps = [
  {href:'#creator-marquee',label:'LIVE WORK'},
  {href:'#creator-services',label:'SERVICES'}
] as const;
function HeroNav(){
 const [hidden,setHidden]=useState(false);
 const [menuOpen,setMenuOpen]=useState(false);
 const scroll=useScroll();
 useMotionValueEvent(scroll.scrollY,'change',value=>{
   const prev=scroll.scrollY.getPrevious()??0;
   if(menuOpen||value<90)setHidden(false);
   else if(Math.abs(value-prev)>3)setHidden(value>prev);
 });
 useEffect(()=>{
  if(!menuOpen)return;
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setMenuOpen(false);};
  document.addEventListener('keydown',escape);
  return()=>document.removeEventListener('keydown',escape);
 },[menuOpen]);
 return <header className={'creator-nav '+(hidden&&!menuOpen?'is-hidden':'')} data-creator-nav onFocusCapture={()=>setHidden(false)}>
  <nav aria-label="Portfolio main navigation" className="creator-nav-inner">
    <Link className="creator-nav-brand" to="/" aria-label="Dharan Tej Reddy P, home">DTR<span>.</span>P</Link>
    <div className="creator-nav-pages">
      {sitePages.map(page=><Link key={page.path} to={page.path}
         aria-current={page.path==='/'?'page':undefined}>{page.label}</Link>)}
    </div>
    <div className="creator-nav-jumps">
      {sectionJumps.map(item=><a key={item.href} href={item.href}>{item.label}<ArrowDownRight size={13}/></a>)}
    </div>
  </nav>
  <div className="creator-mobile-top">
    <Link to="/" aria-label="Dharan Tej Reddy P, home">DTR<span>.</span>P</Link>
    <button type="button" aria-expanded={menuOpen} aria-controls="creator-mobile-menu"
      onClick={()=>{setMenuOpen(!menuOpen);setHidden(false);}}>{menuOpen?'CLOSE':'MENU'} <ArrowUpRight size={19}/></button>
  </div>
  <nav id="creator-mobile-menu" aria-label="Mobile portfolio navigation" className={'creator-mobile-menu '+(menuOpen?'is-open':'')}>
    {sitePages.map(page=><Link key={page.path} to={page.path} onClick={()=>setMenuOpen(false)}>{page.label}<ArrowUpRight size={16}/></Link>)}
    <span className="creator-mobile-divider">ON THIS PAGE</span>
    {sectionJumps.map(item=><a key={item.href} href={item.href} onClick={()=>setMenuOpen(false)}>{item.label}<ArrowDownRight size={16}/></a>)}
  </nav>
 </header>;
}

function HeroSection(){
 return <section className="creator-hero" id="creator-home" aria-labelledby="creator-title">
   <div className="creator-dot-matrix" data-dot-matrix aria-hidden="true"/>
   <Fade className="creator-hero-copy" delay={.1} y={24}>
     <div className="creator-hero-nameplate">
       <h1 id="creator-title" aria-label="Hi, I'm Dharan Tej Reddy .P" className="hero-heading creator-hero-heading">
         <span className="creator-name-intro">HI, I'M</span>
         <span className="creator-name-major">DHARAN TEJ</span>
         <span className="creator-name-major">REDDY <i>.P</i></span>
       </h1>
       <p className="creator-name-caption">DESIGNER OF SYSTEMS. BUILDER OF PRODUCTS.</p>
     </div>
   </Fade>
   <Fade className="creator-hero-object" delay={.45}>
     <Magnet>
       <div className="creator-sculpture" aria-hidden="true">
         <div className="creator-sculpture-halo"/>
         <FloatObject name="moon" className="creator-sculpture-moon" hero delay={.1}/>
         <FloatObject name="block" className="creator-sculpture-block" hero delay={.4}/>
         <FloatObject name="pointer" className="creator-sculpture-pointer" hero delay={.8}/>
         <FloatObject name="smile" className="creator-sculpture-smile" hero delay={1.2}/>
         <span className="creator-sculpture-floor" aria-hidden="true"/>
       </div>
     </Magnet>
   </Fade>
   <div className="creator-hero-bottom">
     <Fade delay={.35} y={20} className="creator-hero-summary">
       <span className="creator-small-index">FOUNDER / ENGINEER / BUILDER</span>
       <p>I CREATE PRODUCTS, INTELLIGENT SYSTEMS AND INFRASTRUCTURE THAT CONNECT IDEAS TO REAL OUTCOMES.</p>
     </Fade>
     <Fade delay={.5} y={20}><ContactPill/></Fade>
   </div>
   <span className="creator-hero-vertical">DESIGN · ENGINEERING · INTELLIGENCE</span>
   <a href="#creator-marquee" className="creator-scroll-cue" aria-label="Scroll to work gallery"><ArrowDownRight size={20}/><span>SCROLL TO EXPLORE</span></a>
 </section>;
}

function MarqueeRow({projects,direction}:{projects:Project[];direction:'left'|'right'}){
 const viewport=useRef<HTMLDivElement>(null);
 const drag=useRef({active:false,x:0,left:0,moved:false});
 const suppressClick=useRef(false);
 const reduced=useReducedMotion();
 const [progress,setProgress]=useState(.5);
 const [isDragging,setIsDragging]=useState(false);
 useEffect(()=>{
   const el=viewport.current;
   if(!el)return;
   const raf=requestAnimationFrame(()=>{
     if(el.scrollWidth>el.clientWidth)el.scrollLeft=el.scrollWidth/3;
   });
   const onWheel=(e:WheelEvent)=>{
     if(e.shiftKey && e.deltaY!==0){
       e.preventDefault();
       el.scrollLeft+=e.deltaY;
     }
   };
   el.addEventListener('wheel',onWheel,{passive:false});
   return()=>{cancelAnimationFrame(raf);el.removeEventListener('wheel',onWheel);};
 },[projects]);
 const handleScroll=()=>{
   const el=viewport.current;
   if(!el)return;
   const third=el.scrollWidth/3;
   if(third>0){
     if(el.scrollLeft < third*.3)el.scrollLeft+=third;
     else if(el.scrollLeft > third*1.7)el.scrollLeft-=third;
     setProgress(Math.min(1,Math.max(0,(el.scrollLeft-third+el.clientWidth*.5)/third)));
   }
 };
 const onPointerDown=(e:ReactPointerEvent<HTMLDivElement>)=>{
   if(e.pointerType!=='mouse'||e.button!==0)return;
   drag.current={active:true,x:e.clientX,left:e.currentTarget.scrollLeft,moved:false};
 };
 const onPointerMove=(e:ReactPointerEvent<HTMLDivElement>)=>{
   if(!drag.current.active)return;
   const dx=e.clientX-drag.current.x;
   if(!drag.current.moved&&Math.abs(dx)>6){
     drag.current.moved=true;
     setIsDragging(true);
     e.currentTarget.setPointerCapture?.(e.pointerId);
   }
   if(drag.current.moved){
     e.currentTarget.scrollLeft=drag.current.left-dx;
     e.preventDefault();
   }
 };
 const stopPointer=(e:ReactPointerEvent<HTMLDivElement>)=>{
   if(drag.current.moved){
     suppressClick.current=true;
     window.setTimeout(()=>{suppressClick.current=false;},160);
   }
   drag.current.active=false;
   setIsDragging(false);
   if(e.currentTarget.hasPointerCapture?.(e.pointerId))e.currentTarget.releasePointerCapture?.(e.pointerId);
 };
 const scrollStep=(step:number)=>{
   const el=viewport.current;
   if(!el)return;
   const distance=Math.min(560,Math.max(290,el.clientWidth*.68));
   if(typeof el.scrollBy==='function')el.scrollBy({left:step*distance,behavior:reduced?'instant':'smooth'});
   else el.scrollLeft+=step*distance;
 };
 const keys=(e:ReactKeyboardEvent<HTMLDivElement>)=>{
   if(e.target!==e.currentTarget)return;
   if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
     e.preventDefault();scrollStep(e.key==='ArrowRight'?1:-1);
   }
 };
 const glint=(e:ReactPointerEvent<HTMLAnchorElement>)=>{
   if(e.pointerType==='touch')return;
   const rect=e.currentTarget.getBoundingClientRect();
   e.currentTarget.style.setProperty('--glint-x',((e.clientX-rect.left)/Math.max(1,rect.width)*100)+'%');
   e.currentTarget.style.setProperty('--glint-y',((e.clientY-rect.top)/Math.max(1,rect.height)*100)+'%');
 };
 return <div className={'creator-marquee-row marquee-'+direction} data-scrollable-gallery={direction}>
   <div className="creator-marquee-row-toolbar">
     <span>{direction==='right'?'01 / ACTIVE PRODUCTS':'02 / MORE LIVE SURFACES'}</span>
     <div className="creator-marquee-controls">
       <span className="creator-gallery-hint">DRAG · SWIPE · SHIFT + WHEEL</span>
       <button type="button" aria-label={'Scroll '+direction+' gallery left'} onClick={()=>scrollStep(-1)}><ChevronLeft size={20}/></button>
       <button type="button" aria-label={'Scroll '+direction+' gallery right'} onClick={()=>scrollStep(1)}><ChevronRight size={20}/></button>
     </div>
   </div>
   <div ref={viewport} className={'creator-marquee-viewport '+(isDragging?'is-dragging':'')}
       tabIndex={0} role="region" aria-label={'Horizontally scrollable live website gallery, row '+(direction==='right'?'one':'two')}
       onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopPointer}
       onPointerCancel={stopPointer} onPointerLeave={e=>{if(!e.currentTarget.hasPointerCapture?.(e.pointerId))stopPointer(e);}}
       onClickCapture={(e:ReactMouseEvent<HTMLDivElement>)=>{if(suppressClick.current){e.preventDefault();e.stopPropagation();suppressClick.current=false;}}}
       onDragStart={e=>e.preventDefault()} onKeyDown={keys} onScroll={handleScroll}>
     <div className="creator-marquee-track">
       {Array.from({length:3},(_,copy)=>projects.map(project=><Link
         aria-label={'Explore '+project.name} to={'/projects/'+project.id} onPointerMove={glint}
         key={copy+'-'+project.id} className="creator-marquee-tile">
          <ProjectPreview project={project}/>
          <span className="creator-marquee-caption"><strong>{project.name}</strong><span>{project.category}<ArrowUpRight size={15}/></span></span>
        </Link>))}
     </div>
   </div>
   <div className="creator-marquee-progress" aria-hidden="true"><span style={{transform:'scaleX('+progress+')'}}/></div>
 </div>;
}
function MarqueeSection(){
 return <section id="creator-marquee" className="creator-marquee" aria-label="Gallery of actual deployed projects">
   <div className="creator-marquee-top"><span>02 / LIVE WORK — {String(gallery.length).padStart(2,'0')} PUBLIC WEBSITES</span><span>HORIZONTAL EXPLORATION / ACTUAL PROJECTS</span></div>
   <MarqueeRow projects={galleryOne} direction="right"/>
   <MarqueeRow projects={galleryTwo} direction="left"/>
   <div className="creator-marquee-bottom"><span>PRODUCTS</span><span>COMPUTATION</span><span>INFRASTRUCTURE</span><Link to="/projects">THE ENTIRE CATALOGUE <ArrowUpRight size={17}/></Link></div>
 </section>;
}

function AnimatedText({text}: {text:string}){
 const ref=useRef<HTMLParagraphElement>(null);
 const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start .8','end .2']});
 useMotionValueEvent(scrollYProgress,'change',progress=>{
   if(ref.current)ref.current.style.setProperty('--reading-progress',String(progress));
 });
 return <p className={'creator-animated-copy '+(reduced?'no-reveal':'')} ref={ref} aria-label={text}>
   {Array.from(text).map((ch,index)=>{
     const threshold=index/Math.max(1,text.length-1);
     return <span aria-hidden="true" className="creator-char" key={index}
      style={{'--letter-offset':threshold} as CSSProperties}>{ch===' ' ? ' ':ch}</span>;
   })}
 </p>;
}

function AboutSection(){
 const description="I'm a product engineer and founder of Aphelion, working across interactive experiences, adaptive computation, developer tools and platform infrastructure. I enjoy connecting the design of an idea to the engineering that makes it work. The work starts with curiosity and ends with evidence.";
 return <section className="creator-about" id="creator-about">
  <Fade className="creator-about-orbit creator-about-orbit-a" x={-80} y={0} delay={.1} duration={.9}><FloatObject name="moon"/></Fade>
  <Fade className="creator-about-orbit creator-about-orbit-b" x={80} y={0} delay={.15}><FloatObject name="block"/></Fade>
  <Fade className="creator-about-orbit creator-about-orbit-c" x={-80} y={0} delay={.25}><FloatObject name="smile"/></Fade>
  <Fade className="creator-about-orbit creator-about-orbit-d" x={80} y={0} delay={.3}><FloatObject name="pointer"/></Fade>
  <div className="creator-about-content">
    <Fade y={40}><h2 className="hero-heading creator-section-title">ABOUT ME</h2></Fade>
    <AnimatedText text={description}/>
    <Fade delay={.25}><ContactPill label="LET'S CONNECT"/></Fade>
    <Link className="creator-about-more" to="/about">THE FULL STORY <ArrowUpRight size={17}/></Link>
  </div>
 </section>;
}

function ServicesSection(){
 return <section className="creator-services" id="creator-services">
   <div className="creator-section-tag"><span>04 / PRACTICE</span><span>FIVE WAYS I WORK</span></div>
   <Fade><h2 className="creator-section-title creator-services-title">SERVICES</h2></Fade>
   <div className="creator-service-list">
     {skills.map(([number,title,description],index)=><Fade key={number} delay={index*.06} y={35}>
       <article className="creator-service">
        <span className="creator-service-number">{number}</span>
        <div><h3>{title}</h3><p>{description}</p></div>
        <ArrowUpRight aria-hidden="true" className="creator-service-arrow" strokeWidth={1.25}/>
       </article>
     </Fade>)}
   </div>
   <div className="creator-services-bottom"><span>WHY IT MATTERS / BUILDING AND VERIFYING ARE THE SAME JOURNEY</span><Link to="/experience">THE EXPERIENCE <ArrowUpRight size={16}/></Link></div>
 </section>;
}

function StickyProjectCard({project,index,total}:{project:Project;index:number;total:number}){
 const ref=useRef<HTMLDivElement>(null);
 const [interactive,setInteractive]=useState(false);
 const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
 const targetScale=1-(total-1-index)*.03;
 const scale=useTransform(scrollYProgress,[0,.65,1],[1,1,targetScale]);
 const alpha=accentByProject[project.id]??'#bdcbd2';
 if(!project.liveUrl)return null;
 return <div ref={ref} className="creator-card-scroll-slot">
   <motion.article className={'creator-sticky-card creator-sticky-'+project.id}
      onPointerMove={e=>{
        if(e.pointerType==='touch')return;
        const rect=e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--card-hover-x',((e.clientX-rect.left)/Math.max(1,rect.width)*100)+'%');
        e.currentTarget.style.setProperty('--card-hover-y',((e.clientY-rect.top)/Math.max(1,rect.height)*100)+'%');
      }}
      onPointerLeave={e=>{e.currentTarget.style.removeProperty('--card-hover-x');e.currentTarget.style.removeProperty('--card-hover-y');}}
      style={{top:96+index*26,scale:reduced?1:scale,'--project-tone':alpha} as CSSProperties}>
      <div className="creator-card-topline">
       <strong className="creator-card-number">0{index+1}</strong>
       <div className="creator-card-title"><span>{project.category.toUpperCase()} / {project.year}</span><h3>{project.name}</h3></div>
       <Link className="creator-live-button" to={'/projects/'+project.id}>CASE STUDY <ArrowUpRight size={17}/></Link>
      </div>
      <div className="creator-card-media" data-website-gallery={project.id}>
       <div className="creator-card-minor">
         <div className="creator-card-image creator-site-image">
           <ProjectPreview project={project} view="detail" bare/>
           <span>ACTUAL WEBSITE / DETAIL VIEW</span>
         </div>
         <div className="creator-card-image creator-site-image">
           <ProjectPreview project={project} view="mobile" bare/>
           <span>ACTUAL WEBSITE / NARROW CAPTURE</span>
         </div>
       </div>
       <div className="creator-card-major creator-site-image">
          <ProjectPreview project={project} view="desktop" large bare/>
          {interactive&&<div className="creator-embedded-view">
            <iframe title={'Live website view - '+project.name} src={project.liveUrl}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy" referrerPolicy="no-referrer"/>
          </div>}
          <div className="creator-website-actions">
            <button type="button" onClick={()=>setInteractive(open=>!open)} aria-pressed={interactive}>
              {interactive?'SHOW SCREENSHOT':'TRY LIVE VIEW'}
            </button>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">OPEN WEBSITE <ArrowUpRight size={13}/></a>
          </div>
          <span className="creator-card-main-caption">{interactive?'LIVE WEBSITE / EMBEDDING MAY BE RESTRICTED':'ACTUAL WEBSITE / SCREENSHOT CAPTURE'}</span>
       </div>
      </div>
      <p className="creator-card-summary">{project.tagline}</p>
    </motion.article>
  </div>;
}
function ProjectsSection(){
 const items=featured.map(id=>getProjectById(id)).filter((project):project is Project=>Boolean(project));
 return <section className="creator-projects" id="creator-projects">
   <div className="creator-section-tag creator-section-tag-dark"><span>05 / THE WORK</span><span>THREE DEPLOYED SYSTEMS</span></div>
   <Fade><h2 className="hero-heading creator-section-title creator-projects-title">PROJECT</h2></Fade>
   <p className="creator-projects-intro">Three deployed products across connection, computing and infrastructure. Every image in these cards is captured from the project website; open the original or explore its case study.</p>
   <div className="creator-sticky-deck">{items.map((project,index)=><StickyProjectCard key={project.id} project={project} index={index} total={items.length}/>)}</div>
   <div className="creator-projects-end">
     <div><span>NOT JUST THREE PROJECTS</span><strong>{String(orderedProjects().length).padStart(2,'0')}<small>DOCUMENTED SYSTEMS</small></strong></div>
     <Link to="/projects">EXPLORE ALL SIX DOMAINS <ArrowRight size={25}/></Link>
   </div>
   <div className="creator-last-line"><span>DESIGNED / ENGINEERED / DOCUMENTED</span><Link to="/contact">MAKE THE NEXT THING REAL <MoveUpRight size={17}/></Link></div>
 </section>;
}
export function CreatorLanding(){
 const [motionEnabled,setMotionEnabled]=useState(()=>{
   if(typeof window==='undefined'||typeof window.matchMedia!=='function')return true;
   return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 });
 return <PortfolioMotionContext.Provider value={motionEnabled}>
   <MotionConfig reducedMotion={motionEnabled?'never':'always'}>
     <div className={'creator-page '+(motionEnabled?'motion-on':'motion-off')} data-motion-enabled={String(motionEnabled)}>
       <HeroNav/>
       <button className="creator-motion-switch" type="button" data-motion-toggle
          aria-label={motionEnabled?'Pause the floating 3D objects':'Enable motion for the floating 3D objects'}
          aria-pressed={motionEnabled}
          onClick={()=>setMotionEnabled(value=>!value)}>
          <span className={'creator-motion-indicator '+(motionEnabled?'is-live':'')}/>
          {motionEnabled?'MOTION ON':'ENABLE MOTION'}
       </button>
       <HeroSection/>
       <MarqueeSection/>
       <AboutSection/>
       <ServicesSection/>
       <ProjectsSection/>
     </div>
   </MotionConfig>
 </PortfolioMotionContext.Provider>;
}
