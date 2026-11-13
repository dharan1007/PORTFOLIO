import { useEffect, useRef } from "react";
import { storyAt } from "./story.js";
import "./stage.css";

// Each chapter now owns its media; the shared stage only coordinates native scroll.
export default function CinematicStage({ reduced, onState, onReady }) {
  const callbacks = useRef({ onState, onReady });
  callbacks.current = { onState, onReady };
  useEffect(() => {
    if (reduced) return;
    let frame = 0, page = window.scrollY / Math.max(1, innerHeight), previous = 0, notified = 0;
    const tick = (now) => {
      frame = 0;
      if (document.hidden) return;
      const target = window.scrollY / Math.max(1, innerHeight);
      const delta = previous ? Math.min((now - previous) / 1000, .05) : 1 / 60;
      previous = now;
      page += (target - page) * (1 - Math.exp(-12 * delta));
      const settled = Math.abs(target - page) < .00001;
      if (settled) page = target;
      if (settled || now - notified > 40) {
        callbacks.current.onState?.(storyAt(page));
        notified = now;
      }
      if (!settled) frame = requestAnimationFrame(tick);
    };
    const wake = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(tick); };
    const visibility = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; wake(); };
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    callbacks.current.onReady?.({loaded:0,total:0,errors:[]});
    callbacks.current.onState?.(storyAt(page));
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [reduced]);
  return reduced ? null : <div className="cinematic-stage" aria-hidden="true" />;
}
