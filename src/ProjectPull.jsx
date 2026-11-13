import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";

export default function ProjectPull({ children }) {
  const root = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 95, damping: 25, mass: .6 });
  const y = useTransform(progress, [0, .32, .52, .76, 1], [220, 0, 0, -180, -260]);
  const rotateX = useTransform(progress, [0, .32, .52, .76, 1], [22, 0, 0, -16, -22]);
  const scale = useTransform(progress, [0, .32, .52, .76, 1], [.8, 1, 1, .86, .8]);
  const opacity = useTransform(progress, [0, .22, .32, .52, .76, 1], [0, 0, 1, 1, 0, 0]);
  return <div ref={root} className="project-pull-stage">
    <motion.article className="project-showcase" style={reduce ? undefined : { y, rotateX, scale, opacity, transformOrigin: "50% 70%" }}>
      {children}
    </motion.article>
  </div>;
}
