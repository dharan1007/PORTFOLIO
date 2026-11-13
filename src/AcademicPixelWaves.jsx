import { useEffect, useRef } from "react";

export default function AcademicPixelWaves() {
  const canvas = useRef(null);
  useEffect(() => {
    const node = canvas.current, ctx = node.getContext("2d");
    if (!ctx) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, visible = true;
    const paint = now => {
      frame = 0;
      if (!visible || document.hidden) return;
      const w = node.width, h = node.height, t = preference.matches ? 0 : now * .0003;
      ctx.fillStyle = "#10070b"; ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const wave = Math.sin(x*.075+t+Math.sin(y*.08-t)*1.8);
          const crest = Math.pow(Math.max(0, wave), 7);
          const glow = .12 + crest*.65;
          ctx.fillStyle = `rgba(137,30,57,${glow})`;
          ctx.fillRect(x,y,1,1);
          if (crest > .93 && (x+y)%4 === 0) {
            ctx.fillStyle = `rgba(255,255,255,${(crest-.93)*3})`;
            ctx.fillRect(x,y,1,1);
          }
        }
      }
      if (!preference.matches) frame = requestAnimationFrame(paint);
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const resize = new ResizeObserver(() => {
      node.width = Math.max(1,Math.ceil(node.clientWidth/9));
      node.height = Math.max(1,Math.ceil(node.clientHeight/9));
      wake();
    });
    resize.observe(node);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); });
    observer.observe(node);
    document.addEventListener("visibilitychange",wake);
    preference.addEventListener("change",wake);
    wake();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange",wake); preference.removeEventListener("change",wake); };
  }, []);
  return <canvas className="edu-pixel-waves" ref={canvas} aria-hidden="true" />;
}
