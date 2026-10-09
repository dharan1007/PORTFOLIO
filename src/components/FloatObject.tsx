import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
 return <motion.div
    aria-hidden="true"
    className={'float-object float-'+name+' '+className}
    animate={reduced?undefined:{y:[0,-13,0],rotateZ:[-2,2,-2]}}
    transition={reduced?undefined:{duration:6+delay,delay:delay*.55,ease:'easeInOut',repeat:Infinity}}
    style={{willChange:reduced?'auto':'transform'}}>
      {!sourceFailed?<img draggable={false} loading={hero?'eager':'lazy'} decoding="async"
        src={failed?asset.fallback:asset.url} alt=""
        onError={()=>{if(!failed)setFailed(true);else setSourceFailed(true);}}/>:
        <span className="float-fallback" aria-hidden="true">{name==='moon'?'◐':name==='block'?'◇':name==='smile'?'◡':'➚'}</span>}
  </motion.div>;
}
