import { useState, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

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
 const asset=threeDObjects[name],reduced=useReducedMotion();
 const [failed,setFailed]=useState(false);
 const [sourceFailed,setSourceFailed]=useState(false);
 const tx=useMotionValue(0),ty=useMotionValue(0),pitch=useMotionValue(0),yaw=useMotionValue(0);
 const x=useSpring(tx,{stiffness:180,damping:17,mass:.6});
 const y=useSpring(ty,{stiffness:180,damping:17,mass:.6});
 const rotateX=useSpring(pitch,{stiffness:170,damping:18});
 const rotateY=useSpring(yaw,{stiffness:170,damping:18});
 const reset=()=>{tx.set(0);ty.set(0);pitch.set(0);yaw.set(0);};
 const reactToPointer=(event:ReactPointerEvent<HTMLDivElement>)=>{
   if(reduced||event.pointerType==='touch')return;
   const rect=event.currentTarget.getBoundingClientRect();
   if(!rect.width||!rect.height)return;
   const nx=Math.max(-1,Math.min(1,(event.clientX-(rect.left+rect.width*.5))/(rect.width*.5)));
   const ny=Math.max(-1,Math.min(1,(event.clientY-(rect.top+rect.height*.5))/(rect.height*.5)));
   tx.set(nx*18);ty.set(ny*17);
   pitch.set(-ny*16);yaw.set(nx*18);
 };
 return <motion.div
    aria-hidden="true"
    data-reactive-object={name}
    className={'float-object float-'+name+' '+className}
    style={reduced?undefined:{x,y,rotateX,rotateY,transformPerspective:900}}
    onPointerMove={reactToPointer}
    onPointerLeave={reset}
    onPointerCancel={reset}
    whileHover={reduced?undefined:{scale:1.095,filter:'brightness(1.11)'}}
    transition={{type:'spring',stiffness:230,damping:22}}>
    <motion.div className="float-object-inner"
      animate={reduced?undefined:{y:[0,-13,0],rotateZ:[-2,2,-2]}}
      transition={reduced?undefined:{duration:6+delay,delay:delay*.55,ease:'easeInOut',repeat:Infinity}}>
      {!sourceFailed?<img draggable={false} loading={hero?'eager':'lazy'} decoding="async"
        src={failed?asset.fallback:asset.url} alt=""
        onError={()=>{if(!failed)setFailed(true);else setSourceFailed(true);}}/>:
        <span className="float-fallback" aria-hidden="true">{name==='moon'?'◐':name==='block'?'◇':name==='smile'?'◡':'➚'}</span>}
    </motion.div>
  </motion.div>;
}
