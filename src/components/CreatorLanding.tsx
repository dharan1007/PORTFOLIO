import { useEffect, useRef, useState, type CSSProperties, type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, ArrowRight, MoveUpRight } from 'lucide-react';
import { FloatObject } from './FloatObject';
import { ProjectPreview } from './ProjectPreview';
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

const gallery = orderedProjects().filter(project=>Boolean(project.liveUrl));
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
 const tx=useMotionValue(0),ty=useMotionValue(0);
 const x=useSpring(tx,{stiffness:170,damping:24,mass:.6});
 const y=useSpring(ty,{stiffness:170,damping:24,mass:.6});
 useEffect(()=>{
   if(reduced || typeof window==='undefined' || window.matchMedia('(pointer:coarse)').matches)return;
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
 },[reduced,tx,ty]);
 return <motion.div ref={box} style={reduced?undefined:{x,y}} className="creator-magnet">{children}</motion.div>;
}

function HeroNav(){
 const [hidden,setHidden]=useState(false);
 const [menuOpen,setMenuOpen]=useState(false);
 const scroll=useScroll();
 useMotionValueEvent(scroll.scrollY,'change',value=>{
   const prev=scroll.scrollY.getPrevious()??0;
   if(menuOpen||value<90)setHidden(false);
   else if(Math.abs(value-prev)>3)setHidden(value>prev);
 });
 useEffect(()=>{if(!menuOpen)return;const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setMenuOpen(false);};document.addEventListener('keydown',escape);return()=>document.removeEventListener('keydown',escape);},[menuOpen]);
 const links=[['#creator-about','ABOUT'],['#creator-services','SERVICES'],['#creator-projects','PROJECTS'],['/contact','CONTACT']] as const;
 return <header className={'creator-nav '+(hidden&&!menuOpen?'is-hidden':'')} data-creator-nav>
  <nav aria-label="Home page navigation" className="creator-nav-inner">
   {links.map(([href,label])=>href.startsWith('#')?
    <a key={href} href={href} onClick={()=>setMenuOpen(false)}>{label}</a>:
    <Link key={href} to={href} onClick={()=>setMenuOpen(false)}>{label}</Link>)}
  </nav>
  <div className="creator-mobile-top">
   <Link to="/" aria-label="Home">DR / 26</Link>
   <button type="button" aria-expanded={menuOpen} aria-controls="creator-mobile-menu" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'CLOSE':'MENU'} <ArrowUpRight size={19}/></button>
  </div>
  <nav id="creator-mobile-menu" aria-label="Mobile navigation" className={'creator-mobile-menu '+(menuOpen?'is-open':'')}>
    {links.map(([href,label])=>href.startsWith('#')?<a key={href} href={href} onClick={()=>setMenuOpen(false)}>{label}</a>:<Link key={href} to={href} onClick={()=>setMenuOpen(false)}>{label}</Link>)}
   </nav>
 </header>;
}

function HeroSection(){
 return <section className="creator-hero" id="creator-home" aria-labelledby="creator-title">
   <Fade className="creator-hero-copy" delay={.15} y={40}>
     <h1 id="creator-title" aria-label={"Hi, I'm Dharantej"} className="hero-heading creator-hero-heading"><span>HI, I'M</span><span>DHARANTEJ</span></h1>
   </Fade>
   <Fade className="creator-hero-object" delay={.6}>
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

function MarqueeRow({projects,direction}: {projects:Project[],direction:'left'|'right'}){
 const track=useRef<HTMLDivElement>(null);
 const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:track,offset:['start end','end start']});
 const right=useTransform(scrollYProgress,[0,1],[-330,330]);
 const left=useTransform(scrollYProgress,[0,1],[330,-330]);
 return <div className="creator-marquee-viewport" ref={track}>
  <motion.div className="creator-marquee-track" style={reduced?undefined:{x:direction==='right'?right:left}}>
   {Array.from({length:3},(_,copy)=>projects.map((project,index)=><Link
       aria-label={'Explore '+project.name} to={'/projects/'+project.id}
       key={copy+'-'+project.id} className="creator-marquee-tile">
        <ProjectPreview project={project}/>
        <span className="creator-marquee-caption"><strong>{project.name}</strong><span>{project.category}<ArrowUpRight size={15}/></span></span>
      </Link>))}
  </motion.div>
 </div>;
}
function MarqueeSection(){
 return <section id="creator-marquee" className="creator-marquee" aria-label="Gallery of actual deployed projects">
   <div className="creator-marquee-top"><span>SELECTED LIVE SURFACES / {String(gallery.length).padStart(2,'0')}</span><span>REAL PROJECTS — NOT DEMO TEMPLATE WORK</span></div>
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
 return <MotionConfig reducedMotion="user">
  <div className="creator-page">
   <HeroNav/>
   <HeroSection/>
   <MarqueeSection/>
   <AboutSection/>
   <ServicesSection/>
   <ProjectsSection/>
  </div>
 </MotionConfig>;
}
