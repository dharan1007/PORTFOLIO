import { useEffect, useRef } from "react";
import { motion, useAnimationFrame } from "motion/react";
import { barHeight } from "./motion-math.js";
export default function AuroraBars({
  barCount = 28,
  colors = ["#7d2437", "#bb6774", "#dceaf4", "#dfeadd", "#ffffff00"],
  maxHeightRatio = 0.92,
  minHeightRatio = 0.18,
  speed = 0.5,
  gap = 4,
  blur = 1,
  background = "transparent",
  className = "",
}) {
  const bars = useRef([]),
    time = useRef(0);
  useAnimationFrame((_, delta) => {
    time.current += (Math.min(delta, 50) / 1000) * speed;
    bars.current.forEach((bar, i) => {
      if (bar)
        bar.style.transform = `scaleY(${barHeight(i, barCount, time.current, minHeightRatio, maxHeightRatio)})`;
    });
  });
  useEffect(
    () => () => {
      bars.current = [];
    },
    [],
  );
  const gradient = `linear-gradient(to top,${colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`).join(",")})`;
  return (
    <div
      className={`aurora-bars ${className}`}
      style={{ background }}
      aria-hidden="true"
    >
      <div className="aurora-bars__field">
        {Array.from({ length: barCount }, (_, i) => (
          <div
            className="aurora-bars__track"
            key={i}
            style={{ padding: `0 ${gap / 2}px` }}
          >
            <motion.div
              ref={(el) => (bars.current[i] = el)}
              className="aurora-bars__bar"
              style={{
                background: gradient,
                filter: `blur(${blur}px)`,
                transform: `scaleY(${barHeight(i, barCount, 0, minHeightRatio, maxHeightRatio)})`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="aurora-bars__wash" />
    </div>
  );
}
