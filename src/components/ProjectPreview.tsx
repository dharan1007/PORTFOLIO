import { useState } from 'react';
import type { Project } from '../data/projects';

export function ProjectPreview({ project, large = false }: { project: Project; large?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const canFrame = Boolean(project.liveUrl && /^https?:\/\//.test(project.liveUrl));

  if (!canFrame) return null;

  return (
    <div className={'live-preview ' + (large ? 'live-preview-large' : '')} style={{ '--accent': project.accent } as React.CSSProperties}>
      <div className="live-preview-fallback">
        <span className="mono">LIVE PREVIEW</span>
        <strong>{project.name}</strong>
        <small>{project.liveUrl}</small>
      </div>
      <iframe
        src={project.liveUrl!}
        title={project.name + ' live preview'}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        tabIndex={-1}
        aria-hidden="true"
        onLoad={() => setLoaded(true)}
        className={loaded ? 'is-loaded' : ''}
      />
      <div className="live-preview-topbar">
        <span className="live-dot" />
        <span>{project.name}</span>
        <span>LIVE ↗</span>
      </div>
    </div>
  );
}
