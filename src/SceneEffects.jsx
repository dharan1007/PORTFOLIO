import { shots } from "./story.js";
import GradientWaves from "./reactbits/GradientWaves.jsx";
import "./scene-effects.css";

export default function SceneEffects({ state }) {
  if (shots[state.index]?.kind === "project") return null;
  if (shots[state.index]?.kind !== "portrait") return null;
  return <div className="project-gradient-background" aria-hidden="true">
    <GradientWaves horizonColor="#300713" waveColor="#641329" crestColor="#e5c9d1"
      backgroundColor="#3d0918" lightMode speed={0.38} amplitude={3.1} waveScale={0.78}
      waveRatio={0.48} swell={18} turbulence={8} tilt={72} zoom={1.25}
      fogDepth={13} relief={1.2} sheen={0.72} grain={0.012} brightness={0.86}
      intro={false} mouseInteraction={false} swellOnClick={false} dpr={1.5} />
  </div>;
}
