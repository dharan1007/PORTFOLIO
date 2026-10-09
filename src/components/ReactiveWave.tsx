import { useEffect, type CSSProperties } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePortfolioMotion } from './PortfolioMotion';

/** Continuous flowing gold ribbons with a separate cursor-driven spring layer.
 * The flow runs autonomously even if the visitor never touches the mouse.
 */
const strands=Array.from({length:18},(_,index)=>{
 const i=index-8.5;
 const y1=165+i*17;
 const y2=355+i*17;
 const bend=140-i*7;
 const path='M -160 '+y1+' C 120 '+(y1-bend)+', 240 '+(y2+120)+', 570 '+y2+
      ' S 1030 '+(y1-100)+', 1580 '+(y1+125)+' S 1910 '+(y1+285)+', 2200 '+(y1-90);
 return {index,path,opacity:Math.min(.92,.32+(.7-Math.abs(i)/15)*.72)};
});
export function ReactiveWave({className=''}:{className?:string}){
 const enabled=usePortfolioMotion();
 const mx=useMotionValue(0),my=useMotionValue(0);
 const sx=useSpring(mx,{stiffness:70,damping:21,mass:.75});
 const sy=useSpring(my,{stiffness:70,damping:21,mass:.75});
 const glowX=useTransform(sx,value=>value*-.55);
 const glowY=useTransform(sy,value=>value*-.32);
 useEffect(()=>{
  if(!enabled||typeof window==='undefined'||window.matchMedia('(pointer: coarse)').matches){
    mx.set(0);my.set(0);return;
  }
  let raf=0,px=0,py=0;
  const update=()=>{
   raf=0;
   mx.set(Math.max(-86,Math.min(86,px*.12)));
   my.set(Math.max(-68,Math.min(68,py*.1)));
  };
  const move=(ev:PointerEvent)=>{
   px=ev.clientX-window.innerWidth*.52;
   py=ev.clientY-window.innerHeight*.48;
   if(!raf)raf=requestAnimationFrame(update);
  };
  const reset=()=>{mx.set(0);my.set(0);};
  window.addEventListener('pointermove',move,{passive:true});
  window.addEventListener('blur',reset);
  return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('blur',reset);cancelAnimationFrame(raf);};
 },[enabled,mx,my]);
 return <div className={'reactive-wave gold-reactive-wave '+(enabled?'is-animated ':'is-still ')+className}
   aria-hidden="true" data-reactive-wave data-wave-palette="black-gold-beige" data-wave-motion={enabled?'on':'off'}>
   <motion.svg viewBox="0 0 1400 750" preserveAspectRatio="xMidYMid slice"
      className="reactive-wave-svg" style={enabled?{x:sx,y:sy}:undefined}>
     <defs>
       <linearGradient id="gold-wave-stroke" x1="0%" y1="8%" x2="100%" y2="78%">
         <stop offset="0%" stopColor="#8C6426" stopOpacity="0.05"/>
         <stop offset="22%" stopColor="#B38842" stopOpacity=".62"/>
         <stop offset="47%" stopColor="#FFDF9B" stopOpacity=".99"/>
         <stop offset="72%" stopColor="#D9AB57" stopOpacity=".91"/>
         <stop offset="100%" stopColor="#7A542A" stopOpacity=".08"/>
       </linearGradient>
       <linearGradient id="gold-wave-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
         <stop offset="0%" stopColor="#C59B58" stopOpacity="0"/>
         <stop offset="36%" stopColor="#E9C77D" stopOpacity=".12"/>
         <stop offset="53%" stopColor="#FFF7DD" stopOpacity=".95"/>
         <stop offset="62%" stopColor="#EAC67D" stopOpacity=".2"/>
         <stop offset="100%" stopColor="#C59B58" stopOpacity="0"/>
       </linearGradient>
       <radialGradient id="gold-wave-haze">
         <stop offset="0%" stopColor="#B7873D" stopOpacity=".33"/>
         <stop offset="72%" stopColor="#AA7E39" stopOpacity=".07"/>
         <stop offset="100%" stopColor="#AA7E39" stopOpacity="0"/>
       </radialGradient>
       <filter id="gold-wave-bloom" x="-50%" y="-80%" width="220%" height="260%">
         <feGaussianBlur stdDeviation="4.6"/>
       </filter>
     </defs>
     <ellipse className="gold-wave-atmosphere" cx="795" cy="380" rx="650" ry="375" fill="url(#gold-wave-haze)"/>
     <g className="gold-wave-bundle gold-wave-bundle-primary">
       {strands.map(({index,path,opacity})=><path key={index} className="gold-wave-strand"
         d={path} fill="none" stroke="url(#gold-wave-stroke)"
         strokeWidth={index%5===0?2.1:1.14} strokeOpacity={opacity}
         strokeLinecap="round"
         style={{'--gold-index':index,'--gold-delay':(-index*.37)+'s'} as CSSProperties}/>)}
     </g>
     <g className="gold-wave-bundle gold-wave-bundle-secondary" opacity=".79">
       {strands.filter((_,i)=>i%3===0).map(({index,path})=><path key={'glow-'+index}
         d={path} fill="none" stroke="url(#gold-wave-highlight)"
         strokeWidth="3.2" strokeOpacity=".9"
         strokeDasharray="35 175" strokeLinecap="round"
         className="gold-wave-glint"
         style={{'--gold-delay':(-index*.48)+'s'} as CSSProperties}/>)}
     </g>
     <g filter="url(#gold-wave-bloom)" opacity=".18" className="gold-wave-bundle gold-wave-bundle-blur">
       {strands.filter((_,i)=>i%2===0).map(({index,path})=><path key={'bloom-'+index}
          d={path} stroke="#D4A853" strokeWidth="5" fill="none"/>)}
     </g>
   </motion.svg>
   <motion.div className="reactive-wave-aura gold-wave-aura"
     style={enabled?{x:glowX,y:glowY}:undefined}/>
 </div>;
}
