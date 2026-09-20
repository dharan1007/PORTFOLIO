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

    const finePointer = window.matchMedia('(pointer: fine)');
    let visible = true;
    let documentVisible = document.visibilityState !== 'hidden';
    let raf = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let points = createGrid(1, 1, 21);
    let pointerTarget: WavePointer = null;
    let pointer: WavePointer = null;
    let frame = 0;
    let startedAt = performance.now();

    const draw = (time: number) => {
      const elapsed = time - startedAt;
      ctx.clearRect(0, 0, width, height);
      frame += 1;

      if (frame % 12 === 0) {
        host.dataset.waveFrame = String(frame);
        host.dataset.waveTime = String(Math.round(elapsed));
      }

      if (pointerTarget && finePointer.matches) {
        if (!pointer) pointer = { ...pointerTarget };
        pointer.x += (pointerTarget.x - pointer.x) * 0.2;
        pointer.y += (pointerTarget.y - pointer.y) * 0.2;
      } else if (pointer) {
        pointer.x += (width * 0.72 - pointer.x) * 0.025;
        pointer.y += (height * 0.46 - pointer.y) * 0.025;
      }

      for (const point of points) {
        const sample = sampleWave(point, elapsed, pointer);
        ctx.beginPath();
        ctx.arc(sample.x, sample.y, sample.radius, 0, Math.PI * 2);
        ctx.fillStyle = sample.accent
          ? 'rgba(170, 184, 20,' + Math.min(0.98, sample.alpha) + ')'
          : 'rgba(12, 13, 11,' + sample.alpha + ')';
        ctx.fill();
      }
    };

    const tick = (time: number) => {
      draw(time);
      if (visible && documentVisible) {
        raf = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      cancelAnimationFrame(raf);
      draw(performance.now());
      if (visible && documentVisible) {
        host.dataset.waveState = 'running';
        raf = requestAnimationFrame(tick);
      } else {
        host.dataset.waveState = 'paused';
      }
    };

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

      const spacing = width < 520 ? 25 : width < 760 ? 22 : 19;
      points = createGrid(width, height, spacing);
      draw(performance.now());
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
      start();
    };

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(resize)
      : null;

    if (resizeObserver) {
      resizeObserver.observe(host);
    } else {
      window.addEventListener('resize', resize, { passive: true });
    }

    const intersectionObserver = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver((entries) => {
          visible = entries[0]?.isIntersecting ?? true;
          start();
        }, { threshold: 0.01 })
      : null;

    intersectionObserver?.observe(host);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    startedAt = performance.now();
    host.dataset.waveState = 'running';
    start();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div
      className="hero-wave"
      ref={hostRef}
      data-testid="hero-wave"
      data-wave-state="booting"
      aria-hidden="true"
    >
      <div className="hero-wave-fallback" data-testid="hero-wave-fallback" />
      <canvas ref={canvasRef} data-hero-wave-canvas />
    </div>
  );
}
