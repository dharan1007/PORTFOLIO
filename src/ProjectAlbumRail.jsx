import { useEffect, useRef, useState } from "react";
import { albumPose } from "./project-album-math.js";
import "./project-album-rail.css";

// Original CSS geometry; this is the portfolio fallback, not the licensed Album Rail component.
export default function ProjectAlbumRail({ items = [], position = 0, onIndexChange, onSelect }) {
  const root = useRef(null), drag = useRef(null), suppressClick = useRef(false), resetTimer = useRef(0);
  const [livePosition, setLivePosition] = useState(position);
  const [running, setRunning] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const max = Math.max(0, items.length - 1);
  const bounded = (value) => Math.max(0, Math.min(max, value));
  const current = Math.round(bounded(livePosition));

  useEffect(() => { if (!drag.current) setLivePosition(position); }, [position]);
  useEffect(() => {
    const node = root.current;
    let visible = false;
    const sync = () => setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    if (node) observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); clearTimeout(resetTimer.current); };
  }, []);

  function choose(index) {
    const next = Math.round(bounded(index));
    setLivePosition(next);
    onIndexChange?.(next);
  }
  function begin(event) {
    if (event.button !== 0 || event.target.closest(".album-nav")) return;
    drag.current = { x: event.clientX, y: event.clientY, position: livePosition, active: false, pointer: event.pointerId };
  }
  function move(event) {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (!gesture.active) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { drag.current = null; return; }
      if (Math.abs(dx) < 6) return;
      gesture.active = true;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const sleeve = root.current?.querySelector(".album-item");
    const stride = Math.max(100, (sleeve?.offsetWidth || 300) * 0.67);
    const next = bounded(gesture.position - dx / stride);
    gesture.latest = next;
    setLivePosition(next);
  }
  function finish(event) {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (gesture.active) {
      choose(gesture.latest ?? gesture.position);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => { suppressClick.current = false; }, 0);
    }
  }
  if (!items.length) return <p className="album-empty" role="status">Project previews are not available.</p>;

  return <section
    ref={root}
    className={`album-rail${running ? " album-running" : ""}${drag.current?.active ? " album-dragging" : ""}`}
    aria-label="Project album collection"
    aria-roledescription="carousel"
    data-renderer="original-css-album-rail"
    onPointerDown={begin}
    onPointerMove={move}
    onPointerUp={finish}
    onPointerCancel={finish}
    onClickCapture={(event) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); } }}
    onKeyDown={(event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        choose(current + (event.key === "ArrowRight" ? 1 : -1));
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault(); choose(event.key === "Home" ? 0 : max);
      }
    }}
  >
    <div className="album-perspective">
      {items.map((item, index) => {
        const relative = index - bounded(livePosition), pose = albumPose(relative);
        const active = index === current;
        return <button
          key={item.id || item.title}
          type="button"
          className={`album-item${active ? " album-active" : ""}`}
          aria-label={`${active ? "Open" : "Focus"} ${item.title}${item.subtitle ? `, ${item.subtitle}` : ""}`}
          aria-current={active ? "true" : undefined}
          data-project-id={item.id}
          style={{ transform: `translate3d(calc(-50% + ${pose.x}%), -50%, ${pose.z}px) rotateY(${pose.rotateY}deg) rotateZ(${pose.rotateZ}deg) scale(${pose.scale})`, zIndex: 20 - Math.round(Math.abs(relative) * 2), "--album-dim": pose.dim }}
          onClick={() => active ? onSelect?.(item, index) : choose(index)}
        >
          <span className="album-record" aria-hidden="true"><span className="album-record-label"><b>{item.title}</b><small>PROJECT ARCHIVE</small></span></span>
          <span className="album-sleeve">
            <span className="album-sleeve-top"><span>SELECTED WORK</span><span>{String(index + 1).padStart(2, "0")}</span></span>
            <span className="album-artwork">
              {!failedImages.has(item.id || item.title) ? <img src={item.src} alt={item.alt || `${item.title} website preview`} loading={Math.abs(relative) < 2 ? "eager" : "lazy"} draggable="false" onError={() => setFailedImages((previous) => new Set(previous).add(item.id || item.title))} /> : <span className="album-image-fallback">{item.title}<small>Preview unavailable</small></span>}
            </span>
            <span className="album-sleeve-bottom"><strong>{item.title}</strong><span>{item.subtitle || "Software / Product engineering"}</span></span>
            <span className="album-shade" aria-hidden="true" />
          </span>
        </button>;
      })}
    </div>
    <div className="album-controls">
      <button className="album-nav" type="button" aria-label="Previous project" onClick={() => choose(current - 1)} disabled={current === 0}>←</button>
      <p aria-live="polite"><span>{String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span><strong>{items[current]?.title}</strong><small>SELECT A SLEEVE TO EXPLORE</small></p>
      <button className="album-nav" type="button" aria-label="Next project" onClick={() => choose(current + 1)} disabled={current === max}>→</button>
    </div>
  </section>;
}
