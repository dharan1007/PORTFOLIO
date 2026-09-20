import { useEffect, useRef } from 'react';
import { createGrid, sampleWave, type WavePointer } from '../waveMath';

export function HeroWave() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      host.dataset.waveState = 'fallback';
      return;
    }

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    let reduceMotion = reduceQuery.matches;
    let visible = true;
    let documentVisible = document.visibilityState !== 'hidden';
    let raf = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let points = createGrid(1, 1, 24);
    let pointerTarget: WavePointer = null;
    let pointer: WavePointer = null;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(1.75, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const spacing = width < 520 ? 28 : width < 760 ? 25 : 22;
      points = createGrid(width, height, spacing);
      draw(performance.now());
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      if (pointerTarget && finePointer.matches) {
        if (!pointer) pointer = { ...pointerTarget };
        pointer.x += (pointerTarget.x - pointer.x) * 0.115;
        pointer.y += (pointerTarget.y - pointer.y) * 0.115;
      } else {
        pointer = null;
      }

      for (const point of points) {
        const sample = sampleWave(point, time, pointer);
        ctx.beginPath();
        ctx.arc(sample.x, sample.y, sample.radius, 0, Math.PI * 2);
        ctx.fillStyle = sample.accent
          ? 'rgba(185, 196, 42,' + Math.min(0.76, sample.alpha) + ')'
          : 'rgba(20, 21, 18,' + sample.alpha + ')';
        ctx.fill();
      }
    };

    const tick = (time: number) => {
      draw(time);
      if (!reduceMotion && visible && documentVisible) {
        raf = requestAnimationFrame(tick);
      }
    };

    const restart = () => {
      cancelAnimationFrame(raf);
      draw(performance.now());
      if (!reduceMotion && visible && documentVisible) {
        host.dataset.waveState = 'running';
        raf = requestAnimationFrame(tick);
      } else {
        host.dataset.waveState = 'static';
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      const rect = host.getBoundingClientRect();
      pointerTarget = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    };

    const onPointerLeave = () => {
      pointerTarget = null;
    };

    const onVisibility = () => {
      documentVisible = document.visibilityState !== 'hidden';
      restart();
    };

    const onReducedMotion = () => {
      reduceMotion = reduceQuery.matches;
      restart();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      restart();
    }, { threshold: 0.02 });
    intersectionObserver.observe(host);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    reduceQuery.addEventListener('change', onReducedMotion);

    resize();
    host.dataset.waveState = reduceMotion ? 'static' : 'running';
    restart();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      reduceQuery.removeEventListener('change', onReducedMotion);
    };
  }, []);

  return (
    <div className="hero-wave" ref={hostRef} data-testid="hero-wave" data-wave-state="booting" aria-hidden="true">
      <div className="hero-wave-fallback" data-testid="hero-wave-fallback" />
      <canvas ref={canvasRef} data-hero-wave-canvas />
    </div>
  );
}
