import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { PROJECT_BACKGROUND_VIDEO } from "./contact-background.js";

export default function ProjectsSection({ projects, renderProject }) {
  const root = useRef(null), viewport = useRef(null);
  const [width, setWidth] = useState(0);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -width * (projects.length - 1)]);
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, []);
  return <section ref={root} id="projects" className="project-horizontal-gallery native-chapter" style={{ height: `${projects.length * 120}svh` }} aria-label="Projects">
    <div ref={viewport} className="project-horizontal-viewport">
      <video className="project-section-video" src={PROJECT_BACKGROUND_VIDEO} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      <motion.div className="project-horizontal-track" style={{ x }} tabIndex={0} aria-label="Project rail. Scroll to explore every project." onKeyDown={event => {
        if (!["ArrowRight", "ArrowLeft"].includes(event.key)) return;
        event.preventDefault();
        window.scrollBy({ top: (event.key === "ArrowRight" ? 1 : -1) * (root.current.offsetHeight - innerHeight) / Math.max(1, projects.length - 1), behavior: "smooth" });
      }}>
        {projects.map(project => <article key={project.id} id={`project-${project.id}`} className="project-horizontal-slide" aria-label={`${project.title} — ${project.subtitle}`}>
          <div className="project-showcase">{renderProject(project)}</div>
        </article>)}
      </motion.div>
    </div>
  </section>;
}
