import { useEffect, useRef } from 'react';

/** Procedural, CPU-conscious kinetic sculpture — no photos, remote video,
 * WebGL dependency, or ongoing work while outside the viewport. */
export function KineticField() {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=ref.current;
    const ctx=canvas?.getContext('2d');
    if(!canvas || !ctx) return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    let width=1,height=1,dpr=1,raf=0,visible=true,documentVisible=!document.hidden;
    let px=.65,py=.48,tx=.65,ty=.48,frames=0,lastPaint=0;
    const tau=Math.PI*2;
    const measure=()=>{
      const bounds=canvas.getBoundingClientRect();
      width=Math.max(1,bounds.width);height=Math.max(1,bounds.height);
      dpr=Math.min(1.65,window.devicePixelRatio||1);
      canvas.width=Math.max(1,Math.round(width*dpr));
      canvas.height=Math.max(1,Math.round(height*dpr));
      ctx.setTransform(dpr,0,0,dpr,0,0);
      paint(0);
    };
    const paint=(time:number)=>{
      const t=time*.00013;
      ctx.clearRect(0,0,width,height);
      const cx=width*(.62+(px-.5)*.045),cy=height*(.55+(py-.5)*.06);
      const r=Math.min(width*.45,height*.59);
      const halo=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.8);
      halo.addColorStop(0,'rgba(192,145,116,.27)');
      halo.addColorStop(.25,'rgba(135,107,126,.16)');
      halo.addColorStop(.58,'rgba(69,63,77,.065)');
      halo.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
      ctx.save();ctx.translate(cx,cy);
      const pitch=.65+Math.sin(t*.72)*.09;
      // Fine curved trajectories describe a moving architectural volume.
      const ringCount=width<640?18:31;
      const ringSteps=width<640?64:96;
      for(let ring=0;ring<ringCount;ring++){
        const q=ring/(ringCount-1);
        const p=(q-.5)*2;
        const depth=Math.sqrt(Math.max(.02,1-p*p));
        const rr=r*(.33+depth*.70);
        const turn=t*.75+p*.42;
        ctx.beginPath();
        for(let step=0;step<=ringSteps;step++){
          const a=step/ringSteps*tau;
          const twist=.24*Math.sin(a*3+t*2+p*1.5);
          const x=(Math.cos(a+turn)*rr + p*r*.40 + Math.sin(a*2+t+p)*r*.045);
          const y=(Math.sin(a+turn)*rr*pitch*.73 + Math.sin(a+twist+t*.2)*p*r*.32);
          const rot=.20*Math.sin(t*.5);
          const rx=x*Math.cos(rot)-y*Math.sin(rot);
          const ry=x*Math.sin(rot)+y*Math.cos(rot);
          if(step===0)ctx.moveTo(rx,ry);else ctx.lineTo(rx,ry);
        }
        ctx.strokeStyle=ring%5===0 ? 'rgba(234,211,188,'+(.25+depth*.19)+')' : 'rgba(197,161,151,'+(.075+depth*.17)+')';
        ctx.lineWidth=ring%5===0?1.2:.65;
        ctx.stroke();
      }
      const strandCount=width<640?10:16;
      for(let strand=0;strand<strandCount;strand++){
        const a=strand/strandCount*tau+t*.65;
        ctx.beginPath();
        for(let step=0;step<=52;step++){
          const p=-1+step/26, depth=Math.sqrt(Math.max(.02,1-p*p));
          const rr=r*(.33+depth*.7);
          const x=Math.cos(a+p*.42)*rr+p*r*.40;
          const y=Math.sin(a+p*.42)*rr*pitch*.73 + Math.sin(a+t*.2)*p*r*.32;
          if(step===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.strokeStyle='rgba(210,190,176,.13)';
        ctx.lineWidth=.75;ctx.stroke();
      }
      const orbitR=r*.80;
      for(let i=0;i<8;i++){
        const a=t*(i%2?1:-1)+i*tau/8;
        const x=Math.cos(a)*orbitR, y=Math.sin(a)*orbitR*.64;
        const grad=ctx.createRadialGradient(x,y,0,x,y,i%3===0?16:9);
        grad.addColorStop(0,'rgba(248,222,181,.86)');grad.addColorStop(.17,'rgba(233,184,156,.48)');grad.addColorStop(1,'rgba(233,184,156,0)');
        ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,i%3===0?16:9,0,tau);ctx.fill();
      }
      ctx.restore();
      // Static, deterministic sparse coordinates, not random particle flashing.
      for(let i=0;i<60;i++){
        const u=((i*37)%101)/101, v=((i*53)%97)/97;
        const sway=reduced.matches?0:Math.sin(t+i*1.8)*2.7;
        ctx.fillStyle='rgba(235,207,187,'+(.16+.22*Math.pow(Math.sin(i*3.2+t),2))+')';
        ctx.fillRect(u*width+sway,v*height,1,1);
      }
      if(++frames%20===0)canvas.dataset.frame=String(frames);
    };
    const tick=(time:number)=>{
      raf=0;
      px+=(tx-px)*.034;py+=(ty-py)*.034;
      if(width>=640 || time-lastPaint>=30){paint(time);lastPaint=time;}
      if(visible&&documentVisible&&!reduced.matches)raf=requestAnimationFrame(tick);
    };
    const start=()=>{cancelAnimationFrame(raf);raf=0;if(visible&&documentVisible&&!reduced.matches)raf=requestAnimationFrame(tick);else paint(0);};
    const move=(event:PointerEvent)=>{
      const bounds=canvas.getBoundingClientRect();
      if(bounds.width&&bounds.height){tx=(event.clientX-bounds.left)/bounds.width;ty=(event.clientY-bounds.top)/bounds.height;}
    };
    const change=()=>{documentVisible=!document.hidden;start();};
    const intersection=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(items=>{visible=!!items[0]?.isIntersecting;start();},{threshold:.01});
    const resize=typeof ResizeObserver==='undefined'?null:new ResizeObserver(measure);
    resize?.observe(canvas);intersection?.observe(canvas);
    if(!resize)window.addEventListener('resize',measure,{passive:true});
    canvas.addEventListener('pointermove',move,{passive:true});
    document.addEventListener('visibilitychange',change);
    reduced.addEventListener?.('change',start);
    measure();start();
    return()=>{cancelAnimationFrame(raf);resize?.disconnect();intersection?.disconnect();if(!resize)window.removeEventListener('resize',measure);canvas.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',change);reduced.removeEventListener?.('change',start);};
  },[]);
  return <canvas ref={ref} className="kinetic-field" aria-hidden="true" data-motion-field />;
}
