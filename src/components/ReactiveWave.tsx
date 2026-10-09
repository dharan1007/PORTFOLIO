import { useEffect } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

/** Vector ribbons with pointer-driven spring parallax; no rerender on pointermove. */
const strands=Array.from({length:11},(_,i)=>({
  a:'M -100 '+(125+i*35)+' C 160 '+(-95+i*29)+', 350 '+(465+i*4)+', 750 '+(188+i*26)+' S 1165 '+(160+i*18)+', 1570 '+(170+i*12),
  b:'M -100 '+(165+i*28)+' C 220 '+(65+i*14)+', 430 '+(370+i*19)+', 750 '+(140+i*26)+' S 1190 '+(245+i*10)+', 1570 '+(145+i*20),
  opacity:Math.max(.11,.49-i*.029)
}));
export function ReactiveWave({className=''}:{className?:string}){
  const reduced=useReducedMotion();
  const mx=useMotionValue(0),my=useMotionValue(0);
  const sx=useSpring(mx,{stiffness:45,damping:22,mass:1.2});
  const sy=useSpring(my,{stiffness:42,damping:24,mass:1.2});
  const backX=useTransform(sx,value=>value*-.46);
  const backY=useTransform(sy,value=>value*-.35);
  useEffect(()=>{
    if(reduced || window.matchMedia('(pointer: coarse)').matches)return;
    let raf=0,lastX=0,lastY=0;
    const update=()=>{
      raf=0; mx.set(Math.max(-46,Math.min(46,lastX*.034))); my.set(Math.max(-42,Math.min(42,lastY*.05)));
    };
    const track=(e:PointerEvent)=>{
      lastX=e.clientX-window.innerWidth*.64;
      lastY=e.clientY-window.innerHeight*.48;
      if(!raf)raf=requestAnimationFrame(update);
    };
    const clear=()=>{mx.set(0);my.set(0);};
    window.addEventListener('pointermove',track,{passive:true});
    window.addEventListener('blur',clear);
    return()=>{window.removeEventListener('pointermove',track);window.removeEventListener('blur',clear);cancelAnimationFrame(raf);};
  },[mx,my,reduced]);
  return <div className={'reactive-wave '+className} aria-hidden="true" data-reactive-wave>
    <motion.svg viewBox="0 0 1400 750" preserveAspectRatio="xMidYMid slice" className="reactive-wave-svg"
      style={reduced?undefined:{x:sx,y:sy}}>
      <defs>
        <linearGradient id="reactive-stroke" x1="0" x2="1" y1=".3" y2=".7">
          <stop offset="0" stopColor="#9363dc" stopOpacity="0"/>
          <stop offset=".32" stopColor="#937bcf" stopOpacity=".56"/>
          <stop offset=".6" stopColor="#b8c0eb" stopOpacity=".91"/>
          <stop offset="1" stopColor="#7793c2" stopOpacity=".03"/>
        </linearGradient>
        <radialGradient id="reactive-fog"><stop offset="0" stopColor="#857ac6" stopOpacity=".22"/><stop offset="1" stopColor="#857ac6" stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse cx="800" cy="360" rx="550" ry="380" fill="url(#reactive-fog)"/>
      {strands.map((strand,i)=><motion.path key={i} d={strand.a} fill="none"
        stroke="url(#reactive-stroke)" strokeWidth={i%3===0?1.6:.8} strokeOpacity={strand.opacity}
        initial={false} animate={reduced?undefined:{d:[strand.a,strand.b,strand.a]}}
        transition={reduced?undefined:{duration:9+i*.48,repeat:Infinity,ease:'easeInOut',delay:i*.13}}/>)}
    </motion.svg>
    <motion.div className="reactive-wave-aura" style={reduced?undefined:{x:backX,y:backY}}/>
  </div>;
}
