import { useState, type CSSProperties } from 'react';
import type { Project } from '../data/projects';

function previewUrl(url: string) {
  return 'https://image.thum.io/get/width/1200/crop/800/noanimate/' + url;
}

export function ProjectPreview({ project, large = false }: { project: Project; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!project.liveUrl || !/^https?:\/\//.test(project.liveUrl)) return null;

  return (
    <div className={'live-preview ' + (large ? 'live-preview-large' : '')} style={{ '--accent': project.accent } as CSSProperties}>
      <div className="live-preview-fallback">
        <span className="mono">LIVE SURFACE</span>
        <strong>{project.name}</strong>
        <small>{project.liveUrl}</small>
      </div>
      {!failed && (
        <img
          src={previewUrl(project.liveUrl)}
          alt={project.name + ' current public project preview'}
          loading={large ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
      <div className="live-preview-topbar">
        <span className="live-dot" />
        <span>{project.name}</span>
        <span>{failed ? 'SURFACE ↗' : 'LIVE SNAPSHOT ↗'}</span>
      </div>
    </div>
  );
}
