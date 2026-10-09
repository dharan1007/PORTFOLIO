import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePortfolioMotion } from './PortfolioMotion';

/* Reference 3D renders were explicitly provided by the site owner.
 * CC0 3dicons are the network fallback if the original host is unavailable.
 * Replace source paths here without altering the layout components. */
export const threeDObjects = {
  moon: {
    url:'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    fallback:'https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/gradient/moon-dynamic-gradient.png',
    alt:'Translucent blue glass crescent moon, rendered in 3D'
  },
  block:{
    url:'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    fallback:'https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/gradient/cube-dynamic-gradient.png',
    alt:'Glossy translucent violet and cyan building block, rendered in 3D'
  },
  smile:{
    url:'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    fallback:'https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/gradient/star-dynamic-gradient.png',
    alt:'Iridescent purple chrome smile shape, rendered in 3D'
  },
  pointer:{
    url:'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    fallback:'https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/gradient/target-dynamic-gradient.png',
    alt:'Reflective three-dimensional arrow pointer with pearlescent highlights'
  }
} as const;

export type ObjectName = keyof typeof threeDObjects;

export function FloatObject({name,className='',delay=0,hero=false}:{
 name:ObjectName;className?:string;delay?:number;hero?:boolean
}){
 const enabled=usePortfolioMotion();
 const asset=threeDObjects[name];
 const [failed,setFailed]=useState(false);
 const [sourceFailed,setSourceFailed]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const tx=useMotionValue(0),ty=useMotionValue(0),pitch=useMotionValue(0),yaw=useMotionValue(0);
 const x=useSpring(tx,{stiffness:105,damping:17,mass:.7});
 const y=useSpring(ty,{stiffness:105,damping:17,mass:.7});
 const rotateX=useSpring(pitch,{stiffness:105,damping:18});
 const rotateY=useSpring(yaw,{stiffness:105,damping:18});
 useEffect(()=>{
   const reset=()=>{tx.set(0);ty.set(0);pitch.set(0);yaw.set(0);};
   if(!enabled||typeof window==='undefined'||window.matchMedia('(pointer: coarse)').matches){reset();return;}
   let frame=0,mouseX=0,mouseY=0;
   const update=()=>{
     frame=0;
     const rect=root.current?.getBoundingClientRect();
     if(!rect||rect.height===0||rect.width===0)return;
     const cx=rect.left+rect.width*.5,cy=rect.top+rect.height*.5;
     const dx=mouseX-cx,dy=mouseY-cy;
     const reach=hero?Math.max(500,rect.width*1.65):Math.max(240,rect.width*1.3);
     const dist=Math.hypot(dx,dy);
     const falloff=Math.max(0,1-dist/reach);
     if(falloff<=0){reset();return;}
     const nx=Math.max(-1,Math.min(1,dx/(rect.width*.5+150)));
     const ny=Math.max(-1,Math.min(1,dy/(rect.height*.5+150)));
     tx.set(nx*60*falloff);
     ty.set(ny*52*falloff);
     pitch.set(-ny*22*falloff);
     yaw.set(nx*26*falloff);
   };
   const onMove=(event:PointerEvent)=>{
     if(event.pointerType==='touch')return;
     mouseX=event.clientX;mouseY=event.clientY;
     if(!frame)frame=requestAnimationFrame(update);
   };
   document.addEventListener('pointermove',onMove,{passive:true});
   window.addEventListener('blur',reset);
   return()=>{
     document.removeEventListener('pointermove',onMove);
     window.removeEventListener('blur',reset);
     cancelAnimationFrame(frame);
     reset();
   };
 },[enabled,hero,tx,ty,pitch,yaw]);
 const resetOnLeave=()=>{if(!enabled){tx.set(0);ty.set(0);pitch.set(0);yaw.set(0);}};
 return <motion.div
    ref={root}
    aria-hidden="true"
    data-reactive-object={name}
    data-float-motion={enabled?'on':'off'}
    className={'float-object float-'+name+' '+className}
    style={enabled?{x,y,rotateX,rotateY,transformPerspective:950}:undefined}
    onPointerLeave={resetOnLeave}>
    <div className="float-object-inner" style={{
      '--float-delay':(-delay)+'s',
      '--float-time':(hero?4.5+delay:5.1+delay)+'s'
    } as CSSProperties}>
      {!sourceFailed?<img draggable={false} loading={hero?'eager':'lazy'} decoding="async"
        src={failed?asset.fallback:asset.url} alt=""
        onError={()=>{if(!failed)setFailed(true);else setSourceFailed(true);}}/>:
        <span className="float-fallback" aria-hidden="true">{name==='moon'?'◐':name==='block'?'◇':name==='smile'?'◡':'➚'}</span>}
    </div>
  </motion.div>;
}
