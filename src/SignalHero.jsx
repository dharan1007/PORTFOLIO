import { Component, lazy, Suspense, useEffect, useRef } from "react";
import "./signal-hero.css";
import HeroLightBlinds from "./HeroLightBlinds.jsx";

const DitherVeil = lazy(() => import("./reactbits/DitherVeil/DitherVeil.jsx"));
const blindsSources = import.meta.glob(["./components/**/rolling-blinds*.{jsx,tsx}", "./components/**/RollingBlinds*.{jsx,tsx}"]);
const blindsSource = Object.values(blindsSources)[0];
const RollingBlinds = blindsSource ? lazy(() => blindsSource().then(module => ({ default: module.default || module.RollingBlinds }))) : null;
const IMAGE = "https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop";
class HeroVisualBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function SignalHero({ paused = false, onNavigate }) {
  const root = useRef(null), frame = useRef(null), field = useRef(null), navigate = useRef(onNavigate);
  navigate.current = onNavigate;
  useEffect(() => {
    const send = (type, active) => frame.current?.contentWindow?.postMessage({ source: "portfolio-hero-parent", type, active }, "*");
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; send("visible", visible && !document.hidden); });
    if (root.current) observer.observe(root.current);
    const message = (event) => {
      if (event.source !== frame.current?.contentWindow || event.data?.source !== "portfolio-hero") return;
      const data = event.data;
      if (data.type === "pointer" && !paused && Number.isFinite(data.x) && Number.isFinite(data.y)) {
        const target = field.current?.querySelector(".dither-veil"), box = frame.current?.getBoundingClientRect();
        if (target && box) { target.dispatchEvent(new PointerEvent("pointerenter", { clientX: box.left + data.x, clientY: box.top + data.y, pointerType: "mouse" })); target.dispatchEvent(new PointerEvent("pointermove", { clientX: box.left + Math.max(0, Math.min(box.width, data.x)), clientY: box.top + Math.max(0, Math.min(box.height, data.y)), pointerType: "mouse" })); }
      } else if (data.type === "pointer-leave") {
        field.current?.querySelector(".dither-veil")?.dispatchEvent(new PointerEvent("pointerleave"));
      } else if (data.type === "navigate" && ["about", "projects", "experience", "contact"].includes(data.id)) {
        history.replaceState(null, "", `#${data.id}`);
        navigate.current?.(data.id);
      }
    };
    const visibility = () => send("visible", visible && !document.hidden);
    const loaded = () => { send("paused", paused); visibility(); };
    const node = frame.current;
    node?.addEventListener("load", loaded);
    window.addEventListener("message", message);
    document.addEventListener("visibilitychange", visibility);
    loaded();
    return () => { observer.disconnect(); node?.removeEventListener("load", loaded); window.removeEventListener("message", message); document.removeEventListener("visibilitychange", visibility); };
  }, [paused]);
  return <section className="hero-poster-shell" ref={root} aria-label="Poduvu Dharantej Reddy — software developer, founder and product engineer">
    <div className="hero-blinds-background" aria-hidden="true"><HeroVisualBoundary><Suspense fallback={null}>{RollingBlinds ? <RollingBlinds paused={paused} color="#260912" hotColor="#7d2437" backgroundColor="#080507" /> : <HeroLightBlinds paused={paused} />}</Suspense></HeroVisualBoundary></div>
    <div ref={field} className="hero-dither-field" aria-hidden="true"><HeroVisualBoundary><Suspense fallback={null}><DitherVeil src={IMAGE} pattern="floyd" pixelSize={2} inkColor="#9c304d" paperColor="#17080e" revealRadius={200} softness={0.6} linger={1} fit="contain" paused={paused} clickBurst={false} /></Suspense></HeroVisualBoundary></div>
    <iframe ref={frame} src="/hero/index.html" title="Dharantej Reddy — personal portfolio" sandbox="allow-scripts" />
  </section>;
}
