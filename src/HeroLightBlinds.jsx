import { useEffect, useRef } from "react";

// Independent animated light study; no proprietary React Bits source is embedded.
export default function HeroLightBlinds({ paused = false }) {
  const canvas = useRef(null);
  useEffect(() => {
    const node = canvas.current, context = node.getContext("2d");
    if (!context) return;
    let raf = 0, visible = true, width = 1, height = 1, pointer = .5;
    const resize = () => { width = node.clientWidth; height = node.clientHeight; node.width = width; node.height = height; };
    const draw = time => {
      raf = 0;
      if (!visible || document.hidden) return;
      context.fillStyle = "#781c38"; context.fillRect(0, 0, width, height);
      const phase = paused ? .2 : (time * .000065) % 1;
      const cx = width*.5, cy = height*.57;
      // Continuous curved folds expand away from the central opening.
      context.save();
      context.filter = `blur(${Math.max(8,width*.008)}px)`;
      for (let i = 7; i >= 0; i--) {
        const radius = (i + phase + 1) / 6;
        const rx = width*.55*radius, ry = height*.8*radius;
        const shine = context.createLinearGradient(cx-rx,0,cx+rx,0);
        shine.addColorStop(0,"#fff");shine.addColorStop(.28,"#a73a58");
        shine.addColorStop(.5,"#f8e8ed");shine.addColorStop(.72,"#9c2949");shine.addColorStop(1,"#fff");
        context.strokeStyle=shine;context.lineWidth=Math.max(16,width*.032);
        context.beginPath();
        for(let point=0;point<=120;point++){
          const angle=point/120*Math.PI*2;
          const fold=1+.065*Math.sin(angle*3+i*.5+phase*.8);
          const x=cx+Math.cos(angle)*rx*fold;
          const y=cy+Math.sin(angle)*ry*fold;
          if(point===0)context.moveTo(x,y);else context.lineTo(x,y);
        }
        context.closePath();context.stroke();
      }
      context.restore();
      context.save();context.translate(cx,cy);context.scale(width*.25,height*.56);
      const hollow=context.createRadialGradient(0,0,.45,0,0,1);
      hollow.addColorStop(0,"#781c38");hollow.addColorStop(.7,"#781c38");hollow.addColorStop(1,"#781c3800");
      context.fillStyle=hollow;context.fillRect(-1,-1,2,2);context.restore();
      if (!paused) raf = requestAnimationFrame(draw);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const move = event => { pointer = event.clientX / Math.max(1, innerWidth); wake(); };
    const observer = new ResizeObserver(() => { resize(); wake(); }); observer.observe(node);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); }); visibility.observe(node);
    window.addEventListener("pointermove", move, { passive: true }); document.addEventListener("visibilitychange", wake);
    resize(); wake();
    return () => { cancelAnimationFrame(raf); observer.disconnect(); visibility.disconnect(); window.removeEventListener("pointermove", move); document.removeEventListener("visibilitychange", wake); };
  }, [paused]);
  return <canvas ref={canvas} aria-hidden="true" />;
}
